import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({ example: 'example@example.com', description: 'Email' })
    @IsString({ message: 'Значение должно быть строковым' })
    @IsEmail({}, { message: 'Некорректный email' })
    readonly email: string

    @ApiProperty({ example: 'Hz2kBS9hAhz', description: 'Password' })
    @IsString({ message: 'Значение должно быть строковым' })
    @IsOptional()
    @Length(4, 16, { message: 'Не меньше 4 и не больше 16 символов' })
    readonly password: string

    @ApiProperty({ example: 'Test', description: 'Name' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly name: string

    @ApiProperty({ example: 'ExampleNick', description: 'NickName' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly nickName: string

    @ApiProperty({ example: '+79999999999', description: 'Telephone' })
    @IsString({ message: 'Значение должно быть строковым' })
    @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
    readonly telephone: string

    @ApiProperty({ example: '+79999999999', description: 'Telephone' })
    readonly avatar: string

    @ApiProperty({ example: ['vk.com/user'], description: 'Social links' })
    @IsOptional()
    @IsString({ message: 'Значение должно быть строковым' })
    readonly socialLinks: string
}
