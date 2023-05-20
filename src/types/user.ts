import { IFile } from './publication'

export interface IUserData {
    fullName: string,
    userName: string,
    email: string,
    password: string
}

export enum notificationsTypes {
    like = 'like',
    comment = 'comment',
    message = 'message'
}

export interface INotification {
    _id?: string,
    type: notificationsTypes,
    isRead: boolean,
    isIgnored: boolean,
    publicationID: string,
    user: IUser
}

export default interface IUser extends IUserData {
    _id: string,
    private: boolean,
    picture?: IFile,
    notifications: INotification[]
}
