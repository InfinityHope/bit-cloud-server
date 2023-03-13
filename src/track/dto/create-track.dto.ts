import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export interface File {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: typeof Buffer
    size: number
}

export class CreateTrackDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    readonly userId: string

    @ApiProperty({ example: 'track', description: 'Title of Track' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly title: string

    @ApiProperty({ example: ['tag'], description: 'Tags of Track' })
    @IsOptional()
    @IsString({ message: 'Значение должно быть строковым' })
    readonly tags: string

    @ApiProperty({ example: 'Описание', description: 'Description of Track' })
    @IsOptional()
    @IsString({ message: 'Значение должно быть строковым' })
    readonly description: string

    @ApiProperty({ example: '158', description: 'Duration of audio in seconds' })
    readonly audio_duration: string
}
