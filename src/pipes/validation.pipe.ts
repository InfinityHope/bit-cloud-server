import {
    ArgumentMetadata,
    Injectable,
    Optional,
    PipeTransform,
    ValidationPipeOptions,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationException } from '../exceptions/validation.exception'
import { isNil } from '@nestjs/common/utils/shared.utils'
import { ValidatorPackage } from '@nestjs/common/interfaces/external/validator-package.interface'
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface'
import { loadPackage } from '@nestjs/common/utils/load-package.util'

let classValidator: ValidatorPackage = {} as any
let classTransformer: TransformerPackage = {} as any

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    private isTransformEnabled: boolean
    constructor(@Optional() options?: ValidationPipeOptions) {
        options = options || {}
        const { transform } = options

        this.isTransformEnabled = !!transform

        classValidator = this.loadValidator(options.validatorPackage)
        classTransformer = this.loadTransformer(options.transformerPackage)
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<string> {
        const metatype = metadata.metatype
        if (
            !metatype ||
            !this.toValidate(metatype) ||
            (isNil(value) && Reflect.getMetadata('bypass-validation-if-nil', metatype) === true)
        ) {
            return this.isTransformEnabled ? this.transformPrimitive(value, metadata) : value
        }
        const obj = plainToClass(metadata.metatype, value)
        const errors = await validate(obj)

        if (errors.length) {
            let messages = errors.map((err) => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
            })
            throw new ValidationException(messages)
        }
        return value
    }

    protected loadValidator(validatorPackage?: ValidatorPackage): ValidatorPackage {
        return (
            validatorPackage ??
            loadPackage('class-validator', 'ValidationPipe', () => require('class-validator'))
        )
    }

    protected loadTransformer(transformerPackage?: TransformerPackage): TransformerPackage {
        return (
            transformerPackage ??
            loadPackage('class-transformer', 'ValidationPipe', () => require('class-transformer'))
        )
    }

    protected toValidate(metadata: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metadata)
    }

    protected transformPrimitive(value: any, metadata: ArgumentMetadata) {
        if (!metadata.data) {
            return value
        }
        const { type, metatype } = metadata
        if (type !== 'param' && type !== 'query') {
            return value
        }
        if (metatype === Boolean) {
            return value === true || value === 'true'
        }
        if (metatype === Number) {
            return +value
        }
        return value
    }
}
