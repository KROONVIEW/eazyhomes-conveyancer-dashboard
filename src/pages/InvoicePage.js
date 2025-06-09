import React, { Component } from 'react';
import DashboardCard from '../components/DashboardCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowDownTrayIcon, 
  DocumentDuplicateIcon,
  EyeIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

class InvoicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceDetails: {
        invoiceId: `#EZINV${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().substring(0, 10),
        dueDate: this.calculateDueDate(30), // 30 days from now
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
        vatRate: 15, // 15% VAT
        includeVat: true,
        notes: 'Thank you for your business. Please make payment to the account details below by the due date.',
        bankAccount: 'Bank Name: EasyBank, Account No: 1234567890, Branch Code: 987654',
        status: 'draft', // draft, sent, paid, overdue
        paymentTerms: 30
      },
      isLoading: false,
      errors: {},
      savedDrafts: [],
      validationErrors: []
    };
  }

  // Utility method to calculate due date
  calculateDueDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().substring(0, 10);
  };

  // Calculate subtotal
  calculateSubtotal = () => {
    return this.state.invoiceDetails.items.reduce((sum, item) => 
      sum + (parseFloat(item.rate) || 0) * (parseFloat(item.qty) || 0), 0
    );
  };

  // Calculate VAT amount
  calculateVAT = () => {
    if (!this.state.invoiceDetails.includeVat) return 0;
    const subtotal = this.calculateSubtotal() - (parseFloat(this.state.invoiceDetails.discount) || 0);
    return subtotal * (this.state.invoiceDetails.vatRate / 100);
  };

  // Calculate total including VAT
  calculateTotal = () => {
    const subtotal = this.calculateSubtotal();
    const discount = parseFloat(this.state.invoiceDetails.discount) || 0;
    const vat = this.calculateVAT();
    return subtotal - discount + vat;
  };

  // Format numbers with South African thousand separators (spaces)
  formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Format numbers for input display (without decimals if whole number)
  formatNumberForInput = (amount) => {
    const num = parseFloat(amount) || 0;
    if (num % 1 === 0) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Parse formatted number back to regular number for calculations
  parseFormattedNumber = (formattedNumber) => {
    return parseFloat(formattedNumber.toString().replace(/\s/g, '')) || 0;
  };

  // Validate invoice data
  validateInvoice = () => {
    const errors = [];
    const { invoiceDetails } = this.state;

    if (!invoiceDetails.clientName.trim()) {
      errors.push('Client name is required');
    }
    if (!invoiceDetails.clientEmail.trim()) {
      errors.push('Client email is required');
    }
    if (!invoiceDetails.clientAddress.trim()) {
      errors.push('Client address is required');
    }
    if (invoiceDetails.items.length === 0) {
      errors.push('At least one invoice item is required');
    }
    if (invoiceDetails.items.some(item =>  !item.description.trim())) {
      errors.push('All items must have descriptions');
    }
    if (invoiceDetails.items.some(item =>  parseFloat(item.rate) <= 0)) {
      errors.push('All items must have valid rates');
    }

    this.setState({ validationErrors: errors });
    return errors.length === 0;
  };

  // Handle input changes
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        [name]: type === 'checkbox' ? checked : value,
        ...(name === 'paymentTerms' && { dueDate: this.calculateDueDate(parseInt(value) || 30) })
      }
    }));
  };

  // Handle item changes
  handleItemChange = (id, field, value) => {
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        items: prevState.invoiceDetails.items.map(item =>  {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'rate' || field === 'qty') {
              updatedItem.amount = (parseFloat(updatedItem.rate) || 0) * (parseFloat(updatedItem.qty) || 0);
            }
            return updatedItem;
          }
          return item;
        })
      }
    }));
  };

  // Add new item
  addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      rate: 0,
      qty: 1,
      amount: 0
    };
    
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        items: [...prevState.invoiceDetails.items, newItem]
      }
    }));
  };

  // Remove item
  removeItem = (id) => {
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        items: prevState.invoiceDetails.items.filter(item =>  item.id !== id)
      }
    }));
  };

  // Save draft functionality
  saveDraft = async () => {
    this.setState({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve =>  setTimeout(resolve, 1000));
      
      const draft = {
        ...this.state.invoiceDetails,
        savedAt: new Date().toISOString(),
        id: Date.now()
      };
      
      this.setState(prevState =>  ({
        savedDrafts: [...prevState.savedDrafts, draft],
        isLoading: false
      }));
      
      this.showNotification('Draft saved successfully!', 'success');
    } catch (error) {
      this.setState({ isLoading: false });
      this.showNotification('Failed to save draft', 'error');
    }
  };

  // Generate PDF functionality
  generatePDF = async () => {
    if (!this.validateInvoice()) {
      this.showNotification('Please fix validation errors before generating PDF', 'error');
      return;
    }

    this.setState({ isLoading: true });
    
    try {
      // Find the invoice preview element
      const invoicePreview = document.querySelector('.invoice-preview-content');
      if (!invoicePreview) {
        throw new Error('Invoice preview not found');
      }

      // Generate canvas from the invoice preview
      const canvas = await html2canvas(invoicePreview, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${this.state.invoiceDetails.invoiceId.replace('#', '')}_Invoice.pdf`;
      pdf.save(fileName);
      
