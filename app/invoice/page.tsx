'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface OrderData {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  products: Array<{
    productId: any; // can be id string or full product object
    quantity: number;
    price: number;
    sessionName: string;
    _id: string;
  }>;
  orderId: string;
  subTotal: number;
  serviceCharge: number;
  visitingCharge: number;
  payableAmount: number;
  paymentType: string;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentData?: {
    paymentId?: string;
    orderId?: string;
    signature?: string;
    status?: string;
  };
  status: string;
  orderStatus: string;
  slot?: string | null;
  createAt: string;
}

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatRaw = (value: number) => {
    // value is stored in paisa; show full stored amount with two decimals
    return value.toFixed(2);
  };

  const formatIndian = (value: number) => {
    // value is in paisa (e.g., 51200). We want to display full stored value with Indian grouping
    const parts = value.toFixed(2).split('.');
    let integer = parts[0];
    const decimal = parts[1];
    // Insert commas in Indian format
    if (integer.length > 3) {
      const lastThree = integer.slice(-3);
      const rest = integer.slice(0, -3);
      const restWithCommas = rest.replace(/\B(?=(?:\d{2})+(?!\d))/g, ',');
      integer = restWithCommas + ',' + lastThree;
    }
    return `${integer}.${decimal}`;
  };

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      try {
        // Assuming the API endpoint to fetch order details
        const apiBaseUrl = process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || 'https://api.siama.in/api/v1/public';
        const response = await fetch(`${apiBaseUrl}/order/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderData(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error || 'Order not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Siama Beauty Care</h1>
              <p className="text-blue-100">Invoice — Order #{orderData.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Date: {new Date(orderData.createAt).toLocaleString()}</p>
              <p className="text-sm">Slot: {orderData?.slot ? new Date(orderData.slot).toLocaleString() : '—'}</p>
              <p className="text-sm">Status: <span className={`px-2 py-1 rounded text-xs font-semibold ${
                orderData.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{orderData.status}</span></p>
            </div>
          </div>
          <div className="mt-3 text-sm text-blue-100">
            <div>Address: Shop / Clinic — reach.siama@gmail.com</div>
            <div>Phone: +91-8287795045</div>
            <div>Phone: +91-9220947771</div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {orderData.customerName}</p>
              <p><strong>Email:</strong> {orderData.customerEmail}</p>
              <p><strong>Phone:</strong> {orderData.customerPhone}</p>
            </div>
            <div>
              <p><strong>Address:</strong></p>
                  <p style={{ whiteSpace: 'pre-line' }}>{orderData.customerAddress.street}</p>
                  <p>{orderData.customerAddress.city}, {orderData.customerAddress.state} {orderData.customerAddress.pincode}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.products.map((product) => {
                  const prod = product.productId && typeof product.productId === 'object' ? product.productId : null;
                  const name = prod ? prod.name : product.sessionName || (prod && prod.name) || 'Service';
                  return (
                    <tr key={product._id} className="border-t">
                      <td className="px-4 py-2">{name}</td>
                      <td className="px-4 py-2 text-center">{product.quantity}</td>
                      <td className="px-4 py-2 text-right">₹{formatIndian(product.price)} /-</td>
                      <td className="px-4 py-2 text-right">₹{formatIndian(product.price * product.quantity)} /-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
                <span>₹{formatIndian(orderData.subTotal)} /-</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge:</span>
                <span>₹{formatIndian(orderData.serviceCharge)} /-</span>
            </div>
            <div className="flex justify-between">
              <span>Visiting Charge:</span>
                <span>₹{formatIndian(orderData.visitingCharge)} /-</span>
            </div>
              {orderData.paymentData && (
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-medium">{orderData.paymentData.status || '—'}</span>
                </div>
              )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{formatIndian(orderData.payableAmount)} /-</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span>{orderData.paymentType}</span>
            </div>
            {orderData.paymentData?.paymentId && (
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="text-sm font-mono">{orderData.paymentData.paymentId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Thank you for choosing Siama Beauty Care!</p>
              <p className="text-xs text-gray-500 mt-1">For any queries, contact us at reach.siama@gmail.com</p>
            </div>
            <div className="text-right">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
              >
                Print Invoice
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}