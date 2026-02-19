import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/authContext';

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .login-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0f1117;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, #38bdf840 0%, #4ade8015 50%, transparent 70%);
    top: -180px; right: -150px;
    animation: loginBlob 9s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: fixed;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, #c8f13522 0%, #a78bfa12 50%, transparent 70%);
    bottom: -120px; left: -100px;
    animation: loginBlob 12s ease-in-out infinite alternate-reverse;
    pointer-events: none;
  }

  @keyframes loginBlob {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(35px, 50px) scale(1.1); }
  }

  .login-card {
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    padding: 2.5rem 2.25rem;
    width: 100%;
    max-width: 420px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    animation: loginFadeUp 0.5s ease both;
  }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #c8f135, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: 0 0 28px rgba(200,241,53,0.35);
  }

  .login-logo-icon svg {
    width: 26px; height: 26px;
    color: #0f1117;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.35rem;
  }

  .login-subtitle {
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  /* Form */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .login-field label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.45rem;
  }

  .login-input-wrap {
    position: relative;
  }

  .login-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    color: #475569;
    pointer-events: none;
  }

  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 14px 12px 42px;
    color: #f1f5f9;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .login-input::placeholder { color: #334155; }

  .login-input:focus {
    border-color: rgba(200,241,53,0.5);
    box-shadow: 0 0 0 3px rgba(200,241,53,0.1);
    background: rgba(255,255,255,0.07);
  }

  .login-input.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }

  .login-input.has-right { padding-right: 44px; }

  .login-eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #475569;
    display: flex; align-items: center;
    padding: 0;
    transition: color 0.15s;
  }

  .login-eye-btn:hover { color: #94a3b8; }
  .login-eye-btn svg { width: 16px; height: 16px; }

  .login-error {
    margin-top: 5px;
    font-size: 0.75rem;
    color: #f87171;
  }

  /* Submit */
  .login-submit {
    margin-top: 0.5rem;
    width: 100%;
    padding: 13px;
    border-radius: 13px;
    background: #c8f135;
    color: #0f1117;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 0 30px rgba(200,241,53,0.35);
  }

  .login-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(200,241,53,0.55);
  }

  .login-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Spinner */
  .login-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(15,17,23,0.3);
    border-top-color: #0f1117;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .login-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 0.4rem 0;
  }

  /* Footer link */
  .login-footer-link {
    text-align: center;
    font-size: 0.83rem;
    color: #475569;
  }

  .login-footer-link a {
    color: #c8f135;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .login-footer-link a:hover { opacity: 0.8; }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById('login-styles')) return;
    const s = document.createElement('style');
    s.id = 'login-styles';
    s.textContent = loginStyles;
    document.head.appendChild(s);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') errorMessage = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-icon">
            <CheckCircle />
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your TaskFlow account.</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Mail /></span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`login-input${errors.email ? ' error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="login-error">⚠ {errors.email}</p>}
          </div>

          {/* Password */}
          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Lock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`login-input has-right${errors.password ? ' error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="login-error">⚠ {errors.password}</p>}
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading && <span className="login-spinner" />}
            {loading ? 'Signing In…' : 'Sign In →'}
          </button>

          <div className="login-divider" />

          <p className="login-footer-link">
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;