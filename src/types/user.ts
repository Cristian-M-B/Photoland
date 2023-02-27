export interface IUserData {
    fullName: string,
    userName: string,
    email: string,
    password: string
}

export default interface IUser extends IUserData {
    _id: string,
    private: boolean,
    picture?: string,
    files: IFiles[],
    albums: IAlbums[]
}

export interface IFiles {
    id: string,
    url: string,
    type: string,
    date: string
}

interface IAlbums {
    name: string,
    files: IFiles[]
}