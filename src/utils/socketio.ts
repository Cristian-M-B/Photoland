import { io } from 'socket.io-client'

export default function getSocketIO() {
    fetch('/api/socket')
    const socket = io('http://localhost:3000')
    return socket
}