import { Controller, Post, Get, Body, Param, UseGuards, Query, Patch, Request } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderStatus } from './enums/order-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTypes } from '../../shared/decorators/userTypes.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { UserTypeGuard } from '../../shared/guards/user-types.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, UserTypeGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Create a new order (Client only)' })
    createOrder(@Request() req: { user: UserInfoResponseWithTokensDto }, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(req.user.userId, createOrderDto);
    }

    @Patch(':id/cancel')
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Cancel an order (Client only)' })
    cancelOrder(@Request() req: { user: UserInfoResponseWithTokensDto }, @Param('id') id: string) {
        return this.ordersService.cancelOrder(req.user.userId, id);
    }

    @Post(':id/delete')
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Soft delete an order (Client only)' })
    deleteOrder(@Request() req: { user: UserInfoResponseWithTokensDto }, @Param('id') id: string) {
        return this.ordersService.deleteOrder(req.user.userId, id);
    }

    @Post('offers')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Make an offer for an order (Provider only)' })
    createOffer(@Request() req: { user: UserInfoResponseWithTokensDto }, @Body() createOfferDto: CreateOfferDto) {
        return this.ordersService.createOffer(req.user.userId, createOfferDto);
    }

    @Post('offers/:id/accept')
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Accept an offer (Client only)' })
    acceptOffer(@Request() req: { user: UserInfoResponseWithTokensDto }, @Param('id') offerId: string) {
        return this.ordersService.acceptOffer(req.user.userId, offerId);
    }

    @Get()
    @ApiOperation({ summary: 'Get list of orders (Clients see their own, Providers see available)' })
    getOrders(@Request() req: { user: UserInfoResponseWithTokensDto }, @Query() query: GetOrdersQueryDto) {
        if (req.user.type === UserType.CLIENT) {
            return this.ordersService.getOrdersForClient(req.user.userId, query);
        } else {
            return this.ordersService.getAvailableOrdersForProvider(req.user.userId, query);
        }
    }

    @Get('client')
    @UserTypes(UserType.CLIENT)
    @ApiOperation({ summary: 'Get client order history' })
    getClientOrders(@Request() req: { user: UserInfoResponseWithTokensDto }, @Query() query: GetOrdersQueryDto) {
        return this.ordersService.getOrdersForClient(req.user.userId, query);
    }

    @Get('provider/stats')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Get provider dashboard stats' })
    getProviderStats(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.ordersService.getProviderDashboardStats(req.user.userId);
    }

    @Get('provider/jobs')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Get provider jobs by type (active, completed, cancelled, available)' })
    getProviderJobs(@Request() req: { user: UserInfoResponseWithTokensDto }, @Query('type') type: string, @Query() query: GetOrdersQueryDto) {
        return this.ordersService.getProviderJobs(req.user.userId, type, query);
    }

    @Post(':id/reject')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Reject an available order' })
    rejectOrder(@Request() req: { user: UserInfoResponseWithTokensDto }, @Param('id') id: string) {
        return this.ordersService.rejectOrder(req.user.userId, id);
    }

    @Patch(':id/status')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Update job status (Start Job, Complete)' })
    updateJobStatus(@Request() req: { user: UserInfoResponseWithTokensDto }, @Param('id') id: string, @Body('status') status: OrderStatus) {
        return this.ordersService.updateJobStatus(req.user.userId, id, status);
    }

    @Get('provider/workers')
    @UserTypes(UserType.PROVIDER)
    @ApiOperation({ summary: 'Get list of workers' })
    getWorkers(@Request() req: { user: UserInfoResponseWithTokensDto }) {
        return this.ordersService.getProviderWorkers(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(id);
    }
}
