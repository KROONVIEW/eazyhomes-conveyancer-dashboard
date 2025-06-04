import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { TrashIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const InvoicePage = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceId: `#EZINV${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().substring(0, 10),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    transferMatter: '',
    items: [
      { id: 1, description: 'Conveyancing Fee (Standard)', rate: 15000, qty: 1, amount: 15000 },
      { id: 2, description: 'Deeds Office Lodgement Fees', rate: 1200, qty: 1, amount: 1200 },
      { id: 3, description: 'Disbursements (Estimated)', rate: 500, qty: 1, amount: 500 },
    ],
    discount: 0,
    notes: 'Thank you for your business. Please make payment to the account details below by the due date.',
    bankAccount: 'Bank Name: EasyBank, Account No: 1234567890, Branch Code: 987654',
  });

  const calculateTotal = () => {
    const subtotal = invoiceDetails.items.reduce((sum, item) => sum + item.rate * item.qty, 0);
    return subtotal - (parseFloat(invoiceDetails.discount) || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              amount: (field === 'rate' || field === 'qty') ? (parseFloat(item.rate) || 0) * (parseFloat(item.qty) || 0) : item.amount
            }
          : item
      )
    }));
  };

  const addItem = () => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: '', rate: 0, qty: 1, amount: 0 }]
    }));
  };

  const removeItem = (id) => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleCreateInvoice = () => {
    console.log("Invoice to be created:", invoiceDetails);
    alert("Invoice creation initiated! (Check console for dummy data)");
  };

  return (
    <div className='flex-1 p-6 md:p-8 bg-gray-50 overflow-auto h-screen'>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md">
            <ArrowDownTrayIcon className="h-5 w-5"/>
            <span>Generate PDF</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="Invoice Details" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-600">Invoice ID</label>
              <input type="text" id="invoiceId" name="invoiceId" value={invoiceDetails.invoiceId} readOnly
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-gray-50 cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-600">Date</label>
              <input type="date" id="date" name="date" value={invoiceDetails.date} onChange={handleChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="transferMatter" className="block text-sm font-medium text-gray-600">Linked Conveyancing Matter</label>
              <select id="transferMatter" name="transferMatter" value={invoiceDetails.transferMatter} onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-white">
                <option value="">Select a Transfer/Matter (e.g., 12 Oak Ave, T#1234)</option>
                <option value="Matter #EZT1001 - 123 Main St, Pretoria (Client: A. Smith)">Matter #EZT1001 - 123 Main St, Pretoria (Client: A. Smith)</option>
                <option value="Matter #EZT1002 - 456 Elm St, Johannesburg (Client: B. Jones)">Matter #EZT1002 - 456 Elm St, Johannesburg (Client: B. Jones)</option>
              </select>
            </div>
          </div>
          <h4 className="text-md font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Client Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-600">Client Name</label>
              <input type="text" id="clientName" name="clientName" value={invoiceDetails.clientName} onChange={handleChange}
                     placeholder="e.g., Sarah Johnson" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" />
            </div>
            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-600">Client Email</label>
              <input type="email" id="clientEmail" name="clientEmail" value={invoiceDetails.clientEmail} onChange={handleChange}
                     placeholder="sarah.j@example.com" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-600">Client Address</label>
              <input type="text" id="clientAddress" name="clientAddress" value={invoiceDetails.clientAddress} onChange={handleChange}
                     placeholder="Unit/Street, City, Postal Code" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" />
            </div>
          </div>
          <h4 className="text-md font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Invoice Items</h4>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (R)</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (R)</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {invoiceDetails.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">
                      <input type="text" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                             className="w-full border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" placeholder="e.g., Conveyancing fee" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                             className="w-24 text-right border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                             className="w-16 text-right border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" />
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-gray-800 font-medium">
                      R{(parseFloat(item.rate) * parseFloat(item.qty)).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addItem} className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-6">
            <PlusIcon className="h-4 w-4 mr-1" /> Add New Item
          </button>
          <div className="flex justify-end items-center mb-6">
            <label htmlFor="discount" className="text-sm font-medium text-gray-600 mr-2">Discount (R)</label>
            <input type="number" id="discount" name="discount" value={invoiceDetails.discount} onChange={handleChange}
                   className="w-32 border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 text-right" />
          </div>
          <h4 className="text-md font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Additional Information</h4>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-600">Notes / Terms</label>
            <textarea id="notes" name="notes" value={invoiceDetails.notes} onChange={handleChange} rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" placeholder="e.g., Payment due in 30 days."></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-600">Bank Account Details</label>
            <textarea id="bankAccount" name="bankAccount" value={invoiceDetails.bankAccount} onChange={handleChange} rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700" placeholder="Bank Name, Account Number, etc."></textarea>
          </div>
          <div className="mt-auto flex justify-end space-x-4">
            <button
              onClick={() => alert("Invoice draft saved!")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleCreateInvoice}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Create & Send Invoice
            </button>
          </div>
        </DashboardCard>
        <DashboardCard title="Invoice Preview" className="lg:col-span-1 flex flex-col">
          <div className="flex-grow p-6 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-blue-700">EASYHOMES CONVEYANCERS</h2>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-800">INVOICE</h3>
                <p className="text-sm text-gray-600">No: {invoiceDetails.invoiceId}</p>
                <p className="text-sm text-gray-600">Date: {invoiceDetails.date}</p>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">BILL TO:</h3>
              <p className="text-md font-semibold text-gray-800 mb-1">{invoiceDetails.clientName || '--- Client Name ---'}</p>
              <p className="text-sm text-gray-600">{invoiceDetails.clientAddress || '--- Client Address ---'}</p>
              <p className="text-sm text-gray-600">{invoiceDetails.clientEmail || '--- Client Email ---'}</p>
              {invoiceDetails.transferMatter && (
                <p className="text-sm text-blue-600 mt-2">**Regarding Matter:** {invoiceDetails.transferMatter}</p>
              )}
            </div>
            <table className="min-w-full mb-8 border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase">DESCRIPTION</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700 uppercase">QTY</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700 uppercase">RATE (R)</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700 uppercase">AMOUNT (R)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-sm text-gray-800">{item.description || 'N/A'}</td>
                    <td className="py-2 px-3 text-right text-sm text-gray-800">{item.qty}</td>
                    <td className="py-2 px-3 text-right text-sm text-gray-800">R{item.rate.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-sm text-gray-800 font-medium">R{(parseFloat(item.rate) * parseFloat(item.qty)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mb-6">
              <div className="w-full sm:w-1/2 lg:w-3/4">
                <div className="flex justify-between py-1 text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>R{invoiceDetails.items.reduce((sum, item) => sum + parseFloat(item.rate) * parseFloat(item.qty), 0).toFixed(2)}</span>
                </div>
                {invoiceDetails.discount > 0 && (
                  <div className="flex justify-between py-1 text-sm text-gray-700">
                    <span>Discount</span>
                    <span>-R{parseFloat(invoiceDetails.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-lg font-bold text-gray-800 border-t-2 border-gray-400 mt-2">
                  <span>TOTAL DUE</span>
                  <span>R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{invoiceDetails.notes || 'No notes provided.'}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Account Details:</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{invoiceDetails.bankAccount || 'No bank details provided.'}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default InvoicePage; 