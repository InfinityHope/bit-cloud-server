import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Roles } from '../decorators/roles-auth.decorator'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { ValidationPipe } from '../pipes/validation.pipe'
import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './track.model'
import { TrackService } from './track.service'
import { TDeleteTrackResponse } from './types/track.types'

@ApiTags('Треки')
@Controller('track')
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

    @ApiOperation({
        summary: 'Добавление нового трека',
    })
    @ApiResponse({
        status: 201,
        type: Track,
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'img',
                maxCount: 1,
            },
            {
                name: 'audio',
                maxCount: 1,
            },
            {
                name: 'resources',
                maxCount: 1,
            },
        ])
    )
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @Roles('MUSICIAN')
    @Post()
    create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
        return this.trackService.createTrack(dto, files)
    }

    @ApiOperation({
        summary: 'Обновление трека',
    })
    @ApiResponse({
        status: 201,
        type: Track,
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'img',
                maxCount: 1,
            },
            {
                name: 'audio',
                maxCount: 1,
            },
            {
                name: 'resources',
                maxCount: 1,
            },
        ])
    )
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @Roles('MUSICIAN')
    @Patch('/:id')
    update(@Param('id') id: number, @Body() dto: UpdateTrackDto, @UploadedFiles() files) {
        return this.trackService.updateTrack(id, dto, files)
    }

    @ApiOperation({
        summary: 'Получение всех треков',
    })
    @ApiResponse({
        status: 200,
        type: [Track],
    })
    @Get()
    getAllTracks(
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Query('q') query: string
    ) {
        return this.trackService.getAllTracks(limit, page, query)
    }

    @ApiOperation({
        summary: 'Скачивание аудио файла',
    })
    @ApiResponse({
        status: 201,
        type: Blob,
    })
    @Get('download/:trackId')
    download(@Param('trackId') trackId: number, @Res() res: Response) {
        return this.trackService.downloadAudio(trackId, res)
    }

    @ApiOperation({
        summary: 'Получение трека',
    })
    @ApiResponse({
        status: 200,
        type: Track,
    })
    @Get('/:id')
    getTrackById(@Param('id') id: number): Promise<Track> {
        return this.trackService.getTrackById(id)
    }

    @ApiOperation({
        summary: 'Получение всех треков одного автора',
    })
    @ApiResponse({
        status: 200,
        type: [Track],
    })
    @Get('author/:userId')
    getTracksByAuthor(@Param('userId') userId: number): Promise<Track[]> {
        return this.trackService.getTracksByAuthor(userId)
    }

    @ApiOperation({
        summary: 'Удаление трека',
    })
    @ApiResponse({
        status: 200,
        type: [Track],
    })
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles('MUSICIAN')
    @Delete(':id')
    deleteTrack(@Param('id') id: number): Promise<TDeleteTrackResponse> {
        return this.trackService.deleteTrack(id)
    }
}
