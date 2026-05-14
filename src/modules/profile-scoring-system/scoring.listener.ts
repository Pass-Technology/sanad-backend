import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ScoringSystemService } from './scoring-system.service';

@Injectable()
export class ScoringListener {
    constructor(private readonly scoringService: ScoringSystemService) { }

    @OnEvent('profile.updated')
    async handleProfileUpdated(payload: { userId: string }) {
        await this.scoringService.recalculate(payload.userId);
    }
}
