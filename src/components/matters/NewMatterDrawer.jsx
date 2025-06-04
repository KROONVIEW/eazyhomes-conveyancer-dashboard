import React, { useState } from "react";

const MATTER_TYPES = [
  "Sectional Title",
  "Freehold",
  "Bond Cancellation",
  "Estate",
  "Commercial",
  "Vacant Land",
  "Transfer",
  "Subdivision",
  "Other"
];
const STATUS_OPTIONS = [
  "New",
  "In Progress",
  "Registered",
  "Delayed",
  "On Hold"
];

const MOCK_CLIENTS = [
  { id: 'C001', name: 'Lindiwe Nkosi', idNumber: '8001015009087', email: 'lindiwe@example.com', phone: '0821234567' },
  { id: 'C002', name: 'Sipho Dlamini', idNumber: '7502026009088', email: 'sipho@example.com', phone: '0832345678' },
  { id: 'C003', name: 'Fatima Patel', idNumber: '8203037009089', email: 'fatima@example.com', phone: '0843456789' },
];

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Vacant Land"
];
const DEEDS_OFFICES = [
  "Johannesburg",
  "Pretoria",
  "Cape Town",
  "Durban",
  "Bloemfontein"
];

const TASK_TEMPLATES = [
  { id: 'TEMPLATE1', name: 'Sectional Title - 12 Tasks', desc: 'Standard sectional title transfer tasks', estDays: 30 },
  { id: 'TEMPLATE2', name: 'Freehold - 10 Tasks', desc: 'Freehold transfer workflow', estDays: 25 },
  { id: 'TEMPLATE3', name: 'Bond Cancellation - 8 Tasks', desc: 'Bond cancellation process', estDays: 18 },
  { id: 'TEMPLATE4', name: 'Estate - 15 Tasks', desc: 'Estate transfer checklist', estDays: 40 },
];

const STAFF = [
  { id: 'S001', name: 'Thuli M.', available: true },
  { id: 'S002', name: 'Kabelo S.', available: false },
  { id: 'S003', name: 'Nomsa P.', available: true },
  { id: 'S004', name: 'Johan V.', available: true },
];
const ROLES = ["Conveyancer", "Admin", "Paralegal", "Clerk"];

