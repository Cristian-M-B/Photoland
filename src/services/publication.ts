import axios from 'axios'
import { sha256 } from 'js-sha256'
import { IFile, IPublication } from '../types/publication'

export async function saveFilesToCloudinary(files: File[]) {
    try {
        const formData = new FormData()
        const mediaFiles: IFile[] = await Promise.all(files?.map(async file => {
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
                    name: data.public_id,
                    type: data.resource_type,
                    url: data.secure_url
                }
            } else {
                const { data } = await axios.post('https://api.cloudinary.com/v1_1/ddouuo3xs/video/upload', formData)
                return {
                    name: data.public_id,
                    type: data.resource_type,
                    url: data.secure_url
                }
            }
        }))
        return mediaFiles
    } catch (error) {
        console.log(error)
    }
}

export async function saveFilesToDB(files: IFile[], text: string, userName: string) {
    try {
        const { data } = await axios.post(`/api/postPublication?userName=${userName}`, { files, text })
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function deletePublication(publication: IPublication) {
    try {
        const { data } = await axios.post('/api/deletePublication', publication)
        return data
    } catch (error) {
        console.log(error)
    }
}