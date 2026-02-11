import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // هنا هتحط كود الـ Fetch للباك إند اللي عملناه
    console.log("تسجيل دخول يا سمسم...", { email, password });
  };

  return (
    <div className="signin-container d-flex align-items-center justify-content-center">
      <div className="signin-card p-4 shadow-lg">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-gradient">Welcome Back</h2>
          <p className="text-muted"> DashBoard </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">email</label>
            <input 
              type="email" 
              className="form-control custom-input" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">password</label>
            <input 
              type="password" 
              className="form-control custom-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            Sign in 
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;