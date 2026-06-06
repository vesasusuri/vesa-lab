import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiSend, FiMessageSquare } from 'react-icons/fi';
import { listMessages, sendMessage, MESSAGES_POLL_MS } from '../../../../../../api/messagesApi';
import './ChatWindow.scss';

export default function ChatWindow({
    conversation,
    onMessageSent,
    inboxEmpty = false,
    onBack,
    showBackButton = false,
}) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!conversation?.id) {
            setMessages([]);
            return undefined;
        }

        let cancelled = false;

        const load = async (silent = false) => {
            if (!silent) {
                setLoading(true);
            }
            setError('');
            try {
                const data = await listMessages(conversation.id);
                if (!cancelled) {
                    setMessages(data.messages || []);
                }
            } catch {
                if (!cancelled && !silent) {
                    setError('Could not load messages.');
                    setMessages([]);
                }
            } finally {
                if (!cancelled && !silent) {
                    setLoading(false);
                }
            }
        };

        load(false);
        const pollId = window.setInterval(() => load(true), MESSAGES_POLL_MS);

        return () => {
            cancelled = true;
            window.clearInterval(pollId);
        };
    }, [conversation?.id]);

    if (!conversation) {
        return (
            <div className="chat-window chat-window--empty">
                <FiMessageSquare size={48} />
                {inboxEmpty ? (
                    <>
                        <p>No HR has messaged you yet.</p>
                        <span className="chat-window__empty-hint">
                            When a recruiter contacts you, you can reply here.
                        </span>
                    </>
                ) : (
                    <p>Select a conversation to view messages</p>
                )}
            </div>
        );
    }

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        setSending(true);
        setError('');
        try {
            const data = await sendMessage(conversation.id, input.trim());
            setMessages((prev) => [...prev, data.message]);
            setInput('');
            onMessageSent?.();
        } catch {
            setError('Could not send message.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                {showBackButton && (
                    <button
                        type="button"
                        className="chat-window__back"
                        onClick={onBack}
                        aria-label="Back to conversations"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                )}
                <div className="chat-window__avatar">{conversation.initials}</div>
                <div className="chat-window__header-text">
                    <h3 className="chat-window__name">{conversation.name}</h3>
                    <p className="chat-window__status">Messages with HR</p>
                </div>
            </div>
            <div className="chat-window__messages">
                {loading && <p className="chat-window__status-line">Loading messages…</p>}
                {error && <p className="chat-window__status-line chat-window__status-line--error">{error}</p>}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-window__message chat-window__message--${msg.from}`}
                    >
                        <div className="chat-window__bubble">{msg.text}</div>
                        <span className="chat-window__time">{msg.time}</span>
                    </div>
                ))}
            </div>
            <div className="chat-window__input-wrap">
                <input
                    type="text"
                    className="chat-window__input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                />
                <button className="chat-window__send" onClick={handleSend} disabled={sending || !input.trim()}>
                    <FiSend size={18} />
                </button>
            </div>
        </div>
    );
}
