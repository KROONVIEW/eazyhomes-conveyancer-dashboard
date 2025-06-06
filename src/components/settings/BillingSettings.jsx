import React, { useState } from 'react';
import { FiCreditCard, FiDownload, FiCheck, FiStar } from 'react-icons/fi';

const BillingSettings = () => {
  const [currentPlan] = useState({
    name: 'Professional',
    price: 'R 899',
    period: 'per month',
    features: [
      'Up to 100 active matters',
      'Unlimited client portal access',
      'Advanced reporting',
      'Priority support',
      'API access'
    ]
  });

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false
    }
  ]);

  const [invoices] = useState([
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 'R 899.00',
      status: 'Paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 'R 899.00',
      status: 'Paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 'R 899.00',
      status: 'Paid',
      downloadUrl: '#'
    }
  ]);

  const plans = [
    {
      name: 'Starter',
      price: 'R 299',
      period: 'per month',
      features: [
        'Up to 25 active matters',
        'Basic client portal',
        'Standard reporting',
        'Email support'
      ],
      current: false
    },
    {
      name: 'Professional',
      price: 'R 899',
      period: 'per month',
      features: [
        'Up to 100 active matters',
        'Unlimited client portal access',
        'Advanced reporting',
        'Priority support',
        'API access'
      ],
      current: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'R 1,999',
      period: 'per month',
      features: [
        'Unlimited active matters',
        'White-label client portal',
        'Custom reporting',
        'Dedicated support',
        'Full API access',
        'Custom integrations'
      ],
      current: false
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h2>
        <p className="text-gray-600">Manage your subscription plan, payment methods, and billing history</p>
      </div>

      <div className="space-y-8">
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiStar className="w-5 h-5 mr-2 text-blue-600" />
            Current Plan
          </h3>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{currentPlan.name}</h4>
                <p className="text-gray-600">
                  <span className="text-2xl font-bold text-blue-600">{currentPlan.price}</span>
                  <span className="text-gray-500"> {currentPlan.period}</span>
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
            
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">Plan Features:</h5>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Change Plan
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-lg border p-6 relative ${
                plan.current ? 'ring-2 ring-blue-500' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-gray-600">
                    <span className="text-2xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-500"> {plan.period}</span>
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.current 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiCreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Payment Methods
          </h3>
          
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {method.brand.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        •••• •••• •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                        {method.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Set as Default
                      </button>
                    )}
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Payment Method
          </button>
        </div>

        {/* Billing History */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <FiDownload className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings; 