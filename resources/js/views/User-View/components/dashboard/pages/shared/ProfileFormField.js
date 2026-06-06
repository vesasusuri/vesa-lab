import React from 'react';
import './ProfileFormField.scss';

export default function ProfileFormField({
  label,
  icon = null,
  error,
  className = '',
  children,
}) {
  return (
    <div
      className={`profile-form-field${error ? ' profile-form-field--error' : ''}${className ? ` ${className}` : ''}`}
    >
      {label && (
        <label className="profile-form-field__label">
          {icon}
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="profile-form-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
