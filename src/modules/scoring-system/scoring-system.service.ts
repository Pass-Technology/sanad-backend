import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SCORING_CONFIG, ScoringSectionConfig, ScoringFieldConfig } from './scoring.config';
import { ScoringCacheService } from './scoring-cache.service';
import { ProfileRepository } from '../profile/profile.repository';

@Injectable()
export class ScoringSystemService {
    private readonly logger = new Logger(ScoringSystemService.name);

    constructor(
        private readonly cacheService: ScoringCacheService,
        @Inject(forwardRef(() => ProfileRepository))
        private readonly profileRepo: ProfileRepository,
    ) { }

    async getScore(userId: string) {
        let score = await this.cacheService.get(userId);
        if (!score) {
            this.logger.log(`Cache miss for user ${userId}. Recalculating...`);
            score = await this.recalculate(userId);
        }
        return score;
    }

    async recalculate(userId: string) {
        try {
            const profile = await this.profileRepo.findProfileByUserId(userId);
            const score = this.calculate(profile);
            await this.cacheService.set(userId, score);
            return score;
        } catch (error) {
            this.logger.error(`Failed to recalculate score for user ${userId}: ${error.message}`);
            return this.getEmptyScore();
        }
    }

    private calculate(data: any) {
        const results = {
            overall: 0,
            sections: [] as any[],
            missingFields: [] as string[],
        };

        let totalWeight = 0;
        let earnedWeight = 0;

        for (const section of SCORING_CONFIG) {
            const sectionalResult = this.calculateSection(section, data);
            results.sections.push({
                id: section.id,
                title: section.title,
                percentage: sectionalResult.percentage,
                missingFields: sectionalResult.missingFields,
            });

            totalWeight += sectionalResult.totalWeight;
            earnedWeight += sectionalResult.earnedWeight;
            results.missingFields.push(...sectionalResult.missingFields);
        }

        results.overall = Math.round((earnedWeight / totalWeight) * 100);
        return results;
    }

    private calculateSection(section: ScoringSectionConfig, data: any) {
        let totalWeight = 0;
        let earnedWeight = 0;
        const missingFields: string[] = [];

        for (const field of section.fields) {
            // Required = 10 weight, Optional = 5 weight (2:1 ratio)
            const weight = field.required ? 10 : 5;
            totalWeight += weight;

            const isFilled = this.isFieldFilled(field, data);
            if (isFilled) {
                earnedWeight += weight;
            } else {
                missingFields.push(field.label);
            }
        }

        return {
            totalWeight,
            earnedWeight,
            percentage: Math.round((earnedWeight / totalWeight) * 100),
            missingFields,
        };
    }

    private isFieldFilled(field: ScoringFieldConfig, data: any): boolean {
        const value = this.getNestedValue(data, field.key);

        if (value === null || value === undefined || value === '') return false;

        if (field.type === 'array') {
            return Array.isArray(value) && value.length > 0;
        }

        if (field.type === 'document') {
            if (!value) return false;
            // If it has an expiry key, check if it's expired
            if (field.expiryKey) {
                const expiryValue = this.getNestedValue(data, field.expiryKey);
                if (expiryValue) {
                    const expiryDate = new Date(expiryValue);
                    if (expiryDate < new Date()) {
                        return false; // Document expired
                    }
                }
            }
            return true;
        }

        return true;
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    private getEmptyScore() {
        return {
            overall: 0,
            sections: SCORING_CONFIG.map(s => ({
                id: s.id,
                title: s.title,
                percentage: 0,
                missingFields: s.fields.map(f => f.label)
            })),
            missingFields: SCORING_CONFIG.flatMap(s => s.fields.map(f => f.label)),
        };
    }
}
