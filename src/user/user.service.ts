import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { genSalt, hash } from 'bcryptjs'
import { FindOptions, Op } from 'sequelize'
import { RolesService } from '../roles/roles.service'
import { FileService, FileType } from './../file/file.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { TUserInfo } from './types/user.types'
import { User } from './user.model'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User,
        private readonly roleService: RolesService,
        private readonly fileService: FileService
    ) {}

    returnUserField(user: User): TUserInfo {
        return {
            id: user.id,
            name: user.name,
            nickName: user.nickName,
            email: user.email,
            socialLinks: user.socialLinks,
            telephone: user.telephone,
            avatar: user.avatar,
            tracks: user.tracks,
        }
    }

    async createUser(dto: CreateUserDto, img?: string): Promise<User> {
        const user = await this.userRepository.create({ ...dto, avatar: img })

        if (JSON.parse(String(dto.isMusician))) {
            const role = await this.roleService.getRoleByValue('MUSICIAN')
            await user.$set('roles', [role.id])
            user.roles = [role]
        } else {
            const role = await this.roleService.getRoleByValue('USER')
            await user.$set('roles', [role.id])
            user.roles = [role]
        }

        return user
    }

    async getUserInfo(nickName: string): Promise<TUserInfo> {
        const user = await this.getUserByNickName(nickName)
        return this.returnUserField(user)
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email }, include: { all: true } })
    }

    async getUserByNickName(nickName: string): Promise<User> {
        return this.userRepository.findOne({ where: { nickName }, include: { all: true } })
    }

    async getMusicians(query: string): Promise<TUserInfo[]> {
        let options: FindOptions<User> = { include: { all: true } }

        if (query) {
            options = {
                ...options,
                where: {
                    nickName: { [Op.iRegexp]: query },
                },
            }
        }
        const users = await this.userRepository.findAll(options)

        console.log(users)

        let musicians = users.filter((item) =>
            item.roles.some((role) => role.value.includes('MUSICIAN'))
        )
        return musicians.map((musician) => this.returnUserField(musician))
    }

    async updateUser(id: number, dto: UpdateUserDto, avatar) {
        const user = await this.userRepository.findOne({ where: { id }, include: { all: true } })
        if (!user) {
            throw new BadRequestException('Трека не существует')
        }
        let newAvatar: string = ''

        let socialLinks = dto.socialLinks ? dto.socialLinks.split(',') : []

        if (avatar) {
            if (user.avatar !== 'image/noAvatar.png') {
                this.fileService.removeFile(user.avatar)
            }

            newAvatar = this.fileService.createFile(FileType.IMAGE, avatar).toString()
        } else {
            newAvatar = user.avatar
        }

        if (dto.password) {
            const salt = await genSalt(10)
            const hashPassword = await hash(dto.password, salt)

            let [_, [updatedUser]] = await this.userRepository.update(
                {
                    ...dto,
                    socialLinks,
                    password: hashPassword,
                    avatar: newAvatar,
                },
                { where: { id }, returning: true }
            )

            return {
                ...this.returnUserField(updatedUser),
                role: user.roles.map((role) => role.value).toString(),
            }
        } else {
            let [_, [updatedUser]] = await this.userRepository.update(
                {
                    ...dto,
                    roles: user.roles,
                    socialLinks,
                    avatar: newAvatar,
                },
                { where: { id }, returning: true }
            )

            return {
                ...this.returnUserField(updatedUser),
                role: user.roles.map((role) => role.value).toString(),
            }
        }
    }
}
