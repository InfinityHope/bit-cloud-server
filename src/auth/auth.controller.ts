import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ValidationPipe } from '../pipes/validation.pipe'
import { IAuthResponse } from './types/auth.types'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'Авторизация',
    })
    @ApiResponse({
        status: 201,
        type: String,
    })
    @UsePipes(ValidationPipe)
    @Post('/login')
    login(@Body() dto: LoginDto): Promise<IAuthResponse> {
        return this.authService.login(dto)
    }

    @ApiOperation({
        summary: 'Регистрация',
    })
    @ApiResponse({
        status: 201,
        type: String,
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @UsePipes(ValidationPipe)
    @Post('/register')
    register(@UploadedFile() avatar, @Body() dto: CreateUserDto) {
        return this.authService.register(dto, avatar)
    }
}
