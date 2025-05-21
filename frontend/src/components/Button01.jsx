import React from "react";

export default function Button({ type, children, className = "", ...props }) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}