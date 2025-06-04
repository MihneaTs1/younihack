import React from 'react';

export default function FormField({ label, id, type = 'text', required = false, value, onChange, placeholder, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
