import React from "react";

export default function RegistrationForm({ form, onChange, onSubmit, message }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
        required
      />
      <select
        name="role"
        value={form.role}
        onChange={onChange}
        required
      >
        <option value="Standard User">Standard User</option>
        <option value="Organizer">Organizer</option>
        <option value="System Admin">System Admin</option>
      </select>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        required
      />
      <button type="submit">Register</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}