import { Dispatch, SetStateAction } from 'react'
import IUser from '../types/user'
import IConversation from '../types/conversation'
import Conversation from './Conversation'

const styles = {
    flex: '3',
    padding: '10px'
}

const buttonStyles = {
    border: 'none',
    padding: '0px',
    backgroundColor: 'transparent',
    width: '100%'
}

interface Props {
    conversations: IConversation[],
    currentUser: IUser,
    setCurrentChat: Dispatch<SetStateAction<IConversation | null>>
}

export default function ChatMenu({ conversations, currentUser, setCurrentChat }: Props) {
    return (
        <div style={styles}>
            {conversations?.map(conversation =>
                <button
                    key={conversation?._id}
                    onClick={() => setCurrentChat(conversation)}
                    style={buttonStyles}
                >
                    <Conversation
                        conversation={conversation}
                        currentUser={currentUser}
                    />
                </button>
            )}
        </div>
    )
}