export default function NewMatterDrawer({ open, onClose, onNext }) {
  const [title, setTitle] = useState("");
  const [matterType, setMatterType] = useState("");
  const [status, setStatus] = useState("New");
  const [urgent, setUrgent] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [matterData, setMatterData] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientQuery, setClientQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", idNumber: "", email: "", phone: "" });
  const [clientError, setClientError] = useState("");
  const [propertyStep, setPropertyStep] = useState({
    address: "",
    titleDeed: "",
    propertyType: "",
    erf: "",
    deedsOffice: ""
  });
  const [addressQuery, setAddressQuery] = useState("");
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [propertyTouched, setPropertyTouched] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateTouched, setTemplateTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignment, setAssignment] = useState({ staff: [], supervisor: "", roles: [] });
  const [assignTouched, setAssignTouched] = useState({});

  const filteredTypes = MATTER_TYPES.filter(t => t.toLowerCase().includes(typeQuery.toLowerCase()));
  const filteredClients = MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(clientQuery.toLowerCase()));
  const isStep1Valid = title.trim() && matterType && status;
  const isStep2Valid = clients.length > 0 && clients.some(c => c.primary);

  // Mock address autocomplete
  React.useEffect(() => {
    if (!addressQuery) { setAddressOptions([]); return; }
    setAddressLoading(true);
    setTimeout(() => {
      setAddressOptions([
        "12 Oak Avenue, Sandton",
        "34 Pine Lane, Pretoria",
        "56 Main Road, Cape Town",
        "78 Market St, Bloemfontein",
        "99 Maple Dr, Durban"
      ].filter(a => a.toLowerCase().includes(addressQuery.toLowerCase())));
      setAddressLoading(false);
    }, 400);
  }, [addressQuery]);

  // Auto-fill deeds office based on address (mocked)
  React.useEffect(() => {
    if (propertyStep.address.includes("Sandton")) setPropertyStep(s => ({ ...s, deedsOffice: "Johannesburg" }));
    else if (propertyStep.address.includes("Pretoria")) setPropertyStep(s => ({ ...s, deedsOffice: "Pretoria" }));
    else if (propertyStep.address.includes("Cape Town")) setPropertyStep(s => ({ ...s, deedsOffice: "Cape Town" }));
    else if (propertyStep.address.includes("Bloemfontein")) setPropertyStep(s => ({ ...s, deedsOffice: "Bloemfontein" }));
    else if (propertyStep.address.includes("Durban")) setPropertyStep(s => ({ ...s, deedsOffice: "Durban" }));
  }, [propertyStep.address]);

  const isStep3Valid = propertyStep.address && propertyStep.propertyType && propertyStep.erf && propertyStep.deedsOffice;
  const isStep5Valid = !!selectedTemplate;

  function handleNext(e) {
    e.preventDefault();
    if (step === 1) {
      setTouched({ title: true, matterType: true, status: true });
      if (!isStep1Valid) return;
      setMatterData({ title, matterType, status, urgent });
      setStep(2);
    } else if (step === 2) {
      setClientError("");
      if (!isStep2Valid) {
        setClientError("At least one client (with a primary) is required.");
        return;
      }
      setMatterData(prev => ({ ...prev, clients }));
      setStep(3);
    } else if (step === 3) {
      setPropertyTouched({ address: true, propertyType: true, erf: true, deedsOffice: true });
      if (!isStep3Valid) return;
      setMatterData(prev => ({ ...prev, property: propertyStep }));
      setStep(4);
    } else if (step === 4) {
      setAssignTouched({ staff: true, supervisor: true });
      if (!isStep4Valid) return;
      setMatterData(prev => ({ ...prev, assignment }));
      setStep(5);
    } else if (step === 5) {
      setTemplateTouched(true);
      if (!isStep5Valid) return;
      setMatterData(prev => ({ ...prev, template: selectedTemplate }));
      setStep(6);
    } else if (step === 6) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        onNext && onNext({ ...matterData, clients, property: propertyStep, assignment, template: selectedTemplate });
      }, 1200);
    }
  }

  function handleBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else if (step === 6) setStep(5);
  }

  function handleAddExistingClient(client) {
    setClients(prev => [
      ...prev,
      { ...client, primary: clients.length === 0 } // first added is primary
    ]);
    setClientQuery("");
  }

  function handleAddNewClient() {
    if (!newClient.name.trim() || !newClient.idNumber.trim()) return;
    setClients(prev => [
      ...prev,
      { ...newClient, id: `NEW${Date.now()}`, primary: clients.length === 0 }
    ]);
    setNewClient({ name: "", idNumber: "", email: "", phone: "" });
    setShowAddClient(false);
  }

  function handleSetPrimary(idx) {
    setClients(clients.map((c, i) => ({ ...c, primary: i === idx })));
  }

  function handleRemoveClient(idx) {
    setClients(clients.filter((_, i) => i !== idx));
  }

  function handleTypeQueryKeyDown(e) {
    if (e.key === 'Enter' && filteredTypes.length === 1) {
      setMatterType(filteredTypes[0]);
      setTypeQuery("");
      e.preventDefault();
    }
  }

  const isStep4Valid = assignment.staff.length > 0 && assignment.supervisor;
  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden="true" />
      {/* Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transition-transform duration-300 transform ${open ? 'translate-x-0' : 'translate-x-full'} rounded-l-lg flex flex-col`} tabIndex={-1} aria-modal="true" role="dialog">
        {/* Stepper */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
            <span className={`font-semibold ${step === 1 ? 'text-blue-700' : 'text-gray-400'}`}>Matter Overview</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
            <span className={`font-semibold ${step === 2 ? 'text-blue-700' : 'text-gray-400'}`}>Client Information</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
            <span className={`font-semibold ${step === 3 ? 'text-blue-700' : 'text-gray-400'}`}>Property Details</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>4</span>
            <span className={`font-semibold ${step === 4 ? 'text-blue-700' : 'text-gray-400'}`}>Assignment</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>5</span>
            <span className={`font-semibold ${step === 5 ? 'text-blue-700' : 'text-gray-400'}`}>Task Template</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 6 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>6</span>
            <span className={`font-semibold ${step === 6 ? 'text-blue-700' : 'text-gray-400'}`}>Review & Submit</span>
          </div>
          <span className="text-gray-400">/ 6 steps</span>
        </div>
        {/* Step 1: Matter Overview */}
        {step === 1 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <label className="block font-medium mb-1">Matter Title <span className="text-red-500">*</span></label>
            <input
              autoFocus
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, title: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${touched.title && !title.trim() ? 'border-red-400' : ''}`}
              placeholder="e.g. 12 Oak Avenue, Sandton"
              required
            />
            {touched.title && !title.trim() && <div className="text-red-500 text-xs mb-2">Title is required.</div>}

            <label className="block font-medium mb-1">Matter Type <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={typeQuery}
              onChange={e => setTypeQuery(e.target.value)}
              onKeyDown={handleTypeQueryKeyDown}
              placeholder="Type to filter..."
              className="w-full border rounded px-3 py-2 focus:ring mb-2"
              autoComplete="off"
            />
            <select
              name="matterType"
              value={matterType}
              onChange={e => setMatterType(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, matterType: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${touched.matterType && !matterType ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select matter type</option>
              {filteredTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {typeQuery && !matterType && <div className="text-blue-500 text-xs mb-2">Press Enter to select the filtered type, or pick from the dropdown.</div>}
            {touched.matterType && !matterType && <div className="text-red-500 text-xs mb-2">Matter type is required.</div>}

            <label className="block font-medium mb-1">Status <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, status: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${touched.status && !status ? 'border-red-400' : ''}`}
              required
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {touched.status && !status && <div className="text-red-500 text-xs mb-2">Status is required.</div>}

            <div className="flex items-center mb-6">
              <button
                type="button"
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold transition ${urgent ? 'bg-red-100 border-red-400 text-red-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                onClick={() => setUrgent(u => !u)}
                aria-pressed={urgent}
              >
                <span className="w-2 h-2 rounded-full inline-block bg-red-500" />
                Mark as Urgent
              </button>
              {urgent && <span className="ml-2 text-xs text-red-500 font-semibold">Urgent</span>}
            </div>

            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${!isStep1Valid ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isStep1Valid}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {/* Step 2: Client Information */}
        {step === 2 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <label className="block font-medium mb-1">Add Client(s) <span className="text-red-500">*</span></label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={clientQuery}
                onChange={e => setClientQuery(e.target.value)}
                placeholder="Search existing clients..."
                className="border rounded px-3 py-2 w-full focus:ring"
              />
              <button type="button" className="px-3 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200" onClick={() => setShowAddClient(true)}>+ Add New</button>
            </div>
            {clientQuery && (
              <div className="bg-white border rounded shadow mb-2 max-h-32 overflow-auto">
                {filteredClients.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No results</div>
                ) : filteredClients.map(c => (
                  <button key={c.id} type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm" onClick={() => handleAddExistingClient(c)}>{c.name} ({c.idNumber})</button>
                ))}
              </div>
            )}
            {/* Add new client inline */}
            {showAddClient && (
              <div className="mb-2 p-3 border rounded bg-gray-50">
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newClient.name} onChange={e => setNewClient(nc => ({ ...nc, name: e.target.value }))} placeholder="Full Name" className="border rounded px-3 py-2 w-full focus:ring" />
                  <input type="text" value={newClient.idNumber} onChange={e => setNewClient(nc => ({ ...nc, idNumber: e.target.value }))} placeholder="ID Number" className="border rounded px-3 py-2 w-full focus:ring" />
                </div>
                <div className="flex gap-2 mb-2">
                  <input type="email" value={newClient.email} onChange={e => setNewClient(nc => ({ ...nc, email: e.target.value }))} placeholder="Email (optional)" className="border rounded px-3 py-2 w-full focus:ring" />
                  <input type="text" value={newClient.phone} onChange={e => setNewClient(nc => ({ ...nc, phone: e.target.value }))} placeholder="Phone (optional)" className="border rounded px-3 py-2 w-full focus:ring" />
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={handleAddNewClient}>Add</button>
                  <button type="button" className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300" onClick={() => setShowAddClient(false)}>Cancel</button>
                </div>
              </div>
            )}
            {/* List of added clients */}
            <div className="mb-4">
              {clients.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-2 mb-2 p-2 border rounded bg-white">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{c.name} {c.primary && <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Primary</span>}</div>
                    <div className="text-xs text-gray-500">ID: {c.idNumber} {c.email && <>| {c.email}</>} {c.phone && <>| {c.phone}</>}</div>
                  </div>
                  <button type="button" className="text-blue-500 hover:underline text-xs" onClick={() => handleSetPrimary(idx)} disabled={c.primary}>Set Primary</button>
                  <button type="button" className="text-red-400 hover:text-red-600 text-lg px-2" onClick={() => handleRemoveClient(idx)} aria-label="Remove client">&times;</button>
                </div>
              ))}
            </div>
            {clientError && <div className="text-red-500 text-xs mb-2">{clientError}</div>}
            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${!isStep2Valid ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isStep2Valid}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {/* Step 3: Property Details */}
        {step === 3 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <label className="block font-medium mb-1">Property Address <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={addressQuery}
              onChange={e => { setAddressQuery(e.target.value); setPropertyStep(s => ({ ...s, address: "" })); }}
              placeholder="Start typing address..."
              className="mb-2 border rounded px-3 py-2 w-full focus:ring"
              autoComplete="off"
              onBlur={() => setPropertyTouched(t => ({ ...t, address: true }))}
            />
            {addressQuery && (
              <div className="bg-white border rounded shadow mb-2 max-h-32 overflow-auto">
                {addressLoading ? (
                  <div className="px-4 py-2 text-gray-500">Loading...</div>
                ) : addressOptions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No results</div>
                ) : addressOptions.map(a => (
                  <button key={a} type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm" onClick={() => { setPropertyStep(s => ({ ...s, address: a })); setAddressQuery(""); }}>{a}</button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={propertyStep.address}
              readOnly
              className={`mb-4 border rounded px-3 py-2 w-full bg-gray-100 ${propertyTouched.address && !propertyStep.address ? 'border-red-400' : ''}`}
              placeholder="Select address from above"
              required
            />
            {propertyTouched.address && !propertyStep.address && <div className="text-red-500 text-xs mb-2">Address is required.</div>}

            <label className="block font-medium mb-1">Title Deed Number</label>
            <input
              type="text"
              value={propertyStep.titleDeed}
              onChange={e => setPropertyStep(s => ({ ...s, titleDeed: e.target.value }))}
              className="mb-4 border rounded px-3 py-2 w-full focus:ring"
              placeholder="Optional"
            />

            <label className="block font-medium mb-1">Property Type <span className="text-red-500">*</span></label>
            <select
              value={propertyStep.propertyType}
              onChange={e => setPropertyStep(s => ({ ...s, propertyType: e.target.value }))}
              onBlur={() => setPropertyTouched(t => ({ ...t, propertyType: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${propertyTouched.propertyType && !propertyStep.propertyType ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select property type</option>
              {PROPERTY_TYPES.map(pt => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
            {propertyTouched.propertyType && !propertyStep.propertyType && <div className="text-red-500 text-xs mb-2">Property type is required.</div>}

            <label className="block font-medium mb-1">Erf / Stand Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={propertyStep.erf}
              onChange={e => setPropertyStep(s => ({ ...s, erf: e.target.value }))}
              onBlur={() => setPropertyTouched(t => ({ ...t, erf: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${propertyTouched.erf && !propertyStep.erf ? 'border-red-400' : ''}`}
              placeholder="e.g. 12345"
              required
            />
            {propertyTouched.erf && !propertyStep.erf && <div className="text-red-500 text-xs mb-2">Erf/Stand number is required.</div>}

            <label className="block font-medium mb-1">Deeds Office <span className="text-red-500">*</span></label>
            <select
              value={propertyStep.deedsOffice}
              onChange={e => setPropertyStep(s => ({ ...s, deedsOffice: e.target.value }))}
              onBlur={() => setPropertyTouched(t => ({ ...t, deedsOffice: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${propertyTouched.deedsOffice && !propertyStep.deedsOffice ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select deeds office</option>
              {DEEDS_OFFICES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {propertyTouched.deedsOffice && !propertyStep.deedsOffice && <div className="text-red-500 text-xs mb-2">Deeds office is required.</div>}

            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${!isStep3Valid ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isStep3Valid}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {/* Step 4: Assignment */}
        {step === 4 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <label className="block font-medium mb-1">Assign Staff <span className="text-red-500">*</span></label>
            <div className="mb-2 flex flex-wrap gap-2">
              {STAFF.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${assignment.staff.includes(s.id) ? (s.available ? 'bg-blue-600 text-white border-blue-600' : 'bg-yellow-400 text-yellow-900 border-yellow-400') : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  onClick={() => setAssignment(a => a.staff.includes(s.id) ? { ...a, staff: a.staff.filter(id => id !== s.id) } : { ...a, staff: [...a.staff, s.id] })}
                  aria-pressed={assignment.staff.includes(s.id)}
                >
                  {s.name} {s.available ? '' : <span className="ml-1 text-xs">(Busy)</span>}
                </button>
              ))}
            </div>
            {assignTouched.staff && assignment.staff.length === 0 && <div className="text-red-500 text-xs mb-2">At least one staff member required.</div>}

            <label className="block font-medium mb-1">Matter Supervisor <span className="text-red-500">*</span></label>
            <select
              value={assignment.supervisor}
              onChange={e => setAssignment(a => ({ ...a, supervisor: e.target.value }))}
              onBlur={() => setAssignTouched(t => ({ ...t, supervisor: true }))}
              className={`mb-4 border rounded px-3 py-2 w-full focus:ring ${assignTouched.supervisor && !assignment.supervisor ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select supervisor</option>
              {STAFF.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {assignTouched.supervisor && !assignment.supervisor && <div className="text-red-500 text-xs mb-2">Supervisor is required.</div>}

            <label className="block font-medium mb-1">Team Roles</label>
            <div className="mb-4 flex flex-wrap gap-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${assignment.roles.includes(role) ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  onClick={() => setAssignment(a => a.roles.includes(role) ? { ...a, roles: a.roles.filter(r => r !== role) } : { ...a, roles: [...a.roles, role] })}
                  aria-pressed={assignment.roles.includes(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${!isStep4Valid ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isStep4Valid}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {/* Step 5: Task Template Picker */}
        {step === 5 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <label className="block font-medium mb-1">Select Task Template <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {TASK_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  className={`border rounded-lg p-4 text-left transition shadow-sm hover:shadow-md focus:outline-none ${selectedTemplate === tpl.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  aria-pressed={selectedTemplate === tpl.id}
                >
                  <div className="font-semibold text-blue-700 mb-1">{tpl.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{tpl.desc}</div>
                  <div className="text-xs text-gray-400">Est. Timeline: <span className="font-semibold text-gray-700">{tpl.estDays} days</span></div>
                  {selectedTemplate === tpl.id && <div className="mt-2 text-xs text-blue-600 font-semibold">Selected</div>}
                </button>
              ))}
            </div>
            {templateTouched && !selectedTemplate && <div className="text-red-500 text-xs mb-2">Please select a template.</div>}
            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${!isStep5Valid ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isStep5Valid}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <form onSubmit={handleNext} className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Review Matter Details</h2>
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-1">Matter Overview</div>
              <div className="text-sm text-gray-700">{matterData?.title} ({matterData?.matterType})</div>
              <div className="text-xs text-gray-500">Status: {matterData?.status} {matterData?.urgent && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Urgent</span>}</div>
              <button type="button" className="text-xs text-blue-500 hover:underline ml-2" onClick={() => setStep(1)}>Edit</button>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-1">Clients</div>
              {clients.map(c => (
                <div key={c.id} className="text-sm text-gray-700 mb-1">{c.name} {c.primary && <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Primary</span>} <span className="text-xs text-gray-500">ID: {c.idNumber}</span></div>
              ))}
              <button type="button" className="text-xs text-blue-500 hover:underline ml-2" onClick={() => setStep(2)}>Edit</button>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-1">Property</div>
              <div className="text-sm text-gray-700">{propertyStep.address} ({propertyStep.propertyType})</div>
              <div className="text-xs text-gray-500">Erf: {propertyStep.erf} | Deeds Office: {propertyStep.deedsOffice}</div>
              {propertyStep.titleDeed && <div className="text-xs text-gray-500">Title Deed: {propertyStep.titleDeed}</div>}
              <button type="button" className="text-xs text-blue-500 hover:underline ml-2" onClick={() => setStep(3)}>Edit</button>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-1">Assignment</div>
              <div className="text-sm text-gray-700">Staff: {assignment.staff.map(id => STAFF.find(s => s.id === id)?.name).join(", ")}</div>
              <div className="text-xs text-gray-500">Supervisor: {STAFF.find(s => s.id === assignment.supervisor)?.name}</div>
              <div className="text-xs text-gray-500">Roles: {assignment.roles.join(", ")}</div>
              <button type="button" className="text-xs text-blue-500 hover:underline ml-2" onClick={() => setStep(4)}>Edit</button>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-1">Task Template</div>
              <div className="text-sm text-gray-700">{TASK_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</div>
              <div className="text-xs text-gray-500">{TASK_TEMPLATES.find(t => t.id === selectedTemplate)?.desc}</div>
              <button type="button" className="text-xs text-blue-500 hover:underline ml-2" onClick={() => setStep(5)}>Edit</button>
            </div>
            <div className="flex gap-3 mt-auto sticky bottom-0 bg-white py-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 rounded px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                onClick={handleBack}
                disabled={submitting}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
} 