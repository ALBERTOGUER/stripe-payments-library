import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsProcessing(true);
        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete",
            },
        });


        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occured.");
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className='mt-5' disabled={isProcessing || !stripe || !elements}>Submit</button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
};


