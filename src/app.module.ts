import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { User } from './user/user.model'
import { RolesModule } from './roles/roles.module'
import { Role } from './roles/role.model'
import { UserRoles } from './roles/user-roles.model'
import { AuthModule } from './auth/auth.module'
import { TrackModule } from './track/track.module'
import { Track } from './track/track.model'
import { FileModule } from './file/file.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'

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
            password: process.env.POSTGRES_PASSWORD,
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
