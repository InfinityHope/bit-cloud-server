import { HttpStatus } from '@nestjs/common'

export type TDeleteTrackResponse = {
    id: number
    status: typeof HttpStatus.OK
    message: string
}
