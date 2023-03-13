import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '../auth/auth.module'
import { Role } from '../roles/role.model'
import { RolesModule } from '../roles/roles.module'
import { RolesService } from '../roles/roles.service'
import { UserRoles } from '../roles/user-roles.model'
import { Track } from '../track/track.model'
import { FileModule } from './../file/file.module'
import { UserController } from './user.controller'
import { User } from './user.model'
import { UserService } from './user.service'

@Module({
    controllers: [UserController],
    providers: [UserService, RolesService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Track]),
        RolesModule,
        forwardRef(() => AuthModule),
        forwardRef(() => FileModule),
    ],
    exports: [UserService],
})
export class UserModule {}
