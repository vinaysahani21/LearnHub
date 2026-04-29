import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/api';

// --- HELPER TO LOAD SCRIPT MANUALLY ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const EnrollButton = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 1. FREE ENROLL
  const handleFreeEnroll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await api.post(`/courses/${course._id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Enrolled Successfully!");
      navigate('/student/my-learning');
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. RAZORPAY PAYMENT
  const handlePayment = async () => {
    try {
      setLoading(true);

      // A. Load Razorpay Script Manually
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // B. Create Order
      const orderRes = await api.post('/payment/create-order', 
        { courseId: course._id, amount: course.price }, 
        config
      );

      const { id: order_id, amount, currency, key_id } = orderRes.data;

      // C. Open Razorpay Popup
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "LearnHub",
        description: `Enrollment for ${course.title}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id
            }, config);

            alert("Payment Successful! Welcome to the course.");
            navigate('/student/my-learning');
          } catch (error) {
            console.error(error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4F46E5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  if (course.price === 0) {
    return (
      <button 
        onClick={handleFreeEnroll}
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <BookOpen size={20} />}
        Enroll for Free
      </button>
    );
  }

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
      Buy Now for ₹{course.price}
    </button>
  );
};

export default EnrollButton;