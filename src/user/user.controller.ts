import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { ValidationPipe } from '../pipes/validation.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { TUserInfo } from './types/user.types'
import { User } from './user.model'
import { UserService } from './user.service'

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //Создание пользователя
    @ApiOperation({
        summary: 'Создание пользователя',
    })
    @ApiResponse({
        status: 201,
        type: User,
    })
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.createUser(dto)
    }

    @ApiOperation({
        summary: 'Получение всех музыкантов',
    })
    @ApiResponse({
        status: 200,
        type: [User],
    })
    @Get()
    getMusicians(@Query('q') query?: string): Promise<TUserInfo[]> {
        return this.userService.getMusicians(query)
    }

    @ApiOperation({
        summary: 'Получение информации пользователя',
    })
    @ApiResponse({
        status: 200,
        type: User,
    })
    @Get(':nickName')
    getUserInfo(@Param('nickName') nickName: string): Promise<TUserInfo> {
        return this.userService.getUserInfo(nickName)
    }

    @ApiOperation({
        summary: 'Обновление информации пользователя',
    })
    @ApiResponse({
        status: 200,
        type: User,
    })
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto, @UploadedFile() avatar) {
        return this.userService.updateUser(id, dto, avatar)
    }
}
