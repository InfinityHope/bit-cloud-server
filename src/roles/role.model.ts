import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '../user/user.model'
import { UserRoles } from './user-roles.model'

interface RolesCreationAttrs {
    value: string
    description: string
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RolesCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'DEFAULT_USER', description: 'Role Value' })
    @Column({ type: DataType.STRING, allowNull: false })
    value: string

    @ApiProperty({ example: 'Рядовой пользователь', description: 'Role Description' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string

    @BelongsToMany(() => User, () => UserRoles)
    users: User[]
}
