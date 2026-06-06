import React, { useState } from 'react';
import { FiBriefcase, FiFileText, FiStar, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import './CompaniesForm.scss';

const schema = Yup.object({
  author: Yup.string().trim().matches(/^[^\d]*$/, 'Name cannot contain numbers.').required('Name is required.'),
  role: Yup.string().trim().required('Role is required.'),
  rating: Yup.number().integer().min(1, 'Rating must be between 1 and 5.').max(5, 'Rating must be between 1 and 5.').required('Rating is required.'),
  comment: Yup.string().trim().min(12, 'Review must be at least 12 characters.').required('Please add a short review.'),
});

async function validate(values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner.reduce((acc, e) => ({ ...acc, [e.path]: e.message }), {});
  }
}

const initialValues = {
  author: '',
  role: '',
  rating: '5',
  comment: '',
};

function CompaniesForm({ companyName = 'this company', onAddReview }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };

    setValues(nextValues);
    setErrors(await validate(nextValues));
    setShowFeedback(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = await validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setShowFeedback(false);
      return;
    }

    onAddReview?.({
      id: Date.now(),
      author: values.author.trim(),
      role: values.role.trim(),
      rating: Number(values.rating),
      comment: values.comment.trim(),
    });

    setValues(initialValues);
    setErrors({});
    setShowFeedback(true);
  };

  return (
    <section className="company-review-form-section" data-aos="fade-up">
      <article className="company-review-card" data-aos="fade-up">
        <div className="company-review-card-head">
          <p className="company-review-eyebrow">Add review</p>
          <h2>Share your experience with {companyName}.</h2>
          <p>
            Add a short, useful review for people researching this company.
          </p>
        </div>

        <form className="company-review-form" onSubmit={handleSubmit} noValidate data-aos="fade-up">
          <div className="company-review-form-row">
            <Field
              id="review-author"
              name="author"
              label="Full name"
              placeholder="Full name"
              value={values.author}
              error={errors.author}
              icon={<FiUser />}
              onChange={handleChange}
              
            />

            <Field
              id="review-role"
              name="role"
              label="Role"
              placeholder="Your role"
              value={values.role}
              error={errors.role}
              icon={<FiBriefcase />}
              onChange={handleChange}
            />
          </div>

          <Field
            id="review-rating"
            name="rating"
            type="number"
            label="Rating"
            placeholder="5"
            value={values.rating}
            error={errors.rating}
            icon={<FiStar />}
            onChange={handleChange}
            min="1"
            max="5"
          />

          <Field
            id="review-comment"
            name="comment"
            label="Review"
            placeholder="Tell others what working there was like"
            value={values.comment}
            error={errors.comment}
            icon={<FiFileText />}
            onChange={handleChange}
            textarea
          />

          <div className="company-review-form-actions">
            <button type="submit" className="company-review-btn">
              Add review
            </button>

            <div
              className={`company-review-feedback ${showFeedback ? 'show' : ''}`}
              role="status"
              aria-live="polite"
            >
              Your review was added.
            </div>
          </div>
        </form>
      </article>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  icon,
  onChange,
  textarea = false,
  min,
  max,
}) {
  return (
    <label className={`company-review-field ${error ? 'error' : ''}`} htmlFor={id}>
      <span className="company-review-field-label">{label}</span>

      <div className={`company-review-field-box ${textarea ? 'textarea-box' : ''}`}>
        <span className="company-review-field-icon">{icon}</span>

        {textarea ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
          />
        )}
      </div>

      <span className="company-review-field-error">{error || ''}</span>
    </label>
  );
}


export default CompaniesForm;
