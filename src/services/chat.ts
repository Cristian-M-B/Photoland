import axios from 'axios'

interface IMessage {
    conversationID: string,
    sender: string,
    text: string,
    date: number
}

export async function getMessages(ConversationID: string) {
    try {
        const { data } = await axios.get(`/api/message?conversationID=${ConversationID}`)
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function addMessage(message: IMessage) {
    try {
        const { data } = await axios.post('/api/message', message)
        return data
    } catch (error) {
        console.log(error)
    }
}