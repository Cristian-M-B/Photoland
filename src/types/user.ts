export default interface IUser {
    _id: String,
    fullName: String,
    userName: String,
    email: String,
    password: String,
    private: Boolean,
    picture: String,
    files: IFiles[],
    albums: IAlbums[]
}

interface IFiles {
    id: String,
    url: String,
    type: String,
    date: String
}

interface IAlbums {
    name: String,
    files: IFiles[]
}
