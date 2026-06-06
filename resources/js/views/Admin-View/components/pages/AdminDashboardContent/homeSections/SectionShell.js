import React from 'react';

const SectionShell = ({ title, subtitle, children }) => (
  <div className="admin-home-section-block">
    <div className="admin-home-section-block__head">
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    <div className="admin-home-section-block__body">{children}</div>
  </div>
);

export default SectionShell;
