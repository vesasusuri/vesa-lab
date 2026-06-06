import React, { useState } from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import ConversationList from '../../../components/dashboard/pages/conversation-list/ConversationList';
import ChatWindow from '../../../components/dashboard/pages/chat-window/ChatWindow';
import './MessagesPage.scss';

const MessagesPage = () => {
    const [selected, setSelected] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [inboxEmpty, setInboxEmpty] = useState(null);
    const [mobileChatOpen, setMobileChatOpen] = useState(false);

    const handleMessageSent = () => {
        setRefreshKey((k) => k + 1);
    };

    const handleSelectConversation = (conversation) => {
        setSelected(conversation);
        setMobileChatOpen(true);
    };

    const handleBackToList = () => {
        setMobileChatOpen(false);
    };

    return (
        <UserDashboardLayout>
            <div className={`messages-page${mobileChatOpen ? ' messages-page--chat-open' : ''}`}>
                <div className="messages-page__body">
                    <div className="messages-page__left">
                        <ConversationList
                            selected={selected}
                            onSelect={handleSelectConversation}
                            refreshKey={refreshKey}
                            onInboxEmpty={setInboxEmpty}
                        />
                    </div>
                    <div className="messages-page__right">
                        <ChatWindow
                            conversation={selected}
                            onMessageSent={handleMessageSent}
                            inboxEmpty={inboxEmpty === true}
                            onBack={handleBackToList}
                            showBackButton={mobileChatOpen}
                        />
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
};

export default MessagesPage;
