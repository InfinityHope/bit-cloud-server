import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, genSalt, hash } from 'bcryptjs'
import { FileService, FileType } from '../file/file.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { User } from '../user/user.model'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { IAuthResponse } from './types/auth.types'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService
    ) {}

    returnUserFields(user: User) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            nickName: user.nickName,
            avatar: user.avatar,
            socialLinks: user.socialLinks,
            telephone: user.telephone,
            role: user.roles.map((role) => role.value).toString(),
        }
    }

    async login(dto: LoginDto): Promise<IAuthResponse> {
        const user = await this.validateUser(dto)
        const accessToken = await this.generateToken(user)
        return {
            user: this.returnUserFields(user),
            accessToken: accessToken.token,
        }
    }

    async register(dto: CreateUserDto, avatar): Promise<IAuthResponse> {
        const candidateEmail = await this.userService.getUserByEmail(dto.email)
        const candidateNickname = await this.userService.getUserByNickName(dto.nickName)
        let imgPath: string

        if (candidateNickname) {
            throw new HttpException('Данный никнейм занят', HttpStatus.BAD_REQUEST)
        }

        if (candidateEmail) {
            throw new HttpException('Пользователь уже существует', HttpStatus.BAD_REQUEST)
        }
        const salt = await genSalt(10)
        const hashPassword = await hash(dto.password, salt)

        if (avatar) {
            imgPath = this.fileService.createFile(FileType.IMAGE, avatar).toString()
        }
        const user = await this.userService.createUser({ ...dto, password: hashPassword }, imgPath)
        const accessToken = await this.generateToken(user)
        return {
            user: this.returnUserFields(user),
            accessToken: accessToken.token,
        }
    }

    async generateToken(user: User): Promise<{ token: string }> {
        const payload = { email: user.email, id: user.id, roles: user.roles }
        return {
            token: this.jwtService.sign(payload),
        }
    }

    private async validateUser(dto: LoginDto): Promise<User> {
        const user = await this.userService.getUserByEmail(dto.email)
        if (!user) {
            throw new NotFoundException({ message: 'Пользователь не найден' })
        }
        const passwordEquals = await compare(dto.password, user.password)
        if (user && passwordEquals) {
            return user
        }
        throw new UnauthorizedException({ message: 'Некорректный email или пароль' })
    }
}
