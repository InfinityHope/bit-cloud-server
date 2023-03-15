import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from '../user/user.model'

interface TrackCreationAttrs {
    title: string
    audio: string
    img: string
    resources: string
    userId: number
    tags: string[]
    description: string
    audio_duration: number
}

@Table({ tableName: 'tracks' })
export class Track extends Model<Track, TrackCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Id' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'track1', description: 'Title of Track' })
    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @ApiProperty({ example: 'track.mp3', description: 'Title of Audio' })
    @Column({ type: DataType.STRING, allowNull: false })
    audio: string

    @ApiProperty({ example: 'img.jpg', description: 'Title of Img' })
    @Column({ type: DataType.STRING, defaultValue: 'image/noImage.png' })
    img: string

    @ApiProperty({ example: 'resources.rar', description: 'Title of Resources' })
    @Column({ type: DataType.STRING, allowNull: false })
    resources: string

    @ApiProperty({ example: '158', description: 'Duration of audio in seconds' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    audio_duration: number

    @ApiProperty({
        example:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus architecto atque commodi debitis ducimus error hic impedit incidunt inventore molestias numquam, quasi quis rem, sint vero. Et ipsam suscipit ullam?',
        description: 'Track description',
    })
    @Column({ type: DataType.STRING })
    description: string

    @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
    tags: string[]

    @BelongsTo(() => User)
    author: User

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number
}
