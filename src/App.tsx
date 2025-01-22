import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from './components';
import { useState, useEffect } from 'react';

import { Modal } from 'react-pattern-components';

import './App.css'

const stripePromise = loadStripe('pk_test_51Qhxu2G37qnfZN0TT19FhJYVRpw3TPblCoeLV3gxfBVqaN80eMd0KXSXnTFpuWcQjoZxqmZiiQpY4mn8o4czchWm00558MLqhf');

function App() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:5252/config").then(async (r) => {
      const { publishableKey } = await r.json();
      console.log(publishableKey)
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5252/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();

      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>

      {clientSecret && stripePromise && (
        <Modal isOpen={true} tittle={"Payment"}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </Modal>
      )}
    </>
  )
}

export default App
