import IUser from './user'

export interface IFile {
    name: string,
    type: string,
    url: string
}

export interface IPublication {
    _id: string,
    user: IUser,
    files: IFile[],
    date: string,
    title?: string,
    description?: string,
    likes: string[]
}