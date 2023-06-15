import axios from 'axios'
import { IUserData, INotification } from '../types/user'
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

export async function getUser(email: string, password: string) {
    try {
        const { data } = await axios.post('/api/getUser', { email, password })
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function logOut() {
    try {
        const { data } = await axios.delete('/api/deleteUser')
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function addNotification(publicationUserID: string, notification: INotification) {
    try {
        await axios.put('/api/putUser?notification=true', { publicationUserID, notification })
    } catch (error) {
        console.log(error)
    }
}

export async function notificationRead(userID: string, notificationID: string) {
    try {
        const { data } = await axios.put('/api/putUser?notificationRead=true', { userID, notificationID })
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function allNotificationsRead(userID: string) {
    try {
        const { data } = await axios.put('/api/putUser?allNotificationsRead=true', {userID})
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function getFriend(id: string) {
    try {
        const {data} = await axios.get(`/api/getUser?id=${id}`)
        return data
    } catch (error) {
        console.log(error)
    }
}