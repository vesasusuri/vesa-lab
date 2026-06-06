import React, { useEffect, useRef, useState } from 'react';
import {
  listConversations,
  listMessageableCandidates,
  listMessages,
  sendMessage,
  startConversation,
  MESSAGES_POLL_MS,
} from '../../../../../api/messagesApi';
import './HireDashboardMessages.scss';

const HireDashboardMessages = () => {
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [allConvos, setAllConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const bottomRef = useRef(null);
  const threadRef = useRef(null);
  const prevIdRef = useRef(activeId);

  const loadConversations = async (silent = false) => {
    if (!silent) {
      setLoadingList(true);
    }
    setError('');
    try {
      const data = await listConversations();
      const convos = (data.conversations || []).map((c) => ({
        ...c,
        messages: [],
      }));
      setAllConvos(convos);
      // Keep the user's selected chat during polling (interval uses a stale closure).
      setActiveId((current) => {
        if (convos.length === 0) return null;
        if (!current) return convos[0].id;
        return convos.some((c) => c.id === current) ? current : convos[0].id;
      });
    } catch {
      if (!silent) {
        setError('Could not load conversations. Log in as HR.');
      }
    } finally {
      if (!silent) {
        setLoadingList(false);
      }
    }
  };

  const loadThread = async (conversationId, silent = false) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    if (!silent) {
      setLoadingThread(true);
    }
    try {
      const data = await listMessages(conversationId);
      setMessages(data.messages || []);
      setAllConvos((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
      );
    } catch {
      if (!silent) {
        setError('Could not load messages for this conversation.');
      }
    } finally {
      if (!silent) {
        setLoadingThread(false);
      }
    }
  };

  useEffect(() => {
    loadConversations(false);
    const listPollId = window.setInterval(() => loadConversations(true), MESSAGES_POLL_MS);
    return () => window.clearInterval(listPollId);
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return undefined;
    }

    loadThread(activeId, false);
    const threadPollId = window.setInterval(() => loadThread(activeId, true), MESSAGES_POLL_MS);

    return () => window.clearInterval(threadPollId);
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

  const active = allConvos.find((c) => c.id === activeId);

  const filtered = allConvos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const openConvo = (id) => {
    setActiveId(id);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !activeId || sending) return;

    setSending(true);
    try {
      const data = await sendMessage(activeId, text);
      const newMsg = data.message;
      setMessages((prev) => [...prev, newMsg]);
      setAllConvos((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, lastMessage: newMsg.text, time: newMsg.time }
            : c
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const openNewChatPicker = async () => {
    setShowNewChat(true);
    try {
      const data = await listMessageableCandidates();
      setCandidates(data.candidates || []);
    } catch {
      setCandidates([]);
    }
  };

  const beginChatWithCandidate = async (candidateUserId) => {
    try {
      const data = await startConversation({ candidate_user_id: candidateUserId });
      await loadConversations();
      setActiveId(data.conversation.id);
      setShowNewChat(false);
    } catch {
      setError('Could not start conversation.');
    }
  };

  return (
    <section className="hire-messages-section">
      <div className="hire-messages-wrapper">

        <div className="hire-messages-left">
          <div className="hire-messages-left-header">
            <h2>Messages</h2>
            <button type="button" className="hire-messages-new-btn" onClick={openNewChatPicker}>
              New
            </button>
            <span className="hire-messages-total">
              {allConvos.reduce((a, c) => a + (c.unread || 0), 0) || ''}
            </span>
          </div>

          {showNewChat && (
            <div className="hire-messages-new-panel">
              <p>Start chat with an applicant:</p>
              {candidates.length === 0 && (
                <p className="hire-messages-new-empty">
                  No new applicants to message. Candidates appear here after they apply to your job listings.
                </p>
              )}
              {candidates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="hire-messages-new-item"
                  onClick={() => beginChatWithCandidate(c.id)}
                >
                  {c.name}
                </button>
              ))}
              <button type="button" onClick={() => setShowNewChat(false)}>Cancel</button>
            </div>
          )}

          <div className="hire-messages-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loadingList && <p className="hire-messages-status">Loading…</p>}
          {error && <p className="hire-messages-status hire-messages-status--error">{error}</p>}

          <div className="hire-messages-list">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`hire-messages-item${c.id === activeId ? ' active' : ''}`}
                onClick={() => openConvo(c.id)}
              >
                <div className="hire-msg-avatar">{c.initials}</div>
                <div className="hire-msg-info">
                  <div className="hire-msg-top">
                    <span className="hire-msg-name">{c.name}</span>
                    <span className="hire-msg-time">{c.time}</span>
                  </div>
                  <div className="hire-msg-bottom">
                    <span className="hire-msg-preview">{c.lastMessage}</span>
                    {c.unread > 0 && <span className="hire-msg-badge">{c.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {active ? (
          <div className="hire-messages-right">
            <div className="hire-messages-thread-header">
              <div className="hire-msg-avatar">{active.initials}</div>
              <div>
                <div className="hire-thread-name">{active.name}</div>
                <div className="hire-thread-role">{active.role || 'Candidate'}</div>
              </div>
            </div>

            <div className="hire-messages-thread" ref={threadRef}>
              {loadingThread && <p className="hire-messages-status">Loading messages…</p>}
              {messages.map((msg) => (
                <div key={msg.id} className={`hire-bubble-wrap ${msg.from === 'me' ? 'me' : 'them'}`}>
                  <div className="hire-bubble">{msg.text}</div>
                  <div className="hire-bubble-time">{msg.time}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="hire-messages-input-bar">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={sending}
              />
              <button type="button" className="hire-send-btn" onClick={send} disabled={!input.trim() || sending}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="hire-messages-right hire-messages-empty-state">
            <p>{loadingList ? 'Loading…' : 'Select or start a conversation'}</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default HireDashboardMessages;
