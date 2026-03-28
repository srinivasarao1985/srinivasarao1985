import React, { useState } from 'react';
import { paymentService } from '../services';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ amount, plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await paymentService.createPaymentIntent({
        amount,
        plan,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        await paymentService.confirmPayment({
          paymentIntentId: result.paymentIntent.id,
          plan,
        });
        toast.success('Subscription activated!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <CardElement style={styles.cardElement} />
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export const SubscriptionPage = () => {
  const plans = [
    { name: 'Free', price: 0, duration: 'Lifetime' },
    { name: 'Premium', price: 9.99, duration: '1 Month' },
    { name: 'Platinum', price: 24.99, duration: '3 Months' },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Plan</h1>
      <div style={styles.plansContainer}>
        {plans.map((plan) => (
          <div key={plan.name} style={styles.planCard}>
            <h2>{plan.name}</h2>
            <p style={styles.price}>${plan.price}</p>
            <p>{plan.duration}</p>
            {plan.price > 0 ? (
              <button
                onClick={() => setSelectedPlan(plan)}
                style={styles.planButton}
              >
                Upgrade
              </button>
            ) : (
              <p style={styles.activeText}>Current Plan</p>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && selectedPlan.price > 0 && (
        <div style={styles.paymentSection}>
          <h2>Complete Payment</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={selectedPlan.price}
              plan={selectedPlan.name}
              onSuccess={() => setSelectedPlan(null)}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#e91e63',
    marginBottom: '40px',
  },
  plansContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '40px',
  },
  planCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  price: {
    fontSize: '32px',
    color: '#e91e63',
    marginBottom: '20px',
  },
  planButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  activeText: {
    color: '#666',
    marginTop: '20px',
  },
  paymentSection: {
    maxWidth: '400px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
  },
  form: {
    marginTop: '20px',
  },
  cardElement: {
    marginBottom: '20px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