      this.setState({ isLoading: false });
      this.showNotification('PDF generated and downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      this.setState({ isLoading: false });
      this.showNotification('Failed to generate PDF. Please try again.', 'error');
    }
  };

  // Create and send invoice
  createAndSendInvoice = async () => {
    if (!this.validateInvoice()) {
      this.showNotification('Please fix validation errors before sending invoice', 'error');
      return;
    }

    this.setState({ isLoading: true });
    
    try {
      // Simulate API call to create and send invoice
      await new Promise(resolve =>  setTimeout(resolve, 1500));
      
      this.setState(prevState =>  ({
        invoiceDetails: {
          ...prevState.invoiceDetails,
          status: 'sent',
          sentAt: new Date().toISOString()
        },
        isLoading: false
      }));
      
      this.showNotification('Invoice created and sent successfully!', 'success');
    } catch (error) {
      this.setState({ isLoading: false });
      this.showNotification('Failed to send invoice', 'error');
    }
  };



  // Duplicate invoice
  duplicateInvoice = () => {
    const newInvoiceId = `#EZINV${Math.floor(Math.random() * 10000)}`;
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        invoiceId: newInvoiceId,
        date: new Date().toISOString().substring(0, 10),
        dueDate: this.calculateDueDate(prevState.invoiceDetails.paymentTerms),
        status: 'draft'
      }
    }));
    this.showNotification('Invoice duplicated successfully!', 'success');
  };

  // Show notification
  showNotification = (message, type) => {
    // In a real app, this would use a toast notification system
    const icon = type === 'success' ? '✅' : '❌';
    alert(`${icon} ${message}`);
  };

  // Auto-populate client details from selected matter
  handleMatterChange = (e) => {
    const selectedMatter = e.target.value;
    this.setState(prevState =>  ({
      invoiceDetails: {
        ...prevState.invoiceDetails,
        transferMatter: selectedMatter
      }
    }));

    // Auto-populate client details based on selected matter
    if (selectedMatter.includes('A. Smith')) {
      this.setState(prevState =>  ({
        invoiceDetails: {
          ...prevState.invoiceDetails,
          clientName: 'Andrew Smith',
          clientEmail: 'andrew.smith@email.com',
          clientAddress: '123 Main St, Pretoria, 0001'
        }
      }));
    } else if (selectedMatter.includes('B. Jones')) {
      this.setState(prevState =>  ({
        invoiceDetails: {
          ...prevState.invoiceDetails,
          clientName: 'Barbara Jones',
          clientEmail: 'barbara.jones@email.com',
          clientAddress: '456 Elm St, Johannesburg, 2000'
        }
      }));
    }
  };

  render() {
    const { invoiceDetails, isLoading, validationErrors } = this.state;

    return (
      <div className='flex-1 p-6 md:p-8 bg-gray-50 overflow-auto h-screen'>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className={`font-medium ${
                invoiceDetails.status === 'draft' ? 'text-yellow-600' :
                invoiceDetails.status === 'sent' ? 'text-blue-600' :
                invoiceDetails.status === 'paid' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {invoiceDetails.status.charAt(0).toUpperCase() + invoiceDetails.status.slice(1)}
              </span>
            </p>
          </div>
          <div className="flex space-x-3">

            <button 
              onClick={this.duplicateInvoice}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors shadow-md"
            >
              <DocumentDuplicateIcon className="h-5 w-5"/>
              <span>Duplicate</span>
            </button>
            <button 
              onClick={this.generatePDF}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-5 w-5"/>
              <span>{isLoading ? 'Generating...' : 'Generate PDF'}</span>
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Details Form */}
          <DashboardCard title="Invoice Details" className="h-fit">
            {/* Basic Invoice Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-600">Invoice ID</label>
                <input 
                  type="text" 
                  id="invoiceId" 
                  name="invoiceId" 
                  value={invoiceDetails.invoiceId} 
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-gray-50 cursor-not-allowed" 
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-600">Invoice Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={invoiceDetails.date} 
                  onChange={this.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-600">Payment Terms (Days)</label>
                <select 
                  id="paymentTerms" 
                  name="paymentTerms" 
                  value={invoiceDetails.paymentTerms} 
                  onChange={this.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600">Due Date</label>
                <input 
                  type="date" 
                  id="dueDate" 
                  name="dueDate" 
                  value={invoiceDetails.dueDate} 
                  onChange={this.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="transferMatter" className="block text-sm font-medium text-gray-600">Linked Conveyancing Matter</label>
                <select 
                  id="transferMatter" 
                  name="transferMatter" 
                  value={invoiceDetails.transferMatter} 
                  onChange={this.handleMatterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Transfer/Matter (e.g., 12 Oak Ave, T#1234)</option>
                  <option value="Matter #EZT1001 - 123 Main St, Pretoria (Client: A. Smith)">Matter #EZT1001 - 123 Main St, Pretoria (Client: A. Smith)</option>
                  <option value="Matter #EZT1002 - 456 Elm St, Johannesburg (Client: B. Jones)">Matter #EZT1002 - 456 Elm St, Johannesburg (Client: B. Jones)</option>
                </select>
              </div>
            </div>

            {/* Client Details */}
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Client Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-600">Client Name *</label>
                <input 
                  type="text" 
                  id="clientName" 
                  name="clientName" 
                  value={invoiceDetails.clientName} 
                  onChange={this.handleChange}
                  placeholder="e.g., Sarah Johnson" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-600">Client Email *</label>
                <input 
                  type="email" 
                  id="clientEmail" 
                  name="clientEmail" 
                  value={invoiceDetails.clientEmail} 
                  onChange={this.handleChange}
                  placeholder="sarah.j@example.com" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-600">Client Address *</label>
                <input 
                  type="text" 
                  id="clientAddress" 
                  name="clientAddress" 
                  value={invoiceDetails.clientAddress} 
                  onChange={this.handleChange}
                  placeholder="Unit/Street, City, Postal Code" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            {/* Invoice Items */}
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
                        <input 
                          type="text" 
                          value={item.description} 
                          onChange={(e) => this.handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" 
                          placeholder="e.g., Conveyancing fee" 
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input 
                          type="text" 
                          value={this.formatNumberForInput(item.rate)} 
                          onChange={(e) => this.handleItemChange(item.id, 'rate', this.parseFormattedNumber(e.target.value))}
                          className="w-24 text-right border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" 
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => this.handleItemChange(item.id, 'qty', e.target.value)}
                          className="w-16 text-right border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800" 
                          min="0"
                          step="1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input 
                          type="text" 
                          value={this.formatCurrency((parseFloat(item.rate) || 0) * (parseFloat(item.qty) || 0))} 
                          onChange={(e) => {
                            const newAmount = this.parseFormattedNumber(e.target.value) || 0;
                            const qty = parseFloat(item.qty) || 1;
                            const newRate = qty > 0 ? (newAmount / qty).toFixed(2) : 0;
                            this.handleItemChange(item.id, 'rate', newRate);
                          }}
                          className="w-24 text-right border-none focus:ring-0 focus:outline-none p-1 text-sm text-gray-800 font-medium" 
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button 
                          onClick={() => this.removeItem(item.id)} 
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              onClick={this.addItem} 
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add New Item
            </button>

            {/* Pricing Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex justify-end items-center">
                <label htmlFor="discount" className="text-sm font-medium text-gray-600 mr-2">Discount (R)</label>
                <input 
                  type="text" 
                  id="discount" 
                  name="discount" 
                  value={this.formatNumberForInput(invoiceDetails.discount)} 
                  onChange={(e) => this.setState(prevState =>  ({
                    invoiceDetails: {
                      ...prevState.invoiceDetails,
                      discount: this.parseFormattedNumber(e.target.value)
                    }
                  }))}
                  className="w-32 border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="includeVat" 
                  name="includeVat" 
                  checked={invoiceDetails.includeVat} 
                  onChange={this.handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label htmlFor="includeVat" className="ml-2 text-sm font-medium text-gray-600">
                  Include VAT ({invoiceDetails.vatRate}%)
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Additional Information</h4>
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-600">Notes / Terms</label>
              <textarea 
                id="notes" 
                name="notes" 
                value={invoiceDetails.notes} 
                onChange={this.handleChange} 
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g., Payment due in 30 days."
              />
            </div>
            <div className="mb-6">
              <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-600">Bank Account Details</label>
              <textarea 
                id="bankAccount" 
                name="bankAccount" 
                value={invoiceDetails.bankAccount} 
                onChange={this.handleChange} 
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Bank Name, Account Number, etc."
              />
            </div>


          </DashboardCard>

          {/* Invoice Preview */}
          <DashboardCard title="Invoice Preview" className="h-fit">
              <div className="invoice-preview-content p-6 bg-white rounded-lg border border-gray-200 overflow-y-auto">
                {/* Invoice Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-700">EASYHOMES CONVEYANCERS</h2>
                    <p className="text-sm text-gray-600 mt-1">Professional Conveyancing Services</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-gray-800">INVOICE</h3>
                    <p className="text-sm text-gray-600">No: {invoiceDetails.invoiceId}</p>
                    <p className="text-sm text-gray-600">Date: {invoiceDetails.date}</p>
                    <p className="text-sm text-gray-600">Due: {invoiceDetails.dueDate}</p>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">BILL TO:</h3>
                  <p className="text-md font-semibold text-gray-800 mb-1">
                    {invoiceDetails.clientName || '--- Client Name ---'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoiceDetails.clientAddress || '--- Client Address ---'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoiceDetails.clientEmail || '--- Client Email ---'}
                  </p>
                  {invoiceDetails.transferMatter && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      **Regarding Matter:** {invoiceDetails.transferMatter}
                    </p>
                  )}
                </div>

                {/* Items Table */}
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
                        <td className="py-2 px-3 text-right text-sm text-gray-800">R{this.formatCurrency(item.rate)}</td>
                        <td className="py-2 px-3 text-right text-sm text-gray-800 font-medium">
                          R{this.formatCurrency((parseFloat(item.rate) || 0) * (parseFloat(item.qty) || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Section */}
                <div className="flex justify-end mb-6">
                  <div className="w-full sm:w-1/2 lg:w-3/4">
                    <div className="flex justify-between py-1 text-sm text-gray-700">
                      <span>Subtotal</span>
                      <span>R{this.formatCurrency(this.calculateSubtotal())}</span>
                    </div>
                    {invoiceDetails.discount > 0 && (
                      <div className="flex justify-between py-1 text-sm text-gray-700">
                        <span>Discount</span>
                        <span>-R{this.formatCurrency(invoiceDetails.discount)}</span>
                      </div>
                    )}
                    {invoiceDetails.includeVat && (
                      <div className="flex justify-between py-1 text-sm text-gray-700">
                        <span>VAT ({invoiceDetails.vatRate}%)</span>
                        <span>R{this.formatCurrency(this.calculateVAT())}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-lg font-bold text-gray-800 border-t-2 border-gray-400 mt-2">
                      <span>TOTAL DUE</span>
                      <span>R{this.formatCurrency(this.calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Bank Details */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {invoiceDetails.notes || 'No notes provided.'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Account Details:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {invoiceDetails.bankAccount || 'No bank details provided.'}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
                <button
                  onClick={this.saveDraft}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={this.createAndSendInvoice}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>{isLoading ? 'Sending...' : 'Create & Send Invoice'}</span>
                </button>
              </div>
            </DashboardCard>
        </div>
      </div>
    );
  }
}

export default InvoicePage; 