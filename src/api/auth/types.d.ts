export type LoginPayload = {
    email: string
    password: string
}

export type LoginResponse = {
    token: string
}

export type FileUploadResponse = {
    file: string
}