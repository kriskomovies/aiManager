import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserRoleRepository } from '../../database/repositories/user-role.repository';
import { UserEntity } from '../../database/entities/user.entity';
import { UserRoleEntity } from '../../database/entities/user-role.entity';
import { ResidentEntity } from '../../database/entities/resident.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity, ResidentEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserRoleRepository],
  exports: [UsersService, UserRepository, UserRoleRepository],
})
export class UsersModule {}
