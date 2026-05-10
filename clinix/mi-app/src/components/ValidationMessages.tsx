import React from 'react';

type Props = {
  errors?: Record<string, string> | null;
  field?: string;
  className?: string;
};

export default function ValidationMessages({ errors, field, className }: Props) {
  if (!errors || Object.keys(errors).length === 0) return null;

  if (field) {
    const msg = (errors as Record<string,string>)[field];
    if (!msg) return null;
    return <p className={`error-txt ${className ?? ''}`} style={{ marginTop: 8 }}>{msg}</p>;
  }

  return (
    <div className={className ?? ''} role="alert" aria-live="assertive" style={{ marginBottom: 12 }}>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {Object.entries(errors).map(([k, v]) => (
          <li key={k} className="error-txt">{v}</li>
        ))}
      </ul>
    </div>
  );
}
