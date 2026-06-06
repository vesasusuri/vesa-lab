import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { listConversations, MESSAGES_POLL_MS } from '../../../../../../api/messagesApi';
import './ConversationList.scss';

export default function ConversationList({ selected, onSelect, refreshKey = 0, onInboxEmpty }) {
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async (silent = false) => {
            if (!silent) {
                setLoading(true);
            }
            setError('');
            try {
                const data = await listConversations();
                if (!cancelled) {
                    const list = data.conversations || [];
                    setConversations(list);
                    onInboxEmpty?.(list.length === 0);
                }
            } catch {
                if (!cancelled && !silent) {
                    setError('Could not load messages. Please log in.');
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
    }, [refreshKey]);

    const filtered = conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="conversation-list">
            <div className="conversation-list__header">
                <h2 className="conversation-list__title">Messages</h2>
            </div>
            <div className="conversation-list__search">
                <FiSearch size={16} className="conversation-list__search-icon" />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {loading && <p className="conversation-list__status">Loading…</p>}
            {error && <p className="conversation-list__status conversation-list__status--error">{error}</p>}
            {!loading && !error && conversations.length === 0 && (
                <p className="conversation-list__empty">No HR has messaged you yet.</p>
            )}
            {!loading && !error && conversations.length > 0 && filtered.length === 0 && (
                <p className="conversation-list__status">No matching conversations.</p>
            )}
            <ul className="conversation-list__items">
                {filtered.map((c) => (
                    <li
                        key={c.id}
                        className={`conversation-list__item ${selected?.id === c.id ? 'conversation-list__item--active' : ''}`}
                        onClick={() => onSelect(c)}
                    >
                        <div className="conversation-list__avatar">{c.initials}</div>
                        <div className="conversation-list__info">
                            <div className="conversation-list__top">
                                <span className="conversation-list__name">{c.name}</span>
                                <span className="conversation-list__time">{c.time}</span>
                            </div>
                            <div className="conversation-list__bottom">
                                <span className="conversation-list__preview">{c.lastMessage}</span>
                                {c.unread > 0 && (
                                    <span className="conversation-list__badge">{c.unread}</span>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
