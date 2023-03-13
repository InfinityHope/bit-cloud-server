import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { Role } from '../roles/role.model'
import { UserRoles } from '../roles/user-roles.model'
import { Track } from '../track/track.model'

interface UserCreationAttrs {
    email: string
    password: string
    name: string
    nickName: string
    telephone: string
    avatar: string
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'example@example.com', description: 'Email' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string

    @ApiProperty({ example: 'Hz2kBS9hAhz', description: 'Password' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string

    @ApiProperty({ example: 'Test', description: 'Name' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @ApiProperty({ example: 'ExampleNick', description: 'NickName' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    nickName: string

    @ApiProperty({ example: 'img.jpg', description: 'User avatar' })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'image/noAvatar.png' })
    avatar: string

    @ApiProperty({ example: ['vk.com/user'], description: 'SocialLinks' })
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
    socialLinks: string[]

    @ApiProperty({ example: '+79999999999', description: 'Telephone' })
    @Column({ type: DataType.STRING, allowNull: false })
    telephone: string

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    @HasMany(() => Track)
    tracks: Track[]
}
