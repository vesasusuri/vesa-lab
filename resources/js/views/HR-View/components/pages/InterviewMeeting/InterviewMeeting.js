import React, { useEffect, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { getRoomAccess } from '../../../../../api/interviewsApi';
import './InterviewMeeting.scss';

const InterviewMeeting = ({ token, onLeave }) => {
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getRoomAccess(token);
        if (!cancelled) {
          setInterview(data.interview);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err?.response?.data?.message
            || 'You are not authorized to join this interview room.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (token) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <p className="interview-meeting__status">Verifying access…</p>;
  }

  if (error) {
    return (
      <div className="interview-meeting__error">
        <p>{error}</p>
        {onLeave && (
          <button type="button" onClick={onLeave}>
            Back to interviews
          </button>
        )}
      </div>
    );
  }

  if (!interview?.room_name) {
    return <p className="interview-meeting__status">Interview room unavailable.</p>;
  }

  return (
    <div className="interview-meeting">
      <div className="interview-meeting__header">
        <div>
          <span className="interview-meeting__eyebrow">Live interview</span>
          <h2>{interview.title}</h2>
          {interview.company && <p>{interview.company}</p>}
        </div>
        {onLeave && (
          <button type="button" className="interview-meeting__back" onClick={onLeave}>
            Leave room
          </button>
        )}
      </div>

      <div className="interview-meeting__frame">
        <JitsiMeeting
          domain={interview.jitsi_domain || 'meet.jit.si'}
          roomName={interview.room_name}
          configOverwrite={{
            disableDeepLinking: true,
            prejoinPageEnabled: true,
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
          onReadyToClose={onLeave}
        />
      </div>
    </div>
  );
};

export default InterviewMeeting;
