import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export class LoginDto {
    @ApiProperty({ example: 'example@example.com', description: 'Email' })
    @IsString({ message: 'Значение должно быть строковым' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string

    @ApiProperty({ example: 'Hz2kBS9hAhz', description: 'Password' })
    @IsString({ message: 'Значение должно быть строковым' })
    @Length(4, 16, { message: 'Не меньше 4 и не больше 16 символов' })
    password: string
}
