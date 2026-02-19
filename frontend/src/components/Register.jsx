import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/authContext';

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .reg-root {
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

  .reg-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, #4ade8040 0%, #38bdf815 50%, transparent 70%);
    top: -180px; left: -150px;
    animation: regBlob 9s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .reg-root::after {
    content: '';
    position: fixed;
    width: 450px; height: 450px;
    border-radius: 50%;
    background: radial-gradient(circle, #c8f13525 0%, #a78bfa15 50%, transparent 70%);
    bottom: -100px; right: -80px;
    animation: regBlob 11s ease-in-out infinite alternate-reverse;
    pointer-events: none;
  }

  @keyframes regBlob {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px, 50px) scale(1.1); }
  }

  .reg-card {
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    padding: 2.5rem 2.25rem;
    width: 100%;
    max-width: 440px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    animation: regFadeUp 0.5s ease both;
  }

  @keyframes regFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  .reg-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .reg-logo-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #c8f135, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: 0 0 28px rgba(200,241,53,0.35);
  }

  .reg-logo-icon svg {
    width: 26px; height: 26px;
    color: #0f1117;
  }

  .reg-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.35rem;
  }

  .reg-subtitle {
    color: #64748b;
    font-size: 0.88rem;
  }

  /* Form */
  .reg-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .reg-field label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.45rem;
  }

  .reg-input-wrap {
    position: relative;
  }

  .reg-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    color: #475569;
    pointer-events: none;
  }

  .reg-input {
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

  .reg-input::placeholder { color: #334155; }

  .reg-input:focus {
    border-color: rgba(200,241,53,0.5);
    box-shadow: 0 0 0 3px rgba(200,241,53,0.1);
    background: rgba(255,255,255,0.07);
  }

  .reg-input.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }

  .reg-input.has-right { padding-right: 44px; }

  .reg-eye-btn {
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
  .reg-eye-btn:hover { color: #94a3b8; }
  .reg-eye-btn svg { width: 16px; height: 16px; }

  .reg-error {
    margin-top: 5px;
    font-size: 0.75rem;
    color: #f87171;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Submit */
  .reg-submit {
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

  .reg-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(200,241,53,0.55);
  }

  .reg-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading spinner */
  .reg-spinner {
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

  /* Footer link */
  .reg-footer-link {
    text-align: center;
    font-size: 0.83rem;
    color: #475569;
  }

  .reg-footer-link a {
    color: #c8f135;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .reg-footer-link a:hover { opacity: 0.8; }

  /* Divider */
  .reg-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 0.4rem 0;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById('register-styles')) return;
    const s = document.createElement('style');
    s.id = 'register-styles';
    s.textContent = registerStyles;
    document.head.appendChild(s);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.displayName);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'An account with this email already exists.';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak. Please choose a stronger password.';
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

  const fields = [
    {
      key: 'displayName',
      label: 'Display Name',
      type: 'text',
      icon: <User />,
      placeholder: 'Enter your display name',
      autoComplete: 'name',
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      icon: <Mail />,
      placeholder: 'Enter your email',
      autoComplete: 'email',
    },
    {
      key: 'password',
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      icon: <Lock />,
      placeholder: 'Enter your password',
      autoComplete: 'new-password',
      toggle: () => setShowPassword(v => !v),
      shown: showPassword,
    },
    {
      key: 'confirmPassword',
      label: 'Confirm Password',
      type: showConfirmPassword ? 'text' : 'password',
      icon: <Lock />,
      placeholder: 'Confirm your password',
      autoComplete: 'new-password',
      toggle: () => setShowConfirmPassword(v => !v),
      shown: showConfirmPassword,
    },
  ];

  return (
    <div className="reg-root">
      <div className="reg-card">
        {/* Header */}
        <div className="reg-header">
          <div className="reg-logo-icon">
            <CheckCircle />
          </div>
          <h1 className="reg-title">Create account</h1>
          <p className="reg-subtitle">Join TaskFlow and start getting things done.</p>
        </div>

        {/* Form */}
        <form className="reg-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="reg-field" key={field.key}>
              <label>{field.label}</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon">{field.icon}</span>
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={`reg-input${field.toggle ? ' has-right' : ''}${errors[field.key] ? ' error' : ''}`}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                />
                {field.toggle && (
                  <button type="button" className="reg-eye-btn" onClick={field.toggle}>
                    {field.shown ? <EyeOff /> : <Eye />}
                  </button>
                )}
              </div>
              {errors[field.key] && (
                <p className="reg-error">⚠ {errors[field.key]}</p>
              )}
            </div>
          ))}

          <button type="submit" className="reg-submit" disabled={loading}>
            {loading && <span className="reg-spinner" />}
            {loading ? 'Creating Account…' : 'Create Account →'}
          </button>

          <div className="reg-divider" />

          <p className="reg-footer-link">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;