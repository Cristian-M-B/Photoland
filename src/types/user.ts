export interface IUserData {
    fullName: string,
    userName: string,
    email: string,
    password: string
}

export default interface IUser extends IUserData{
    _id: String,
    private: Boolean,
    picture?: String,
    files: IFiles[],
    albums: IAlbums[]
}

interface IFiles {
    id: string,
    url: string,
    type: string,
    date: string
}

interface IAlbums {
    name: string,
    files: IFiles[]
}