import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Version('1')
    @Get()
    @ApiOperation({ summary: 'Check if the application is up and running' })
    check() {
        console.log('Everything is gonna be alright');
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
