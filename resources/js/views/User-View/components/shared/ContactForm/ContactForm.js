import axios from 'axios';
import React, { useState } from 'react';
import { FiFileText, FiMail, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { usePlatformAdmin } from '../../../../../context/PlatformAdminContext';
import './ContactForm.scss';

const nameRule = () =>
  Yup.string()
    .trim()
    .matches(/^[^\d]*$/, 'Name cannot contain numbers.')
    .required('This field is required.');

const schema = Yup.object({
  firstName: nameRule().label('First name'),
  lastName:  nameRule().label('Last name'),
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
  notes: Yup.string().trim().required('Please add a short message.'),
});

const details = [
  { label: 'Email', value: 'info@beehired.com' },
  { label: 'Support hours', value: 'Mon - Fri, 9:00 - 18:00' },
  { label: 'Office', value: 'Remote-first across Europe' },
];

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  notes: '',
};

function ContactForm() {
  const { data } = usePlatformAdmin();
  const contactContent = data.pageContent?.contact || {};

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateAll = async (vals) => {
    try {
      await schema.validate(vals, { abortEarly: false });
      return {};
    } catch (err) {
      return err.inner.reduce((acc, e) => ({ ...acc, [e.path]: e.message }), {});
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors(await validateAll(nextValues));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = await validateAll(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setServerError('');

    try {
      await axios.post('/api/contact', values);
      setSubmitted(true);
      setValues(initialValues);
      setErrors({});
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact">
        <div className="container grid">
          <article className="card form-card">
            <div className="card-head">
              <h2>{contactContent.formTitle || 'Tell us what you need.'}</h2>
              <p>
                {contactContent.formDescription || 'Keep it short and direct. We only ask for the details needed to respond properly.'}
              </p>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <Field id="first-name" name="firstName" label="First name" placeholder="First name" value={values.firstName} error={errors.firstName} icon={<FiUser />}  onChange={handleChange}/>
                <Field id="last-name" name="lastName"  label="Last name"  placeholder="Last name" value={values.lastName}  error={errors.lastName} icon={<FiUser />} onChange={handleChange}/>
              </div>

              <Field id="email" name="email" type="email" label="Email address" placeholder="Email address" value={values.email} error={errors.email}  icon={<FiMail />}  onChange={handleChange}/>

              <Field id="notes" name="notes" label="Notes" placeholder="Tell us a bit about your question" value={values.notes}  error={errors.notes} icon={<FiFileText />} onChange={handleChange} textarea/>

              {serverError && (
                <div className="feedback error" role="alert">{serverError}</div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Sending…' : (contactContent.primaryCta || 'Send message')}
                </button>

                <div className={`feedback ${submitted ? 'show' : ''}`} role="status" aria-live="polite">
                  Message sent! We'll get back to you soon.
                </div>
              </div>
            </form>
          </article>

          <aside className="side">
            <article className="card info-card">
              <p className="eyebrow">Details</p>
              <h3>Useful contact info.</h3>

              <div className="info-list">
                {details.map((item) => (
                  <div className="info-item" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>

    </div>
  );
}

function Field({id, name, label, type = 'text',placeholder, value,error, icon, onChange,textarea = false,}) {
  return (
    <label className={`field ${error ? 'error' : ''}`} htmlFor={id}>
      <span className="field-label">{label}</span>

      <div className={`field-box ${textarea ? 'textarea-box' : ''}`}>
        <span className="field-icon">{icon}</span>

        {textarea ? (
          <textarea id={id}name={name}placeholder={placeholder}value={value}onChange={onChange}/>
        ) : (
          <input id={id} name={name}type={type}placeholder={placeholder} value={value} onChange={onChange} />
        )}
      </div>

      <span className="field-error">{error || ''}</span>
    </label>
  );
}


export default ContactForm;
