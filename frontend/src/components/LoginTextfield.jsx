import React from "react";

export default function TextField({ type, name, placeholder, value, onChange, required }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="auth-input"
    />
  );
}