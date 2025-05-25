// components/Button.jsx
import React from 'react';
import './styles/Button01.css'; // We'll move the styles here

const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
   
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;