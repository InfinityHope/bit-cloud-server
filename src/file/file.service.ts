import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image',
    RESOURCES = 'resources',
}

@Injectable()
export class FileService {
    createFile(type: FileType, file): string {
        try {
            const fileExtension = file.originalname.split('.').pop()
            const fileName = uuid.v4() + '.' + fileExtension
            const filePath = path.resolve(__dirname, '..', 'static', type)
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
            return type + '/' + fileName
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    downloadAudio(fileName, res: Response) {
        try {
            const filePath = path.resolve(__dirname, '..', 'static', fileName)
            if (fs.existsSync(filePath)) {
                res.sendFile(path.resolve(filePath))
            } else {
                throw new NotFoundException('Файл не найден')
            }
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    removeFile(files: string[] | string) {
        try {
            const filePath = path.resolve(__dirname, '..', 'static')
            if (Array.isArray(files)) {
                files.map((fileName) => {
                    if (!fs.existsSync(path.resolve(filePath, fileName))) {
                        throw new NotFoundException('Файл не найден')
                    } else {
                        fs.unlinkSync(path.resolve(filePath, fileName))
                    }
                })
            } else {
                if (!fs.existsSync(path.resolve(filePath, files))) {
                    throw new NotFoundException('Файл не найден')
                } else {
                    fs.unlinkSync(path.resolve(filePath, files))
                }
            }
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
