export interface AuthenticatedUser {
    sub: string
    email: string
}

export enum ROLES {
    USER = "user",
    ADMIN = "admin",
}