import { IFile } from './publication'

export interface IUserData {
    fullName: string,
    userName: string,
    email: string,
    password: string
}

export default interface IUser extends IUserData {
    _id: string,
    private: boolean,
    picture?: IFile
}
