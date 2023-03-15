import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { Role } from './roles/role.model'
import { RolesModule } from './roles/roles.module'
import { UserRoles } from './roles/user-roles.model'
import { Track } from './track/track.model'
import { TrackModule } from './track/track.module'
import { User } from './user/user.model'
import { UserModule } from './user/user.module'

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles, Track],
            autoLoadModels: true,
        }),
        UserModule,
        RolesModule,
        AuthModule,
        TrackModule,
        FileModule,
    ],
})
export class AppModule {}
