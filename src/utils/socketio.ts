import { Dispatch, SetStateAction } from 'react'
import { io, Socket } from 'socket.io-client'
import IUser, { INotification } from '../types/user'

let socket: Socket
const PHOTOLAND_URL = process.env.PHOTOLAND_URL || ''

export default function connect() {
    fetch('/api/socket')
    socket = io(`${PHOTOLAND_URL}`)
}

export function newUser(currentUser: IUser) {
    socket.emit('newUser', currentUser)
}

export function newNotification(publicationUserID: string, notification: INotification) {
    socket.emit('newNotification', publicationUserID, notification)
}

export function showNotification(notifications: INotification[], setNotifications: Dispatch<SetStateAction<INotification[]>>) {
    socket.on('showNotification', notification => {
        setNotifications([
            ...notifications,
            notification
        ])
    })
}

export function deleteUser(currentUser: IUser) {
    socket.emit('deleteUser', currentUser)
}

export function disconnect() {
    socket.disconnect()
}