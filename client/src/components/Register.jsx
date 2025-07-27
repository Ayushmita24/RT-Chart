import { useState } from "react";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registering:", form);

    // Simulate successful registration logic
    alert("Registration successful!");

    // Automatically switch to Login page
    onSwitch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Register</button>
      <p onClick={onSwitch} style={{ cursor: "pointer", color: "blue" }}>
        Already have an account? Login
      </p>
    </form>
  );
}
