import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JobEntity } from '../marketplace/entities/job.entity';
import { JobStatus } from '../marketplace/enums/job-status.enum';
import { ProfileService as ProviderProfileService } from '../provider-profile/profile.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
        private readonly providerProfileService: ProviderProfileService,
        private readonly clientService: ClientService,
    ) { }

    async submitReview(userId: string, dto: SubmitReviewDto) {
        const client = await this.clientService.getProfile(userId);
        
        const job = await this.jobRepository.findOne({
            where: { id: dto.jobId },
            relations: { client: true, provider: true, review: true }
        });

        if (!job) throw new NotFoundException('Job not found');
        if (job.client.id !== client.id) throw new ForbiddenException('You can only review your own jobs');
        if (job.status !== JobStatus.COMPLETED) throw new BadRequestException('You can only review completed jobs');
        if (job.review) throw new BadRequestException('You have already reviewed this job');

        const review = this.reviewRepository.create({
            job,
            client,
            provider: job.provider,
            rating: dto.rating,
            comment: dto.comment,
            tags: dto.tags,
            photos: dto.photos,
            isVerified: true
        });

        return await this.reviewRepository.save(review);
    }

    async replyToReview(userId: string, reviewId: string, dto: ReplyReviewDto) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: { provider: true }
        });

        if (!review) throw new NotFoundException('Review not found');
        if (review.provider.id !== provider.id) throw new ForbiddenException('You can only reply to reviews for your services');

        review.providerReply = dto.reply;
        review.repliedAt = new Date();

        return await this.reviewRepository.save(review);
    }

    async getProviderReviews(userId: string) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        
        return await this.reviewRepository.find({
            where: { provider: { id: provider.id } },
            relations: { client: { user: true }, job: { serviceRequest: { service: true } } },
            order: { createdAt: 'DESC' }
        });
    }

    async getProviderRatingStats(userId: string) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        
        const reviews = await this.reviewRepository.find({
            where: { provider: { id: provider.id } }
        });

        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                verifiedReviews: 0,
                replyRate: 0,
                unrepliedCount: 0
            };
        }

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = parseFloat((sum / totalReviews).toFixed(1));

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let verifiedCount = 0;
        let repliedCount = 0;

        reviews.forEach(r => {
            breakdown[r.rating]++;
            if (r.isVerified) verifiedCount++;
            if (r.providerReply) repliedCount++;
        });

        // Convert breakdown to percentages
        const breakdownPercent = {};
        Object.keys(breakdown).forEach(key => {
            breakdownPercent[key] = Math.round((breakdown[key] / totalReviews) * 100);
        });

        const replyRate = Math.round((repliedCount / totalReviews) * 100);

        // Reviews this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const reviewsThisWeek = reviews.filter(r => r.createdAt >= oneWeekAgo).length;

        // Top Insights (Simplified logic based on tags and ratings)
        const allTags = reviews.flatMap(r => r.tags || []);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        const sortedTags = Object.entries(tagCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
        const mostPraised = sortedTags.length > 0 ? sortedTags[0][0] : 'Excellent Service';
        const commonIssue = sortedTags.reverse().length > 0 ? sortedTags[0][0] : 'None';

        return {
            averageRating,
            totalReviews,
            breakdown: breakdownPercent,
            verifiedReviews: verifiedCount,
            replyRate,
            unrepliedCount: totalReviews - repliedCount,
            reviewsThisWeek,
            topInsights: {
                mostPraisedService: mostPraised,
                mostCommonIssue: commonIssue,
                positiveFeedbackTrend: '+12% this month' // Mock trend for UI
            }
        };
    }
}
