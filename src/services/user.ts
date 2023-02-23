import axios from 'axios'
import { IUserData } from '../types/user'

export async function addNewUser(inputs: IUserData) {
    try {
        await axios.post('/api/postUser', inputs)
    } catch (error) {
        console.log(error)
    }
}