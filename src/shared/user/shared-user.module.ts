import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { UserRepository } from '../../modules/user/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class SharedUserModule { }
