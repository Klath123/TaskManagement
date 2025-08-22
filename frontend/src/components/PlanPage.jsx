import React from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';
// Sample plans data; you can add more items here
const plansData = [
  {
    name: 'Monthly Plan',
    price: '499',
    duration: '1 month',
    color: 'indigo',
    value: 'monthly',
  },
  {
    name: 'Yearly Plan',
    price: '4999',
    duration: '12 months',
    color: 'green',
    value: 'yearly',
  },
];
const checkoutHandeler = async (plan) => {
    const {data: keyData} = await paymentAPI.getKey();
    const {data: orderData} = await paymentAPI.processPayment({ amount: plan.price });
    const {key} = keyData;
    const {order} = orderData;
    console.log(orderData);
   var options = {
    "key": key, // Enter the Key ID generated from the Dashboard
    "amount": plan.price*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": orderData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": async function (response){
       const body = {
        ...response,
        plan

       }
       const {data: verificationData} = await paymentAPI.verification(body);
        if (verificationData.status === 'success') {
                    // Redirect to success page with reference
                    window.location.href = `/paymentSuccess?reference=${verificationData.reference}`;
                } else {
                    toast.error(verificationData.message);
                }
       
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
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
const PlanCard = ({ plan, onSelect }) => {
  const { name, price, duration, color, value } = plan;

  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-between w-64`}>
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{duration}</p>
      <p className="text-2xl font-semibold mb-4">{price}</p>
      <button
        onClick={() => checkoutHandeler(plan)}
        className={`px-6 py-3 w-full rounded-lg bg-${color}-600 text-white font-medium hover:bg-${color}-700 transition`}
      >
        Subscribe
      </button>
    </div>
  );
};

const PlanPage = () => {
  const { currentUser, updatePlan } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = async (plan) => {
    try {
      await updatePlan(plan); // save in DB
      toast.success(`Subscribed to ${plan} plan!`);
      navigate('/dashboard'); // redirect to dashboard
    } catch (error) {
      toast.error('Failed to subscribe');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {plansData.map((plan) => (
          <PlanCard key={plan.value} plan={plan} onSelect={handleSelectPlan} />
        ))}
      </div>
    </div>
  );
};

export default PlanPage;
