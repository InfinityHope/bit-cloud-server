import { forwardRef, Module } from '@nestjs/common'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../user/user.model'
import { Role } from '../roles/role.model'
import { UserRoles } from '../roles/user-roles.model'
import { Track } from './track.model'
import { RolesModule } from '../roles/roles.module'
import { RolesService } from '../roles/roles.service'
import { AuthModule } from '../auth/auth.module'
import { FileModule } from '../file/file.module'

@Module({
    controllers: [TrackController],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Track]),
        RolesModule,
        FileModule,
        forwardRef(() => AuthModule),
    ],
    providers: [TrackService, RolesService],
})
export class TrackModule {}
