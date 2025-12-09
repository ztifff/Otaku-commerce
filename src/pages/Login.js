import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // login loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e, admin = false) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loading

    try {
      const res = await fetch("http://192.168.99.100:8082/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          role: admin ? "admin" : "user"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.user, data.token);

      navigate(admin ? "/admin/products" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <main className="auth-page">
      <Container className="d-flex justify-content-center align-items-center flex-column">
        <h2 className="fw-bold mb-4">Login</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form
          onSubmit={(e) => handleSubmit(e, false)}
          className="auth-form p-4 rounded-3 shadow-sm bg-white"
        >
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
            className="w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            variant="secondary"
            type="button"
            className="w-100"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </Button>
        </Form>
      </Container>
    </main>
  );
}

export default Login;
