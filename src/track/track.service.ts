import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Response } from 'express'
import { FindOptions, Op } from 'sequelize'
import { FileService, FileType } from '../file/file.service'
import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './track.model'
import { TDeleteTrackResponse } from './types/track.types'

@Injectable()
export class TrackService {
    constructor(
        @InjectModel(Track) private readonly trackRepository: typeof Track,
        private readonly fileService: FileService
    ) {}

    async createTrack(dto: CreateTrackDto, files) {
        const { audio, img, resources } = files

        if (!audio || !resources) {
            throw new BadRequestException('Необходим аудиофайл и файл инструментов')
        }

        let imgPath: string
        let tags = dto.tags ? dto.tags.split(',') : []

        if (img) {
            imgPath = this.fileService.createFile(FileType.IMAGE, img[0]).toString()
        }
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio[0]).toString()
        const resourcesPath = this.fileService
            .createFile(FileType.RESOURCES, resources[0])
            .toString()

        return this.trackRepository.create({
            ...dto,
            userId: +dto.userId,
            tags,
            audio_duration: +dto.audio_duration,
            audio: audioPath,
            img: imgPath,
            resources: resourcesPath,
        })
    }

    async getTrackById(id: number): Promise<Track> {
        const track = await this.trackRepository.findOne({ where: { id }, include: { all: true } })
        if (!track) {
            throw new NotFoundException('Такой трек не найден')
        }
        return track
    }

    async downloadAudio(trackId: number, res: Response) {
        const track = await this.trackRepository.findOne({ where: { id: trackId } })
        if (!track) {
            throw new NotFoundException('Трек не найден')
        }
        return this.fileService.downloadAudio(track.audio, res)
    }

    async getAllTracks(limit = 10, page = 1, query = '') {
        const offset = limit * (page - 1)

        let options: FindOptions<Track> = {
            offset,
            limit,
            include: { all: true },
        }

        if (query) {
            options = {
                ...options,
                where: {
                    title: { [Op.iRegexp]: query },
                },
            }
        }

        const tracks = await this.trackRepository.findAll(options)
        const { count } = await this.trackRepository.findAndCountAll(options)

        return {
            tracks,
            page,
            pages: Math.ceil(count / limit),
            total: count,
        }
    }

    async getTracksByAuthor(userId: number): Promise<Track[]> {
        return this.trackRepository.findAll({ where: { userId }, include: { all: true } })
    }

    async deleteTrack(id: number): Promise<TDeleteTrackResponse> {
        const track = await this.trackRepository.findOne({
            where: { id },
        })

        if (!track) {
            throw new NotFoundException('Трек не найден')
        } else {
            await track.destroy()
            if (track.img !== 'image/noImage.png') {
                this.fileService.removeFile([track.audio, track.img, track.resources])
            }
            return {
                id: +id,
                status: HttpStatus.OK,
                message: 'Трек удален',
            }
        }
    }

    async updateTrack(id: number, dto: UpdateTrackDto, files) {
        const track = await this.trackRepository.findOne({ where: { id } })

        if (!track) {
            throw new BadRequestException('Трека не существует')
        }
        const { img, resources, audio } = files

        let newImg: string = ''
        let newAudio: string = ''
        let newResources: string = ''
        let newAudioDuration: number = 0
        let tags: string[] = dto.tags ? dto.tags.split(',') : track.tags

        if (img) {
            if (track.img !== 'image/noImage.png') {
                this.fileService.removeFile(track.img)
            }
            newImg = this.fileService.createFile(FileType.IMAGE, img[0]).toString()
        } else {
            newImg = track.img
        }

        if (audio) {
            this.fileService.removeFile(track.audio)
            newAudio = this.fileService.createFile(FileType.AUDIO, audio[0]).toString()
            newAudioDuration = Number(dto.audio_duration)
        } else {
            newAudio = track.audio
            newAudioDuration = track.audio_duration
        }

        if (resources) {
            this.fileService.removeFile(track.resources)
            newResources = this.fileService.createFile(FileType.RESOURCES, resources[0]).toString()
        } else {
            newResources = track.resources
        }

        let [_, [updatedTrack]] = await this.trackRepository.update(
            {
                ...dto,
                audio_duration: newAudioDuration,
                tags,
                audio: newAudio,
                resources: newResources,
                img: newImg,
            },
            { where: { id }, returning: true }
        )
        return {
            id: +id,
            status: HttpStatus.OK,
            message: 'Трек обновлен',
        }
    }
}
