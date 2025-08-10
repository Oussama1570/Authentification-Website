// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section
      className="min-vh-100 d-flex align-items-center bg-body"
      style={{
        backgroundImage:
          "radial-gradient(1200px 600px at -10% -10%, rgba(13,110,253,.12), transparent 60%), radial-gradient(1000px 500px at 110% 110%, rgba(111,66,193,.12), transparent 60%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-lg-8">
            <h1 className="display-5 fw-bold mb-3">
              Welcome to AuthApp 👋
            </h1>
            <p className="lead text-muted mb-4">
              Start by registering or logging in to access your dashboard.
            </p>

            <div className="d-flex gap-2 justify-content-center">
              <Link to="/register" className="btn btn-primary btn-lg px-4">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
                Login
              </Link>
            </div>

            {/* Optional mini features */}
            <div className="row mt-5 g-3 justify-content-center">
              <div className="col-6 col-md-4">
                <div className="p-3 border rounded-3 h-100">
                  🔐 Secure Auth
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="p-3 border rounded-3 h-100">
                  🌙 Dark Mode
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="p-3 border rounded-3 h-100">
                  👤 Profile Avatars
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
