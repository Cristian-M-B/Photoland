import axios from 'axios'
import { IUserData } from '../types/user'
import { IFile } from '../types/publication'

export async function addNewUser(inputs: IUserData) {
    try {
        await axios.post('/api/postUser', inputs)
    } catch (error) {
        console.log(error)
    }
}

export async function changePicture(picture: IFile, userName: string) {
    try {
        const { data } = await axios.post(`/api/putUser?userName=${userName}`, picture)
        return data
    } catch (error) {
        console.log(error)
    }
}