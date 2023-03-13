import { User } from '../user.model'

export type TUserInfo = Pick<
    User,
    'id' | 'name' | 'nickName' | 'email' | 'socialLinks' | 'telephone' | 'tracks' | 'avatar'
>
