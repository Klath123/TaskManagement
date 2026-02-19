import React, { useEffect } from 'react';
import { User, LogOut, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  .hdr-root {
    position: relative;
    z-index: 10;
    background: rgba(15, 17, 23, 0.75);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .hdr-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Logo */
  .hdr-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .hdr-logo-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #c8f135, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 18px rgba(200,241,53,0.35);
    flex-shrink: 0;
  }

  .hdr-logo-icon svg {
    width: 18px; height: 18px;
    color: #0f1117;
  }

  .hdr-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.01em;
  }

  /* Right side */
  .hdr-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  /* User pill */
  .hdr-user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 999px;
    padding: 5px 14px 5px 6px;
  }

  .hdr-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8f135, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    color: #0f1117;
    flex-shrink: 0;
  }

  .hdr-username {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: #cbd5e1;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Logout button */
  .hdr-logout {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 15px;
    border-radius: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.18);
    color: #f87171;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }

  .hdr-logout:hover {
    background: rgba(239,68,68,0.18);
    box-shadow: 0 0 18px rgba(239,68,68,0.2);
    transform: translateY(-1px);
  }

  .hdr-logout svg {
    width: 14px; height: 14px;
  }
`;

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById('header-styles')) return;
    const s = document.createElement('style');
    s.id = 'header-styles';
    s.textContent = headerStyles;
    document.head.appendChild(s);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  const initials = currentUser
    ? (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()
    : '';

  return (
    <header className="hdr-root">
      <div className="hdr-inner">
        {/* Logo */}
        <div className="hdr-logo">
          <div className="hdr-logo-icon">
            <CheckCircle />
          </div>
          <span className="hdr-logo-text">TaskFlow</span>
        </div>

        {/* Right */}
        <div className="hdr-right">
          {currentUser && (currentUser.displayName || currentUser.email) && (
            <div className="hdr-user-pill">
              <div className="hdr-avatar">{initials}</div>
              <span className="hdr-username">
                {currentUser.displayName || currentUser.email}
              </span>
            </div>
          )}

          {currentUser && (
            <button className="hdr-logout" onClick={handleLogout}>
              <LogOut />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;