import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from './role.model'
import { ValidationPipe } from '../pipes/validation.pipe'

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private readonly roleService: RolesService) {}

    @ApiOperation({
        summary: 'Создание роли',
    })
    @ApiResponse({
        status: 201,
        type: Role,
    })
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() dto: CreateRoleDto): Promise<Role> {
        return this.roleService.createRole(dto)
    }

    @ApiOperation({
        summary: 'Получение роли',
    })
    @ApiResponse({
        status: 200,
        type: Role,
    })
    @Get('/:value')
    getByValue(@Param('value') value: string): Promise<Role> {
        return this.roleService.getRoleByValue(value)
    }
}
