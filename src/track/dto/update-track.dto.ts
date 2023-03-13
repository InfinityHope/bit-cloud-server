import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTrackDto {
    @ApiProperty({ example: 'track', description: 'Title of Track' })
    @IsString({ message: 'Значение должно быть строковым' })
    readonly title: string

    @ApiProperty({ example: 'track.mp3', description: 'Title of Audio' })
    readonly audio: string

    @ApiProperty({ example: 'img.jpg', description: 'Title of Img' })
    readonly img: string

    @ApiProperty({ example: 'resources.rar', description: 'Title of Resources' })
    readonly resources: string

    @ApiProperty({ example: ['tag'], description: 'Tags of Track' })
    @IsOptional()
    @IsString({ message: 'Значение должно быть строковым' })
    readonly tags: string

    @ApiProperty({ example: 'Описание', description: 'Description of Track' })
    @IsOptional()
    @IsString({ message: 'Значение должно быть строковым' })
    readonly description: string

    @ApiProperty({ example: '158', description: 'Duration of audio in seconds' })
    // @IsNumber({}, { message: 'Значение должно быть числом' })
    readonly audio_duration: number
}
