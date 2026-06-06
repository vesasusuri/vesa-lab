@extends('layouts.auth')

@section('title', 'Signup')
@section('content')
    <div class="auth-header">
        <h2 class="auth-title">Sign Up</h2>
        <p class="auth-message">Welcome. Create your account below.</p>
    </div>

    <form class="auth-form" id="signupForm" novalidate>
        <div class="field-row">
            <div class="field-group" data-field="first_name">
                <label class="field-label" for="first-name">First name</label>
                <input class="field-input" id="first-name" name="first_name" type="text" placeholder="John" />
                <span class="field-error"></span>
            </div>

            <div class="field-group" data-field="last_name">
                <label class="field-label" for="last-name">Last name</label>
                <input class="field-input" id="last-name" name="last_name" type="text" placeholder="Doe" />
                <span class="field-error"></span>
            </div>
        </div>

        <div class="field-group" data-field="email">
            <label class="field-label" for="signup-email">Email address</label>
            <input class="field-input" id="signup-email" name="email" type="email" placeholder="you@example.com" />
            <span class="field-error"></span>
        </div>

        <div class="field-group" data-field="password">
            <label class="field-label" for="signup-password">Password</label>
            <input class="field-input" id="signup-password" name="password" type="password" placeholder="Create a password" />
            <span class="field-error"></span>
        </div>

        <div class="field-group" data-field="password_confirmation">
            <label class="field-label" for="signup-password-confirmation">Confirm password</label>
            <input class="field-input" id="signup-password-confirmation" name="password_confirmation" type="password" placeholder="Repeat your password" />
            <span class="field-error"></span>
        </div>

        <label class="checkbox" for="terms">
            <input id="terms" name="terms" type="checkbox" />
            <span>I agree to the terms and privacy policy.</span>
        </label>

        <div class="field-group" data-field="terms" style="gap: 0;">
            <span class="field-error"></span>
        </div>

        <button type="submit" class="submit-button">Create account</button>

        <div class="auth-feedback" id="signupFeedback" role="status" aria-live="polite">
            Your details look good.
        </div>
    </form>

    <p class="auth-switch">
        Already have an account?
        <a href="{{ route('login') }}" class="form-link">Login instead</a>
    </p>
@endsection

@section('scripts')
    <script>
        (() => {
            const form = document.getElementById('signupForm');
            const feedback = document.getElementById('signupFeedback');
            const validators = {
                first_name: (value) => value.trim() ? '' : 'First name is required.',
                last_name: (value) => value.trim() ? '' : 'Last name is required.',
                email: (value) => {
                    if (!value.trim()) return 'Email is required.';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
                    return '';
                },
                password: (value) => {
                    if (!value.trim()) return 'Password is required.';
                    if (value.length < 8) return 'Password must be at least 8 characters.';
                    return '';
                },
                password_confirmation: (value) => {
                    if (!value.trim()) return 'Please confirm your password.';
                    if (value !== form.elements.password.value) return 'Passwords do not match.';
                    return '';
                },
                terms: () => form.elements.terms.checked ? '' : 'You must agree before continuing.'
            };

            const setError = (field, message) => {
                const group = form.querySelector(`[data-field="${field}"]`);
                group.classList.toggle('has-error', Boolean(message));
                group.querySelector('.field-error').textContent = message;
            };

            ['first_name', 'last_name', 'email', 'password', 'password_confirmation'].forEach((field) => {
                form.elements[field].addEventListener('input', () => {
                    setError(field, validators[field](form.elements[field].value));
                    if (field === 'password') {
                        setError('password_confirmation', validators.password_confirmation(form.elements.password_confirmation.value));
                    }
                });
            });

            form.elements.terms.addEventListener('change', () => {
                setError('terms', validators.terms());
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                let hasError = false;

                Object.keys(validators).forEach((field) => {
                    const value = form.elements[field]?.value ?? '';
                    const message = validators[field](value);
                    setError(field, message);
                    if (message) hasError = true;
                });

                feedback.classList.toggle('is-visible', !hasError);
                if (!hasError) form.reset();
            });
        })();
    </script>
@endsection
