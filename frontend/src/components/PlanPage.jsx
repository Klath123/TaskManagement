import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const planStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .plan-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0f1117;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .plan-root::before {
    content: '';
    position: fixed;
    width: 650px; height: 650px;
    border-radius: 50%;
    background: radial-gradient(circle, #4ade8038 0%, #38bdf812 50%, transparent 70%);
    top: -200px; left: -180px;
    animation: planBlob 9s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .plan-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, #c8f13522 0%, #a78bfa12 50%, transparent 70%);
    bottom: -120px; right: -100px;
    animation: planBlob 12s ease-in-out infinite alternate-reverse;
    pointer-events: none;
  }

  @keyframes planBlob {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px, 60px) scale(1.1); }
  }

  .plan-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    z-index: 1;
    animation: planFadeUp 0.5s ease both;
  }

  .plan-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(200,241,53,0.1);
    border: 1px solid rgba(200,241,53,0.28);
    color: #c8f135;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 1.2rem;
  }

  .plan-chip-dot {
    width: 6px; height: 6px;
    background: #c8f135;
    border-radius: 50%;
    animation: chipPulse 2s ease infinite;
  }

  @keyframes chipPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(1.5); }
  }

  .plan-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.6rem;
    line-height: 1.1;
  }

  .plan-title .accent {
    background: linear-gradient(90deg, #c8f135, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .plan-subtitle {
    color: #64748b;
    font-size: 0.95rem;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Cards grid */
  .plan-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  /* Individual card */
  .plan-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 2rem 1.75rem;
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    position: relative;
    overflow: hidden;
    animation: planFadeUp 0.5s ease both;
  }

  .plan-card:hover {
    transform: translateY(-6px);
  }

  /* Monthly */
  .plan-card.monthly:hover {
    border-color: rgba(56,189,248,0.35);
    box-shadow: 0 0 50px rgba(56,189,248,0.12);
  }

  /* Yearly — popular */
  .plan-card.yearly {
    border-color: rgba(200,241,53,0.22);
    box-shadow: 0 0 40px rgba(200,241,53,0.08);
    animation-delay: 0.1s;
  }

  .plan-card.yearly:hover {
    border-color: rgba(200,241,53,0.45);
    box-shadow: 0 0 60px rgba(200,241,53,0.18);
  }

  /* Popular badge */
  .plan-popular-badge {
    position: absolute;
    top: 16px; right: 16px;
    background: linear-gradient(135deg, #c8f135, #86efac);
    color: #0f1117;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 3px 10px;
    border-radius: 999px;
  }

  /* Icon circle */
  .plan-icon {
    width: 52px; height: 52px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }

  .plan-icon.monthly {
    background: rgba(56,189,248,0.12);
    box-shadow: 0 0 20px rgba(56,189,248,0.15);
  }

  .plan-icon.yearly {
    background: rgba(200,241,53,0.12);
    box-shadow: 0 0 20px rgba(200,241,53,0.15);
  }

  .plan-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.3rem;
  }

  .plan-duration {
    font-size: 0.8rem;
    color: #475569;
    margin: 0 0 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .plan-price-wrap {
    margin-bottom: 1.75rem;
  }

  .plan-currency {
    font-size: 1rem;
    font-weight: 600;
    color: #94a3b8;
    vertical-align: top;
    line-height: 2.2;
  }

  .plan-price {
    font-family: 'Syne', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }

  .plan-per {
    font-size: 0.8rem;
    color: #475569;
    margin-top: 4px;
  }

  /* Perks list */
  .plan-perks {
    list-style: none;
    padding: 0; margin: 0 0 1.75rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  .plan-perk {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.83rem;
    color: #94a3b8;
  }

  .plan-perk-dot {
    width: 16px; height: 16px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem;
    flex-shrink: 0;
  }

  .plan-perk-dot.monthly { background: rgba(56,189,248,0.15); color: #38bdf8; }
  .plan-perk-dot.yearly  { background: rgba(200,241,53,0.15); color: #c8f135; }

  /* Buttons */
  .plan-btn {
    width: 100%;
    padding: 13px;
    border-radius: 13px;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .plan-btn.monthly {
    background: rgba(56,189,248,0.12);
    border: 1px solid rgba(56,189,248,0.3);
    color: #38bdf8;
  }

  .plan-btn.monthly:hover {
    background: rgba(56,189,248,0.22);
    box-shadow: 0 0 30px rgba(56,189,248,0.2);
    transform: translateY(-2px);
  }

  .plan-btn.yearly {
    background: #c8f135;
    color: #0f1117;
    box-shadow: 0 0 28px rgba(200,241,53,0.35);
  }

  .plan-btn.yearly:hover {
    box-shadow: 0 0 50px rgba(200,241,53,0.55);
    transform: translateY(-2px);
  }

  @keyframes planFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const plansData = [
  {
    name: 'Monthly Plan',
    price: '499',
    duration: '1 month',
    value: 'monthly',
    emoji: '⚡',
    perks: ['Full task management', 'Priority support', 'Up to 100 tasks', 'Cancel anytime'],
  },
  {
    name: 'Yearly Plan',
    price: '4999',
    duration: '12 months',
    value: 'yearly',
    emoji: '🚀',
    popular: true,
    perks: ['Everything in Monthly', 'Unlimited tasks', 'Advanced analytics', '2 months free'],
  },
];

const checkoutHandeler = async (plan) => {
  const { data: keyData } = await paymentAPI.getKey();
  const { data: orderData } = await paymentAPI.processPayment({ amount: plan.price });
  const { key } = keyData;

  const options = {
    key,
    amount: plan.price * 100,
    currency: 'INR',
    name: 'Acme Corp',
    description: 'Test Transaction',
    image: 'https://example.com/your_logo',
    order_id: orderData.id,
    handler: async function (response) {
      const body = { ...response, plan };
      const { data: verificationData } = await paymentAPI.verification(body);
      if (verificationData.status === 'success') {
        window.location.href = `/paymentSuccess?reference=${verificationData.reference}`;
      } else {
        toast.error(verificationData.message);
      }
    },
    prefill: {
      name: 'Gaurav Kumar',
      email: 'gaurav.kumar@example.com',
      contact: '9000090000',
    },
    notes: { address: 'Razorpay Corporate Office' },
    theme: { color: '#c8f135' },
  };

  const rzp1 = new Razorpay(options);
  rzp1.on('payment.failed', function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
  rzp1.open();
};

const PlanCard = ({ plan }) => {
  const { name, price, duration, value, emoji, popular, perks } = plan;

  return (
    <div className={`plan-card ${value}`}>
      {popular && <span className="plan-popular-badge">Most Popular</span>}

      <div className={`plan-icon ${value}`}>{emoji}</div>

      <h2 className="plan-name">{name}</h2>
      <p className="plan-duration">{duration}</p>

      <div className="plan-price-wrap">
        <span className="plan-currency">₹</span>
        <span className="plan-price">{price}</span>
        <p className="plan-per">per {duration}</p>
      </div>

      <ul className="plan-perks">
        {perks.map((perk) => (
          <li className="plan-perk" key={perk}>
            <span className={`plan-perk-dot ${value}`}>✓</span>
            {perk}
          </li>
        ))}
      </ul>

      <button className={`plan-btn ${value}`} onClick={() => checkoutHandeler(plan)}>
        Get {name.split(' ')[0]} →
      </button>
    </div>
  );
};

const PlanPage = () => {
  const { currentUser, updatePlan } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById('plan-styles')) return;
    const s = document.createElement('style');
    s.id = 'plan-styles';
    s.textContent = planStyles;
    document.head.appendChild(s);
  }, []);

  const handleSelectPlan = async (plan) => {
    try {
      await updatePlan(plan);
      toast.success(`Subscribed to ${plan} plan!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to subscribe');
      console.error(error);
    }
  };

  return (
    <div className="plan-root">
      <div className="plan-header">
        <div className="plan-chip">
          <span className="plan-chip-dot" />
          Simple, transparent pricing
        </div>
        <h1 className="plan-title">
          Pick your <span className="accent">plan</span>
        </h1>
        <p className="plan-subtitle">
          Start organizing your tasks today. Upgrade or cancel at any time.
        </p>
      </div>

      <div className="plan-grid">
        {plansData.map((plan) => (
          <PlanCard key={plan.value} plan={plan} onSelect={handleSelectPlan} />
        ))}
      </div>
    </div>
  );
};

export default PlanPage;