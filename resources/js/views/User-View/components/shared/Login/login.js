import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaXTwitter } from 'react-icons/fa6';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../../../../../context/AuthContext';
import { getHomePathForRole } from '../../../../../utils/authRedirect';
import './login.scss';

const socialItems = [
    { label: 'Google', icon: <FaGoogle /> },
    { label: 'Facebook', icon: <FaFacebookF /> },
    { label: 'Twitter', icon: <FaXTwitter /> },
];

function validate(values) {
    const errors = {};

    if (!values.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!values.password.trim()) {
        errors.password = 'Password is required.';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
}

function mapServerErrors(error) {
    const data = error?.response?.data;
    if (!data) {
        return { form: 'Unable to sign in. Please try again.' };
    }

    if (data.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([key, messages]) => {
            mapped[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        return mapped;
    }

    return { form: data.message || 'Invalid email or password.' };
}

export default function LoginContent() {
    const navigate = useNavigate();
    const { login, user, loading: authLoading } = useAuth();
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            navigate(getHomePathForRole(user.role), { replace: true });
        }
    }, [authLoading, user, navigate]);

    const onChange = (event) => {
        const { name, value } = event.target;
        const nextValues = {
            ...values,
            [name]: value,
        };

        setValues(nextValues);
        setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            delete next.form;
            return { ...next, ...validate(nextValues) };
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const result = await login({
                email: values.email.trim(),
                password: values.password,
            });

            if (result?.first_login) {
                navigate('/first-login', {
                    replace: true,
                    state: { email: result.email ?? values.email.trim() },
                });
                return;
            }
            navigate(getHomePathForRole(result?.user?.role ?? result?.role), { replace: true });
        } catch (error) {
            setErrors(mapServerErrors(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="li" data-aos="fade-up">
            <div className="li-card">
                <div className="li-head">
                    <p className="li-tag">Welcome back</p>
                    <h1>Log in</h1>
                    <p className="li-sub">
                        Sign in with your account. You will be redirected to your dashboard based on your role
                        (job seeker, HR, or admin).
                    </p>
                </div>

                <form className="li-form" onSubmit={onSubmit} noValidate>
                    {errors.form && (
                        <div className="li-form-error" role="alert">{errors.form}</div>
                    )}

                    <label className={`li-field ${errors.email ? 'err' : ''}`} htmlFor="login-email">
                        <FiMail />
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={onChange}
                            autoComplete="email"
                            disabled={submitting}
                        />
                    </label>
                    <span className="li-msg">{errors.email ?? ''}</span>

                    <label className={`li-field ${errors.password ? 'err' : ''}`} htmlFor="login-password">
                        <FiLock />
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={onChange}
                            autoComplete="current-password"
                            disabled={submitting}
                        />
                    </label>
                    <span className="li-msg">{errors.password ?? ''}</span>

                    <button type="submit" className="li-btn" disabled={submitting || authLoading}>
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="li-alt">Don&apos;t have an account? <a href="/signup">Register</a></p>

                <div className="li-line"><span>Or continue with</span></div>

                <div className="li-social">
                    {socialItems.map((item) => (
                        <button key={item.label} type="button" className="li-sbtn" aria-label={`Continue with ${item.label}`}>
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
