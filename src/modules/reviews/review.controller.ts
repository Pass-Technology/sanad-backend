import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';
import { ReviewService } from './review.service';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, VerificationGuard, UserTypeGuard)
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post('submit')
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Submit a review for a completed job (Client only)' })
    submitReview(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Body() dto: SubmitReviewDto
    ) {
        return this.reviewService.submitReview(req.user.userId, dto);
    }

    @Get('provider/stats')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Get rating statistics for the provider dashboard (Provider only)' })
    getProviderStats(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.reviewService.getProviderRatingStats(req.user.userId);
    }

    @Get('provider/my-reviews')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Get all reviews for the provider (Provider only)' })
    getProviderReviews(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.reviewService.getProviderReviews(req.user.userId);
    }

    @Patch('provider/:id/reply')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Reply to a client review (Provider only)' })
    replyToReview(
        @Request() req: { user: UserInfoResponseWithTokensDto },
        @Param('id') id: string,
        @Body() dto: ReplyReviewDto
    ) {
        return this.reviewService.replyToReview(req.user.userId, id, dto);
    }
}
