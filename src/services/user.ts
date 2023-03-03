import axios from 'axios'
import { sha256 } from 'js-sha256'
import { IUserData, IFiles } from '../types/user'

export async function addNewUser(inputs: IUserData) {
    try {
        await axios.post('/api/postUser', inputs)
    } catch (error) {
        console.log(error)
    }
}

export async function saveFilesToCloudinary(files: File[]) {
    try {
        const formData = new FormData()
        const mediaFiles: IFiles[] = await Promise.all(files?.map(async file => {
            const API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || ''
            const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ''
            const date = new Date()
            const timestamp = (Math.round(date.getTime() / 1000)).toString()
            const signature = sha256(`timestamp=${timestamp}&upload_preset=aay9sofi${API_SECRET}`)
            formData.append('file', file)
            formData.append('api_key', API_KEY)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            formData.append('upload_preset', 'aay9sofi')
            if (file.type.includes('image')) {
                const { data } = await axios.post('https://api.cloudinary.com/v1_1/ddouuo3xs/image/upload', formData)
                return {
                    id: data.public_id,
                    url: data.secure_url,
                    type: data.resource_type,
                    date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                }
            } else {
                const { data } = await axios.post('https://api.cloudinary.com/v1_1/ddouuo3xs/video/upload', formData)
                return {
                    id: data.public_id,
                    url: data.secure_url,
                    type: data.resource_type,
                    date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                }
            }
        }))
        return mediaFiles

    } catch (error) {
        console.log(error)
    }
}

export async function saveFilesToDB(files: IFiles[], userName: string) {
    try {
        const { data } = await axios.post(`/api/postFile?userName=${userName}`, files)
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFiles(fileID: string, userName: string) {
    try {
        const { data } = await axios.delete(`/api/deleteFile?fileID=${fileID}&userName=${userName}`)
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function changePicture(file: string, userName: string) {
    try {
        const { data } = await axios.post(`/api/postFile?file=${file}&userName=${userName}`)
        return data
    } catch (error) {
        console.log(error)
    }
}