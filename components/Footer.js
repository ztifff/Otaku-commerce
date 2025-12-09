// src/components/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer mt-5 py-4 border-top bg-white">
      <Container className="d-flex justify-content-between flex-wrap align-items-center">
        <div>
          <span className="fw-bold">OTAKUMART</span> |{' '}
          <Link to="/privacy-policy" className="text-decoration-none">Privacy Policy</Link> |{' '}
          <Link to="/terms-of-service" className="text-decoration-none">Terms of Service</Link> |{' '}
          <Link to="/contact-us" className="text-decoration-none">Contact Us</Link>
          <div className="small mt-1">© 2025 OTAKUMART. All rights reserved.</div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <span className="fw-semibold mb-1">Follow Us</span>
          <div className="d-flex">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-2">📘</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="me-2">📸</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-2">🐦</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">📌</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
