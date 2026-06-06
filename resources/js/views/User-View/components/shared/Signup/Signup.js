import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaXTwitter } from 'react-icons/fa6';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { useAuth } from '../../../../../context/AuthContext';
import { getHomePathForRole } from '../../../../../utils/authRedirect';
import './Signup.scss';

const socialItems = [
    { label: 'Google', icon: <FaGoogle /> },
    { label: 'Facebook', icon: <FaFacebookF /> },
    { label: 'Twitter', icon: <FaXTwitter /> },
];

const schema = Yup.object({
    full_name: Yup.string()
        .trim()
        .matches(/^[^\d]*$/, 'Name cannot contain numbers.')
        .required('Full name is required.'),
    email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
    password: Yup.string().min(8, 'Password must be at least 8 characters.').required('Password is required.'),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match.')
        .required('Please confirm your password.'),
    terms: Yup.boolean().oneOf([true], 'You must agree before continuing.'),
});

async function validate(values) {
    try {
        await schema.validate(values, { abortEarly: false });
        return {};
    } catch (err) {
        return err.inner.reduce((acc, e) => ({ ...acc, [e.path]: e.message }), {});
    }
}

function mapServerErrors(error) {
    const data = error?.response?.data;
    if (!data) {
        return { form: 'Unable to create account. Please try again.' };
    }

    if (data.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([key, messages]) => {
            mapped[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        return mapped;
    }

    return { form: data.message || 'Registration failed.' };
}

export default function SignupContent() {
    const navigate = useNavigate();
    const { register, user, loading: authLoading } = useAuth();
    const [values, setValues] = useState({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
        newsletter: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            navigate(getHomePathForRole(user.role), { replace: true });
        }
    }, [authLoading, user, navigate]);

    const onChange = async (event) => {
        const { name, type, checked, value } = event.target;
        const nextValues = {
            ...values,
            [name]: type === 'checkbox' ? checked : value,
        };

        setValues(nextValues);
        const nextErrors = await validate(nextValues);
        setErrors((prev) => ({ ...prev, ...nextErrors, [name]: nextErrors[name] }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = await validate(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const registeredUser = await register({
                full_name: values.full_name.trim(),
                email: values.email.trim(),
                password: values.password,
                password_confirmation: values.password_confirmation,
            });
            navigate(getHomePathForRole(registeredUser?.role), { replace: true });
        } catch (error) {
            setErrors(mapServerErrors(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="su" data-aos="fade-up">
            <div className="su-card">
                <div className="su-head">
                    <p className="su-tag">Job seeker registration</p>
                    <h1>Sign up</h1>
                    <p className="su-sub">
                        Create a candidate account to apply for jobs and manage your profile.
                        HR accounts are created by an administrator.
                    </p>
                </div>

                <form className="su-form" onSubmit={onSubmit} noValidate>
                    {errors.form && (
                        <div className="su-form-error" role="alert">{errors.form}</div>
                    )}

                    <label className={`su-field ${errors.full_name ? 'err' : ''}`} htmlFor="signup-name">
                        <FiUser />
                        <input
                            id="signup-name"
                            name="full_name"
                            type="text"
                            placeholder="Full name"
                            value={values.full_name}
                            onChange={onChange}
                            autoComplete="name"
                            disabled={submitting}
                        />
                    </label>
                    <span className="su-msg">{errors.full_name ?? ''}</span>

                    <label className={`su-field ${errors.email ? 'err' : ''}`} htmlFor="signup-email">
                        <FiMail />
                        <input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={onChange}
                            autoComplete="email"
                            disabled={submitting}
                        />
                    </label>
                    <span className="su-msg">{errors.email ?? ''}</span>

                    <label className={`su-field ${errors.password ? 'err' : ''}`} htmlFor="signup-password">
                        <FiLock />
                        <input
                            id="signup-password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={onChange}
                            autoComplete="new-password"
                            disabled={submitting}
                        />
                    </label>
                    <span className="su-msg">{errors.password ?? ''}</span>

                    <label className={`su-field ${errors.password_confirmation ? 'err' : ''}`} htmlFor="signup-password-confirmation">
                        <FiLock />
                        <input
                            id="signup-password-confirmation"
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirm password"
                            value={values.password_confirmation}
                            onChange={onChange}
                            autoComplete="new-password"
                            disabled={submitting}
                        />
                    </label>
                    <span className="su-msg">{errors.password_confirmation ?? ''}</span>

                    <label className="su-check" htmlFor="signup-terms">
                        <input
                            id="signup-terms"
                            name="terms"
                            type="checkbox"
                            checked={values.terms}
                            onChange={onChange}
                            disabled={submitting}
                        />
                        <span>I agree to the Terms and Privacy Policy.</span>
                    </label>
                    <span className="su-msg">{errors.terms ?? ''}</span>

                    <label className="su-check" htmlFor="signup-newsletter">
                        <input
                            id="signup-newsletter"
                            name="newsletter"
                            type="checkbox"
                            checked={values.newsletter}
                            onChange={onChange}
                            disabled={submitting}
                        />
                        <span>Send me product and hiring updates.</span>
                    </label>

                    <button type="submit" className="su-btn" disabled={submitting || authLoading}>
                        {submitting ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="su-alt">
                    Already have an account? <a href="/login">Log in</a>
                    {' '}· HR or admin? Use the same login page with your credentials.
                </p>

                <div className="su-line"><span>Or continue with</span></div>

                <div className="su-social">
                    {socialItems.map((item) => (
                        <button key={item.label} type="button" className="su-sbtn" aria-label={`Continue with ${item.label}`}>
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
