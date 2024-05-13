import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../decorators/currentuser.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard) 
    addOrder(@Body() order: CreateOrderDto) {
        const { userId, products } = order;
        return this.ordersService.addOrder(userId, products);
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard) 
    getOrder(@Param('id', ParseUUIDPipe) id: string, @CurrentUserId() reqUserId: string) {
        return this.ordersService.getOrder(id, reqUserId);
    }
}
