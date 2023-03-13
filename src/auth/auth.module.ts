import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { FileModule } from '../file/file.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '30d',
            },
        }),
        FileModule,
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
