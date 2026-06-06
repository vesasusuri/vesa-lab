import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiRefreshCw,
} from 'react-icons/fi';
import {
    sendFirstLoginCode,
    verifyFirstLoginCode,
    resendFirstLoginCode,
    setFirstLoginPassword,
} from '../../../api/authApi';
import { getHomePathForRole } from '../../../utils/authRedirect';
import './FirstLoginPage.scss';

const STEPS = { CREDENTIALS: 1, VERIFY_CODE: 2, SET_PASSWORD: 3 };

const STEP_META = [
    { label: 'Credentials' },
    { label: 'Verify Email' },
    { label: 'Set Password' },
];

const PW_RULES = [
    { label: 'At least 8 characters',     test: (p) => p.length >= 8 },
    { label: 'One uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
    { label: 'One number (0–9)',           test: (p) => /\d/.test(p) },
    { label: 'One special character',      test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function FirstLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep]     = useState(STEPS.CREDENTIALS);

const [email, setEmail]               = useState(location.state?.email ?? '');
    const [tempPw, setTempPw]             = useState('');
    const [showTempPw, setShowTempPw]     = useState(false);

const [code, setCode]                 = useState('');
    const [token, setToken]               = useState('');
    const [resendTimer, setResendTimer]   = useState(0);

const [password, setPassword]         = useState('');
    const [confirm, setConfirm]           = useState('');
    const [showPw, setShowPw]             = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');
    const [notice, setNotice]             = useState('');

const startCountdown = (secs = 60) => {
        setResendTimer(secs);
        const iv = setInterval(() => setResendTimer((t) => {
            if (t <= 1) { clearInterval(iv); return 0; }
            return t - 1;
        }), 1000);
    };

const handleSendCode = async (e) => {
        e.preventDefault();
        setError(''); setNotice('');
        setLoading(true);
        try {
            const data = await sendFirstLoginCode({ email: email.trim(), temp_password: tempPw });
            setToken(data.onboarding_token);
            setStep(STEPS.VERIFY_CODE);
            startCountdown();
        } catch (err) {
            const d = err.response?.data;
            setError(d?.errors?.email?.[0] ?? d?.message ?? 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError(''); setNotice('');
        setLoading(true);
        try {
            await verifyFirstLoginCode({ onboarding_token: token, code });
            setStep(STEPS.SET_PASSWORD);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Incorrect or expired code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError(''); setNotice('');
        try {
            await resendFirstLoginCode({ onboarding_token: token });
            setNotice('A new code has been sent to your email.');
            startCountdown();
        } catch (err) {
            setError(err.response?.data?.message ?? 'Could not resend code.');
        }
    };

const handleSetPassword = async (e) => {
        e.preventDefault();
        setError(''); setNotice('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        const unmet = PW_RULES.filter((r) => !r.test(password));
        if (unmet.length) { setError('Password does not meet all requirements.'); return; }
        setLoading(true);
        try {
            const data = await setFirstLoginPassword({
                onboarding_token: token, password, password_confirmation: confirm,
            });
            navigate(getHomePathForRole(data.user?.role), { replace: true });
        } catch (err) {
            const d = err.response?.data;
            setError(d?.errors?.password?.join(' ') ?? d?.message ?? 'Could not set password.');
        } finally {
            setLoading(false);
        }
    };

const pwStrength = PW_RULES.filter((r) => r.test(password)).length;

    return (
        <div className="fl-page">
            <div className="fl-card">

                {/* ── Logo ── */}
                <a href="/" className="fl-logo" aria-label="Bee Hired home">
                    <img src="/images/logo-email.png" alt="Bee Hired" />
                </a>

                {/* ── Step indicator ── */}
                <div className="fl-progress" aria-label={`Step ${step} of ${STEP_META.length}`}>
                    <div className="fl-progress-track">
                        <div
                            className="fl-progress-fill"
                            style={{ width: `${(step / STEP_META.length) * 100}%` }}
                        />
                    </div>
                    <div className="fl-step-labels">
                        {STEP_META.map(({ label }, i) => {
                            const idx = i + 1;
                            const done = step > idx;
                            const active = step === idx;
                            return (
                                <span
                                    key={label}
                                    className={`fl-step-label ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                                >
                                    {done ? <FiCheck size={11} strokeWidth={3} /> : null}
                                    {label}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* ── Alerts ── */}
                {error  && <div className="fl-alert error"><span>⚠</span>{error}</div>}
                {notice && <div className="fl-alert success"><FiCheck size={13} />{notice}</div>}

                {/* ══════ STEP 1 ══════ */}
                {step === STEPS.CREDENTIALS && (
                    <form className="fl-form" onSubmit={handleSendCode} noValidate>
                        <div className="fl-form-intro">
                            <span className="fl-step-eyebrow">Step 1 of 3</span>
                            <h1>Account Setup</h1>
                            <p>Enter the credentials from your invitation email. A verification code will be sent to your inbox.</p>
                        </div>

                        <div className="fl-field">
                            <label htmlFor="fl-email">Email address</label>
                            <div className="fl-input-icon-wrap">
                                <FiMail className="fl-input-icon" size={16} />
                                <input
                                    id="fl-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                    autoFocus={!email}
                                />
                            </div>
                        </div>

                        <div className="fl-field">
                            <label htmlFor="fl-temp-pw">Temporary password</label>
                            <div className="fl-input-icon-wrap">
                                <FiLock className="fl-input-icon" size={16} />
                                <input
                                    id="fl-temp-pw"
                                    type={showTempPw ? 'text' : 'password'}
                                    value={tempPw}
                                    onChange={(e) => setTempPw(e.target.value)}
                                    placeholder="From your invitation email"
                                    required
                                    autoFocus={!!email}
                                />
                                <button type="button" className="fl-eye-btn" onClick={() => setShowTempPw((v) => !v)} tabIndex={-1}>
                                    {showTempPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button className="fl-submit-btn" type="submit" disabled={loading}>
                            {loading
                                ? <><FiRefreshCw className="fl-spin" size={15} /> Sending code…</>
                                : 'Continue'}
                        </button>

                        <p className="fl-footer-link">Already activated? <a href="/login">Sign in here</a></p>
                    </form>
                )}

                {}
                {step === STEPS.VERIFY_CODE && (
                    <form className="fl-form" onSubmit={handleVerifyCode} noValidate>
                        <div className="fl-form-intro">
                            <span className="fl-step-eyebrow">Step 2 of 3</span>
                            <h1>Verify your identity</h1>
                            <p>We sent a 4-digit code to <strong>{email}</strong>. Enter it below — it expires in 10 minutes.</p>
                        </div>

                        <div className="fl-field">
                            <label htmlFor="fl-code">Verification code</label>
                            <input
                                id="fl-code"
                                className="fl-code-input"
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="• • • •"
                                required
                                autoFocus
                                autoComplete="one-time-code"
                            />
                        </div>

                        <button className="fl-submit-btn" type="submit" disabled={loading || code.length < 4}>
                            {loading
                                ? <><FiRefreshCw className="fl-spin" size={15} /> Verifying…</>
                                : 'Verify code'}
                        </button>

                        <button type="button" className="fl-ghost-btn" onClick={handleResend} disabled={resendTimer > 0}>
                            {resendTimer > 0
                                ? `Resend in ${resendTimer}s`
                                : <><FiRefreshCw size={13} /> Resend code</>}
                        </button>
                    </form>
                )}

                {}
                {step === STEPS.SET_PASSWORD && (
                    <form className="fl-form" onSubmit={handleSetPassword} noValidate>
                        <div className="fl-form-intro">
                            <span className="fl-step-eyebrow">Step 3 of 3</span>
                            <h1>Create your password</h1>
                            <p>Choose a strong password to secure your BeeHired account.</p>
                        </div>

                        <div className="fl-field">
                            <label htmlFor="fl-pw">New password</label>
                            <div className="fl-input-icon-wrap">
                                <FiLock className="fl-input-icon" size={16} />
                                <input
                                    id="fl-pw"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    autoFocus
                                />
                                <button type="button" className="fl-eye-btn" onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
                                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                            {}
                            {password.length > 0 && (
                                <div className="fl-strength-bar">
                                    {[1,2,3,4,5].map((n) => (
                                        <div key={n} className={`fl-strength-seg ${n <= pwStrength ? `seg-${pwStrength}` : ''}`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {}
                        {password.length > 0 && (
                            <ul className="fl-rules">
                                {PW_RULES.map((r) => (
                                    <li key={r.label} className={r.test(password) ? 'met' : ''}>
                                        {r.test(password)
                                            ? <FiCheck size={12} strokeWidth={3} className="fl-rule-icon met" />
                                            : <span className="fl-rule-dot" />}
                                        {r.label}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="fl-field">
                            <label htmlFor="fl-pw-confirm">Confirm password</label>
                            <div className="fl-input-icon-wrap">
                                <FiLock className="fl-input-icon" size={16} />
                                <input
                                    id="fl-pw-confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                />
                                <button type="button" className="fl-eye-btn" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                                    {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                </button>
                            </div>
                            {confirm.length > 0 && password !== confirm && (
                                <span className="fl-field-hint error">Passwords do not match</span>
                            )}
                            {confirm.length > 0 && password === confirm && (
                                <span className="fl-field-hint success"><FiCheck size={12} /> Passwords match</span>
                            )}
                        </div>

                        <button
                            className="fl-submit-btn"
                            type="submit"
                            disabled={loading || !PW_RULES.every((r) => r.test(password)) || password !== confirm}
                        >
                            {loading
                                ? <><FiRefreshCw className="fl-spin" size={15} /> Activating…</>
                                : <><FiCheck size={15} /> Activate account</>}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
