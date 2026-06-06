@extends('layouts.auth')

@section('title', 'Login')
@section('content')
    <div class="auth-header">
        <h2 class="auth-title">Login</h2>
        <p class="auth-message">Welcome back. Please enter your details.</p>
    </div>

    <button type="button" class="social-button" aria-label="Sign in with Google">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.81 12.23c0-.72-.06-1.25-.19-1.8H12v3.39h5.65c-.11.84-.68 2.1-1.94 2.95l-.02.11 2.82 2.18.2.02c1.86-1.71 3.1-4.23 3.1-7.85Z"/>
            <path fill="#34A853" d="M12 22c2.76 0 5.08-.91 6.77-2.48l-3.23-2.5c-.86.6-2.01 1.02-3.54 1.02-2.7 0-4.99-1.78-5.81-4.23l-.1.01-2.93 2.27-.03.1A10.23 10.23 0 0 0 12 22Z"/>
            <path fill="#FBBC05" d="M6.19 13.81A6.13 6.13 0 0 1 5.85 12c0-.63.12-1.23.32-1.81l-.01-.12-2.97-2.3-.1.05A10 10 0 0 0 2 12c0 1.61.38 3.13 1.05 4.48l3.14-2.67Z"/>
            <path fill="#EA4335" d="M12 5.96c1.93 0 3.23.83 3.97 1.52l2.89-2.82C17.07 3 14.76 2 12 2a10.23 10.23 0 0 0-8.91 4.82l3.08 2.37C7.01 7.74 9.3 5.96 12 5.96Z"/>
        </svg>
        <span>Sign in with Google</span>
    </button>

    <div class="auth-divider"><span>or continue with email</span></div>

    <form class="auth-form" id="loginForm" novalidate>
        <div class="field-group" data-field="email">
            <label class="field-label" for="login-email">Email address</label>
            <input class="field-input" id="login-email" name="email" type="email" placeholder="you@example.com" />
            <span class="field-error"></span>
        </div>

        <div class="field-group" data-field="password">
            <label class="field-label" for="login-password">Password</label>
            <input class="field-input" id="login-password" name="password" type="password" placeholder="Enter your password" />
            <span class="field-error"></span>
        </div>

        <div class="form-row">
            <label class="checkbox" for="remember-me">
                <input id="remember-me" name="remember" type="checkbox" />
                <span>Remember Me</span>
            </label>

            <a href="#" class="form-link">Forgot Password?</a>
        </div>

        <button type="submit" class="submit-button">Login</button>

        <div class="auth-feedback" id="loginFeedback" role="status" aria-live="polite">
            Login details look good.
        </div>
    </form>

    <p class="auth-switch">
        Don't have an account?
        <a href="{{ route('signup') }}" class="form-link">Create one</a>
    </p>
@endsection

@section('scripts')
    <script>
        (() => {
            const form = document.getElementById('loginForm');
            const feedback = document.getElementById('loginFeedback');
            const validators = {
                email: (value) => {
                    if (!value.trim()) return 'Email is required.';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
                    return '';
                },
                password: (value) => {
                    if (!value.trim()) return 'Password is required.';
                    if (value.length < 6) return 'Password must be at least 6 characters.';
                    return '';
                }
            };

            const setError = (field, message) => {
                const group = form.querySelector(`[data-field="${field}"]`);
                group.classList.toggle('has-error', Boolean(message));
                group.querySelector('.field-error').textContent = message;
            };

            Object.keys(validators).forEach((field) => {
                form.elements[field].addEventListener('input', () => {
                    setError(field, validators[field](form.elements[field].value));
                });
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                let hasError = false;

                Object.keys(validators).forEach((field) => {
                    const message = validators[field](form.elements[field].value);
                    setError(field, message);
                    if (message) hasError = true;
                });

                feedback.classList.toggle('is-visible', !hasError);
                if (!hasError) form.reset();
            });
        })();
    </script>
@endsection
