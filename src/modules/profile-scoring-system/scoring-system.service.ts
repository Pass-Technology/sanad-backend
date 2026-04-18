import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SCORING_CONFIG } from './scoring.config';
import { ScoringSectionConfig, ScoringFieldConfig } from './interfaces/scoring-system.interfaces';
import { SharedCacheService } from '../../shared/cache/shared-cache.service';
import { ProfileRepository } from '../profile/profile.repository';

@Injectable()
export class ScoringSystemService {
    private readonly logger = new Logger(ScoringSystemService.name);
    private readonly CACHE_PREFIX = 'scoring_profile:';

    constructor(
        private readonly cacheService: SharedCacheService,
        @Inject(forwardRef(() => ProfileRepository))
        private readonly profileRepo: ProfileRepository,
    ) { }

    async getScore(userId: string) {
        let score = await this.cacheService.get(this.CACHE_PREFIX, userId);
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
            await this.cacheService.set(this.CACHE_PREFIX, userId, score);
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
        };

        let totalWeight = 0;
        let earnedWeight = 0;

        for (const section of SCORING_CONFIG) {
            const sectionalResult = this.calculateSection(section, data);
            results.sections.push({
                id: section.id,
                title: section.title,
                score: sectionalResult.percentage,
                missingFields: sectionalResult.missingFields,
            });

            totalWeight += sectionalResult.totalWeight;
            earnedWeight += sectionalResult.earnedWeight;
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

        if (field.type === 'at-least-one' && field.keysToCheck) {
            return field.keysToCheck.some(key => {
                const subValue = this.getNestedValue(data, key);
                if (subValue === null || subValue === undefined || subValue === '') return false;
                if (Array.isArray(subValue)) return subValue.length > 0;
                if (typeof subValue === 'object' && 'isEnabled' in subValue) return (subValue as any).isEnabled === true;
                return !!subValue;
            });
        }

        if (value === null || value === undefined || value === '') return false;

        if (field.type === 'array') {
            return Array.isArray(value) && value.length > 0;
        }

        if (field.type === 'document') {
            if (!value) return false;
            if (field.expiryKey) {
                const expiryValue = this.getNestedValue(data, field.expiryKey);
                if (expiryValue) {
                    const expiryDate = new Date(expiryValue);
                    if (expiryDate < new Date()) {
                        return false;
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
                score: 0,
                missingFields: s.fields.map(f => f.label)
            })),
        };
    }
}
