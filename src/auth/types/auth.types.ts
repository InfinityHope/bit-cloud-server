export interface IAuthResponse {
    user: {
        id: number
        email: string
        nickName: string
        avatar: string
        role: string
    }
    accessToken: string
}
