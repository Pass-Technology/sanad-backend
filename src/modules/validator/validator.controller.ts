import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidatorService } from './validator.service';
import { ValidateSwiftDto } from './dto/validate-swift.dto';
import { ValidateIbanDto } from './dto/validate-iban.dto';

@ApiTags('validator')
@Controller('validator')
export class ValidatorController {
    constructor(private readonly validatorService: ValidatorService) { }


    @Get('swift')
    @ApiOperation({ summary: 'Validate SWIFT code' })
    validateSwift(@Query() query: ValidateSwiftDto) {
        return this.validatorService.validateSwift(query);
    }

    @Get('iban')
    @ApiOperation({ summary: 'Validate IBAN' })
    validateIban(@Query() query: ValidateIbanDto) {
        return this.validatorService.validateIban(query);
    }
}
