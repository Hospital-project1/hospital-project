'use client';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '@/lib/axios'; 
import Swal from 'sweetalert2';

export default function PaymentModal({ appointment, onClose, onPaymentSuccess }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => setError('Failed to load PayPal SDK');
      document.body.appendChild(script);
    } else {
      setSdkReady(true);
    }
  }, []);

  const createOrder = async () => {
    try {
      const response = await api.post('/payments/create', {
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD'
      });
      return response.data.id;
    } catch (err) {
      console.error('Create order error:', err.response?.data || err.message);
      setError('Failed to create payment order');
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!data?.orderID) {
        throw new Error('Missing PayPal order ID');
      }

      // 1. Capture payment
      const captureResponse = await api.post('/payments/capture', {
        orderID: data.orderID,
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD'
      });

      // 2. Save billing
      const billingResponse = await api.post('/billing', {
        patientId: appointment.patient,
        appointmentId: appointment._id,
        amount: appointment.amount,
        currency: 'USD',
        paymentMethod: 'paypal',
        paymentDetails: {
          orderID: data.orderID,
          ...(captureResponse.data.details || captureResponse.data)
        }
      });

      // 3. Update appointment
      try {
        await api.patch(`/appointments/${appointment._id}`, {
          paymentStatus: 'paid',
          billingId: billingResponse.data.data?._id || billingResponse.data._id,
          paymentId: data.orderID
        });
      } catch (patchError) {
        console.log('Trying POST as fallback...');
        await api.post('/appointments/update-status', {
          appointmentId: appointment._id,
          paymentStatus: 'paid',
          billingId: billingResponse.data.data?._id || billingResponse.data._id,
          paymentId: data.orderID
        });
      }

      onPaymentSuccess({
        orderID: data.orderID,
        appointmentId: appointment._id,
        billingId: billingResponse.data.data?._id || billingResponse.data._id
      });

      Swal.fire({
        title: 'Payment has been completed successfully.!',
        text: `Payment Number : ${data.orderID}`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Modification 1: Close the window after successful payment
        onClose();
      });

    } catch (error) {
      console.error('Payment processing error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setError(error.response?.data?.message || error.message || 'Payment failed');
      
      Swal.fire({
        title: 'Error in payment',
        text: error.response?.data?.message || error.message || 'Payment failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle close with overlay click prevention
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" 
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header with teal accent */}
        <div className="bg-[#0CB8B6] px-6 py-4 text-white">
          <h3 className="text-xl font-bold">Complete Your Payment</h3>
          <p className="text-white/80 text-sm">Appointment reservation fee</p>
        </div>
        
        <div className="p-6">
          {/* Appointment summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold">{appointment.amount} {appointment.currency || 'JOD'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment Type:</span>
              <span className="font-medium capitalize">{appointment.appointmentType}</span>
            </div>
          </div>
          
          {/* Modification 2: Warning message about payment */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-amber-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-amber-800 text-sm">
                An amount of 15 JOD will be deducted as a down payment.
              </p>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* PayPal buttons */}
          <div className="mb-4">
            {sdkReady ? (
              <PayPalScriptProvider 
                options={{ 
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                  currency: "USD"
                }}
              >
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    console.error('PayPal Error:', err);
                    setError(err.message || 'Payment initialization failed');
                  }}
                  disabled={isProcessing}
                  style={{ 
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay'
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-[#0CB8B6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-gray-600">Loading payment options...</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {isProcessing && (
              <div className="flex items-center text-[#0CB8B6] font-medium">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            )}
          </div>
          
          {/* Secure payment note */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment processed via PayPal
          </div>
        </div>
      </div>
    </div>
  );
}