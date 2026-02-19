import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const successStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .ps-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0f1117;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  /* Blobs */
  .ps-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, #4ade8045 0%, #22c55e18 50%, transparent 70%);
    top: -180px; left: -150px;
    animation: psBlob 9s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .ps-root::after {
    content: '';
    position: fixed;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, #c8f13528 0%, #38bdf812 50%, transparent 70%);
    bottom: -120px; right: -100px;
    animation: psBlob 11s ease-in-out infinite alternate-reverse;
    pointer-events: none;
  }

  @keyframes psBlob {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(35px, 55px) scale(1.1); }
  }

  /* Card */
  .ps-card {
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    padding: 3rem 2.5rem;
    width: 100%;
    max-width: 460px;
    text-align: center;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    animation: psFadeUp 0.55s ease both;
  }

  @keyframes psFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Success icon */
  .ps-icon-wrap {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ade80, #c8f135);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 0 50px rgba(74,222,128,0.4);
    animation: psIconPop 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
    font-size: 2.2rem;
  }

  @keyframes psIconPop {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ps-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .ps-tagline {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0 0 2rem;
    line-height: 1.6;
  }

  /* Reference box */
  .ps-ref-box {
    background: rgba(74,222,128,0.07);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ps-ref-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4ade80;
  }

  .ps-ref-value {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f1f5f9;
    word-break: break-all;
  }

  /* Countdown bar */
  .ps-countdown-wrap {
    margin-bottom: 1.75rem;
  }

  .ps-countdown-text {
    font-size: 0.8rem;
    color: #475569;
    margin-bottom: 8px;
  }

  .ps-countdown-text span {
    color: #c8f135;
    font-weight: 600;
  }

  .ps-bar-track {
    height: 4px;
    background: rgba(255,255,255,0.07);
    border-radius: 999px;
    overflow: hidden;
  }

  .ps-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #c8f135);
    border-radius: 999px;
    transition: width 1s linear;
    box-shadow: 0 0 10px rgba(200,241,53,0.4);
  }

  /* CTA button */
  .ps-btn {
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
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 28px rgba(200,241,53,0.3);
  }

  .ps-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(200,241,53,0.5);
  }

  /* Confetti dots */
  .ps-confetti {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .ps-dot {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 50%;
    animation: psDotFall linear infinite;
    opacity: 0;
  }

  @keyframes psDotFall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }
`;

const DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  color: ['#c8f135','#4ade80','#38bdf8','#a78bfa','#fb923c'][i % 5],
  size: `${6 + Math.random() * 8}px`,
  duration: `${3 + Math.random() * 4}s`,
  delay: `${Math.random() * 3}s`,
}));

const REDIRECT_SECONDS = 5;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get('reference');

  useEffect(() => {
    if (document.getElementById('ps-styles')) return;
    const s = document.createElement('style');
    s.id = 'ps-styles';
    s.textContent = successStyles;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (reference) {
      toast.success(`Payment successful! Ref: ${reference}`);
    } else {
      toast.error('Payment reference not found!');
    }

    const timer = setTimeout(() => navigate('/'), REDIRECT_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [reference, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const barWidth = `${(countdown / REDIRECT_SECONDS) * 100}%`;

  return (
    <div className="ps-root">
      {/* Confetti dots */}
      <div className="ps-confetti">
        {DOTS.map(d => (
          <div
            key={d.id}
            className="ps-dot"
            style={{
              left: d.left,
              background: d.color,
              width: d.size,
              height: d.size,
              animationDuration: d.duration,
              animationDelay: d.delay,
            }}
          />
        ))}
      </div>

      <div className="ps-card">
        {/* Icon */}
        <div className="ps-icon-wrap">🎉</div>

        <h1 className="ps-title">Payment Successful!</h1>
        <p className="ps-tagline">
          Your subscription is now active. Time to get things done!
        </p>

        {/* Reference */}
        {reference && (
          <div className="ps-ref-box">
            <span className="ps-ref-label">Payment Reference</span>
            <span className="ps-ref-value">{reference}</span>
          </div>
        )}

        {/* Countdown */}
        <div className="ps-countdown-wrap">
          <p className="ps-countdown-text">
            Redirecting in <span>{countdown}s</span>…
          </p>
          <div className="ps-bar-track">
            <div className="ps-bar-fill" style={{ width: barWidth }} />
          </div>
        </div>

        {/* Manual CTA */}
        <button className="ps-btn" onClick={() => navigate('/')}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;