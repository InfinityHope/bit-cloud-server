import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateRoleDto {
    @ApiProperty({ example: 'DEFAULT_USER', description: 'Role Value' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly value: string

    @ApiProperty({ example: 'Рядовой пользователь', description: 'Role Description' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly description: string
}
