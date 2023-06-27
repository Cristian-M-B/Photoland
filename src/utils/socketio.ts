import { Dispatch, SetStateAction } from 'react'
import { io, Socket } from 'socket.io-client'
import IUser, { INotification } from '../types/user'
import IMessage from '../types/message'

let socket: Socket
const PHOTOLAND_URL = process.env.NODE_ENV === 'production'
    ? 'https://photolandpage.vercel.app'
    : 'http://localhost:3000'

export default function connect() {
    fetch('/api/socket')
    socket = io(`${PHOTOLAND_URL}`)
    console.log(PHOTOLAND_URL)
}

export function newUser(currentUser: IUser) {
    socket.emit('newUser', currentUser)
}

export function newNotification(publicationUserID: string, notification: INotification) {
    socket.emit('newNotification', publicationUserID, notification)
}

export function showNotification(notifications: INotification[], setNotifications: Dispatch<SetStateAction<INotification[]>>) {
    socket.on('showNotification', notification => {
        const copyNotifications = [...notifications]
        setNotifications([
            notification,
            ...copyNotifications
        ])
    })
}

export function getAllOnlineUsers(setOnlineUsers: Dispatch<SetStateAction<IUser[]>>) {
    socket.on('getAllOnlineUsers', onlineUsers => {
        setOnlineUsers(onlineUsers)
    })
}

export function showMessage(setArrivalMessage: Dispatch<SetStateAction<IMessage | undefined>>) {
    socket.on('showMessage', message => {
        setArrivalMessage(message)
    })
}

export function newMessageSocket(receiverID: string, message: IMessage) {
    socket.emit('newMessage', {
        receiverID,
        message
    })
}

export function deleteUser(currentUser: IUser) {
    socket.emit('deleteUser', currentUser)
}

export function disconnect() {
    socket.disconnect()
}