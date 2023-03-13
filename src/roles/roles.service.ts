import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { InjectModel } from '@nestjs/sequelize'
import { Role } from './role.model'

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto): Promise<Role> {
        const role = await this.roleRepository.create(dto)
        return role
    }

    async getRoleByValue(value: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { value } })
        return role
    }
}
