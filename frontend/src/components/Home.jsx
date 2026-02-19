import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../contexts/authContext";

/* ── Inline styles & keyframes injected once ── */
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  :root {
    --lime: #c8f135;
    --sky:  #38bdf8;
    --ink:  #0f1117;
    --card: #ffffff;
  }

  .home-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* animated gradient blob */
  .home-root::before {
    content: '';
    position: fixed;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, #4ade8055 0%, #38bdf820 50%, transparent 70%);
    top: -200px; left: -150px;
    animation: blobFloat 8s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  .home-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, #c8f13530 0%, #fbbf2415 50%, transparent 70%);
    bottom: -100px; right: -100px;
    animation: blobFloat 10s ease-in-out infinite alternate-reverse;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes blobFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px, 60px) scale(1.1); }
  }

  .home-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
    position: relative;
    z-index: 1;
  }

  /* Chip badge */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(200,241,53,0.12);
    border: 1px solid rgba(200,241,53,0.3);
    color: var(--lime);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.5s ease both;
  }

  .chip-dot {
    width: 7px; height: 7px;
    background: var(--lime);
    border-radius: 50%;
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(1.4); }
  }

  /* Headings */
  .home-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 6vw, 4rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    margin: 0 0 1rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .home-h1 .accent {
    background: linear-gradient(90deg, var(--lime), var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .home-sub {
    color: #94a3b8;
    font-size: 1.05rem;
    max-width: 480px;
    line-height: 1.7;
    margin: 0 0 2.5rem;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  /* Buttons */
  .btn-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .btn-primary {
    padding: 14px 30px;
    border-radius: 14px;
    background: var(--lime);
    color: var(--ink);
    font-weight: 700;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 30px rgba(200,241,53,0.35);
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 50px rgba(200,241,53,0.55);
  }

  .btn-secondary {
    padding: 14px 30px;
    border-radius: 14px;
    background: rgba(255,255,255,0.06);
    color: #e2e8f0;
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    text-decoration: none;
    display: inline-block;
    backdrop-filter: blur(8px);
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.12);
    transform: translateY(-3px);
  }

  .btn-green {
    padding: 14px 32px;
    border-radius: 14px;
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: #052e16;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 35px rgba(74,222,128,0.3);
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .btn-green:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 55px rgba(74,222,128,0.5);
  }

  /* User card */
  .user-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 2.5rem 3rem;
    backdrop-filter: blur(16px);
    max-width: 440px;
    width: 100%;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--lime), var(--sky));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--ink);
    margin: 0 auto 1.2rem;
  }

  .plan-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .plan-badge.inactive {
    background: rgba(251,191,36,0.15);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.3);
  }
  .plan-badge.active {
    background: rgba(74,222,128,0.15);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.3);
  }

  /* Footer */
  .home-footer {
    position: relative; z-index: 1;
    padding: 1.2rem;
    text-align: center;
    font-size: 0.8rem;
    color: #475569;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  /* Feature pills row */
  .feature-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 2.5rem;
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .feature-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 999px;
    padding: 7px 16px;
    font-size: 0.78rem;
    color: #94a3b8;
    display: flex; align-items: center; gap: 6px;
  }
  .feature-pill span { color: var(--lime); font-size: 0.9rem; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById("home-styles")) return;
    const s = document.createElement("style");
    s.id = "home-styles";
    s.textContent = styleTag;
    document.head.appendChild(s);
  }, []);

  const handleGoToApp = () => {
    if (!currentUser.plan || currentUser.plan.status !== "active") {
      navigate("/plans");
    } else {
      navigate("/dashboard");
    }
  };

  const isActive = currentUser?.plan?.status === "active";
  const initials = currentUser
    ? (currentUser.displayName || currentUser.email || "U")[0].toUpperCase()
    : "";

  return (
    <div className="home-root">
      <Header />

      <main className="home-main">
        {!currentUser ? (
          <>
            <div className="chip">
              <span className="chip-dot" />
              Task Management, Reimagined
            </div>

            <h1 className="home-h1">
              Get things done.<br />
              <span className="accent">Stay in flow.</span>
            </h1>

            <p className="home-sub">
              Organize your tasks, stay productive, and achieve your goals —
              beautifully and effortlessly.
            </p>

            <div className="btn-row">
              <Link to="/login" className="btn-primary">
                Login →
              </Link>
              <Link to="/register" className="btn-secondary">
                Create account
              </Link>
            </div>

            <div className="feature-row">
              {[
                ["⚡", "Lightning fast"],
                ["🎯", "Goal tracking"],
                ["🔒", "Secure & private"],
                ["📱", "Works everywhere"],
              ].map(([icon, label]) => (
                <div className="feature-pill" key={label}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="user-card">
            <div className="avatar">{initials}</div>

            <h1 className="home-h1" style={{ fontSize: "1.7rem", marginBottom: "0.4rem" }}>
              Hey, {currentUser.displayName || currentUser.email?.split("@")[0]}! 👋
            </h1>

            <div className={`plan-badge ${isActive ? "active" : "inactive"}`}>
              {isActive ? "✓ Active plan" : "⚠ No active plan"}
            </div>

            <p className="home-sub" style={{ fontSize: "0.9rem", marginBottom: "1.8rem" }}>
              {!isActive
                ? "Subscribe to a plan to unlock task management features."
                : "Your workspace is ready. Let's get productive!"}
            </p>

            <button onClick={handleGoToApp} className="btn-green">
              {!isActive ? "Choose a Plan →" : "Open Dashboard →"}
            </button>
          </div>
        )}
      </main>

      <footer className="home-footer">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;