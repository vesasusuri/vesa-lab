import React, { useEffect, useRef, useState } from 'react';
import {
  listConversations,
  listMessages,
  sendMessage,
  MESSAGES_POLL_MS,
} from '../../../../../../api/messagesApi';
import './UserDashboardMessages.scss';

const UserDashboardMessages = () => {
  const [search,        setSearch]        = useState('');
  const [activeId,      setActiveId]      = useState(null);
  const [allConvos,     setAllConvos]     = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState('');
  const [loadingList,   setLoadingList]   = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending,       setSending]       = useState(false);
  const [error,         setError]         = useState('');
  const bottomRef  = useRef(null);
  const threadRef  = useRef(null);
  const prevIdRef  = useRef(activeId);

  const loadConversations = async (silent = false) => {
    if (!silent) setLoadingList(true);
    setError('');
    try {
      const data   = await listConversations();
      const convos = (data.conversations || []).map((c) => ({ ...c, messages: [] }));
      setAllConvos(convos);
      setActiveId((current) => {
        if (convos.length === 0) return null;
        if (!current) return convos[0].id;
        return convos.some((c) => c.id === current) ? current : convos[0].id;
      });
    } catch {
      if (!silent) setError('Could not load conversations.');
    } finally {
      if (!silent) setLoadingList(false);
    }
  };

  const loadThread = async (conversationId, silent = false) => {
    if (!conversationId) { setMessages([]); return; }
    if (!silent) setLoadingThread(true);
    try {
      const data = await listMessages(conversationId);
      setMessages(data.messages || []);
      setAllConvos((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
      );
    } catch {
      if (!silent) setError('Could not load messages for this conversation.');
    } finally {
      if (!silent) setLoadingThread(false);
    }
  };

  useEffect(() => {
    loadConversations(false);
    const id = window.setInterval(() => loadConversations(true), MESSAGES_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!activeId) { setMessages([]); return undefined; }
    loadThread(activeId, false);
    const id = window.setInterval(() => loadThread(activeId, true), MESSAGES_POLL_MS);
    return () => window.clearInterval(id);
  }, [activeId]);

  useEffect(() => {
    const switching = prevIdRef.current !== activeId;
    prevIdRef.current = activeId;
    if (switching) {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeId, messages.length]);

  const active   = allConvos.find((c) => c.id === activeId);
  const filtered = allConvos.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const send = async () => {
    const text = input.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    try {
      const data   = await sendMessage(activeId, text);
      const newMsg = data.message;
      setMessages((prev) => [...prev, newMsg]);
      setAllConvos((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, lastMessage: newMsg.text, time: newMsg.time } : c
        )
      );
      setInput('');
    } catch {
      setError('Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const totalUnread = allConvos.reduce((a, c) => a + (c.unread || 0), 0);

  return (
    <section className="user-messages-section">
      <div className="user-messages-wrapper">

        {}
        <div className="user-messages-left">
          <div className="user-messages-left-header">
            <h2>Messages</h2>
            {totalUnread > 0 && (
              <span className="user-messages-total">{totalUnread}</span>
            )}
          </div>

          <div className="user-messages-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loadingList && <p className="user-messages-status">Loading…</p>}
          {error       && <p className="user-messages-status user-messages-status--error">{error}</p>}

          <div className="user-messages-list">
            {!loadingList && !error && allConvos.length === 0 && (
              <p className="user-messages-empty">No HR has messaged you yet.</p>
            )}
            {!loadingList && !error && allConvos.length > 0 && filtered.length === 0 && (
              <p className="user-messages-status">No matching conversations.</p>
            )}
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`user-messages-item${c.id === activeId ? ' active' : ''}`}
                onClick={() => setActiveId(c.id)}
              >
                <div className="user-msg-avatar">{c.initials}</div>
                <div className="user-msg-info">
                  <div className="user-msg-top">
                    <span className="user-msg-name">{c.name}</span>
                    <span className="user-msg-time">{c.time}</span>
                  </div>
                  <div className="user-msg-bottom">
                    <span className="user-msg-preview">{c.lastMessage}</span>
                    {c.unread > 0 && <span className="user-msg-badge">{c.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        {active ? (
          <div className="user-messages-right">
            <div className="user-messages-thread-header">
              <div className="user-msg-avatar">{active.initials}</div>
              <div>
                <div className="user-thread-name">{active.name}</div>
                <div className="user-thread-role">{active.role || 'HR Recruiter'}</div>
              </div>
            </div>

            <div className="user-messages-thread" ref={threadRef}>
              {loadingThread && <p className="user-messages-status">Loading messages…</p>}
              {messages.map((msg) => (
                <div key={msg.id} className={`user-bubble-wrap ${msg.from === 'me' ? 'me' : 'them'}`}>
                  <div className="user-bubble">{msg.text}</div>
                  <div className="user-bubble-time">{msg.time}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="user-messages-input-bar">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={sending}
              />
              <button
                type="button"
                className="user-send-btn"
                onClick={send}
                disabled={!input.trim() || sending}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="user-messages-right user-messages-empty-state">
            <p>{loadingList ? 'Loading…' : 'Select a conversation to start messaging'}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default UserDashboardMessages;
