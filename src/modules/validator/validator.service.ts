import { Injectable } from '@nestjs/common';
import { ValidateIbanDto } from './dto/validate-iban.dto';
import { ValidateSwiftDto } from './dto/validate-swift.dto';

@Injectable()
export class ValidatorService {
    validateIban(dto: ValidateIbanDto) {
        return { valid: true };
    }

    validateSwift(dto: ValidateSwiftDto) {
        return { valid: true };
    }
}