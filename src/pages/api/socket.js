import { Server } from 'socket.io'

export default function handler(req, res) {
    let onlineUsers = []

    function addUser(currentUser, socketID) {
        !onlineUsers.some(user => user._id === currentUser._id) && onlineUsers.push({...currentUser, socketID})
        console.log(onlineUsers)
    }

    function getUser(onlineUserID) {
        return onlineUsers.find(user => user._id === onlineUserID)
    }

    function removeUser(currentUser){
        onlineUsers = onlineUsers.filter(user => user._id !== currentUser._id)
        console.log(onlineUsers)
    }

    if (!res.socket.server.io) {
        console.log('Starting socket.io')
        const io = new Server(res.socket.server)

        io.on('connection', (socket) => {
            console.log(`Connected: ${socket.id}`)
            socket.on('newUser', (currentUser) => {
                addUser(currentUser, socket.id)
            })
            socket.on('newNotification', (publicationUserID, notification) => {
                const user = getUser(publicationUserID)
                if(user){
                    // socket.emit('showNotification', notification)
                    io.to(user.socketID).emit('showNotification', notification)
                }
            })
            socket.on('deleteUser', (currentUser) => {
                removeUser(currentUser)
            })
            socket.on('disconnect', () => {
                console.log('Disconnected')
            })
        })
        
        res.socket.server.io = io
    } else {
        console.log('socket.io already running')
    }

    res.end()
}