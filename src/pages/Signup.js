import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loading

    try {
      const res = await fetch("https://laravel-backend-production-f902.up.railway.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // optionally store token here if needed
      // localStorage.setItem("authToken", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));

      alert("✅ Signup successful! Please login.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <main className="auth-page">
      <Container className="d-flex justify-content-center align-items-center flex-column">
        <h2 className="fw-bold mb-4">Create Account</h2>
        <Form
          onSubmit={handleSubmit}
          className="auth-form p-4 rounded-3 shadow-sm bg-white"
        >
          {error && <p className="text-danger">{error}</p>}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 btn-signup"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Form>
      </Container>
    </main>
  );
}

export default Signup;
