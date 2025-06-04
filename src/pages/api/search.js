// Next.js API route: /api/search
export default function handler(req, res) {
  const { q } = req.query;
  const query = (q || '').toLowerCase();
  // Mock data - replace with real DB search
  const matters = [
    { id: 'EZT1001', title: 'Case File 21 - 12 Oak Ave', type: 'matters' },
    { id: 'EZT1002', title: 'Case File 210 - 78 Pine Rd', type: 'matters' },
    { id: 'EZT1003', title: 'Case File 219 - 45 Maple St', type: 'matters' },
  ].filter(m => m.title.toLowerCase().includes(query));
  const clients = [
    { id: 'C001', title: 'Alice Smith', type: 'clients' },
    { id: 'C002', title: 'John Doe', type: 'clients' },
  ].filter(c => c.title.toLowerCase().includes(query));
  const tasks = [
    { id: 'T001', title: 'Send FICA Request', type: 'tasks' },
  ].filter(t => t.title.toLowerCase().includes(query));
  const documents = [
    { id: 'D001', title: 'FICA.pdf', type: 'documents' },
  ].filter(d => d.title.toLowerCase().includes(query));
  res.status(200).json({ matters, clients, tasks, documents });
} 