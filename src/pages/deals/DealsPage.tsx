import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar, Plus, X, Eye } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const dealsData = [
  { id: 1, startup: { name: 'TechWave AI', logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', industry: 'FinTech' }, amount: '$1.5M', equity: '15%', status: 'Due Diligence', stage: 'Series A', lastActivity: '2024-02-15' },
  { id: 2, startup: { name: 'GreenLife Solutions', logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', industry: 'CleanTech' }, amount: '$2M', equity: '20%', status: 'Term Sheet', stage: 'Seed', lastActivity: '2024-02-10' },
  { id: 3, startup: { name: 'HealthPulse', logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', industry: 'HealthTech' }, amount: '$800K', equity: '12%', status: 'Negotiation', stage: 'Pre-seed', lastActivity: '2024-02-05' }
];

export const DealsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];
  
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Due Diligence': return 'primary';
      case 'Term Sheet': return 'secondary';
      case 'Negotiation': return 'accent';
      case 'Closed': return 'success';
      case 'Passed': return 'error';
      default: return 'gray';
    }
  };

  const filteredDeals = dealsData.filter(deal => {
    const matchesSearch = deal.startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         deal.startup.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(deal.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-gray-600">Track and manage your investment pipeline</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
          Add Deal
        </Button>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardBody className="flex items-center"><div className="p-3 bg-primary-100 rounded-lg mr-3"><DollarSign size={20} className="text-primary-600" /></div><div><p className="text-sm text-gray-600">Total Investment</p><p className="text-lg font-semibold">$4.3M</p></div></CardBody></Card>
        <Card><CardBody className="flex items-center"><div className="p-3 bg-secondary-100 rounded-lg mr-3"><TrendingUp size={20} className="text-secondary-600" /></div><div><p className="text-sm text-gray-600">Active Deals</p><p className="text-lg font-semibold">{filteredDeals.length}</p></div></CardBody></Card>
        <Card><CardBody className="flex items-center"><div className="p-3 bg-accent-100 rounded-lg mr-3"><Users size={20} className="text-accent-600" /></div><div><p className="text-sm text-gray-600">Portfolio</p><p className="text-lg font-semibold">12</p></div></CardBody></Card>
        <Card><CardBody className="flex items-center"><div className="p-3 bg-success-100 rounded-lg mr-3"><Calendar size={20} className="text-success-600" /></div><div><p className="text-sm text-gray-600">Closed (Month)</p><p className="text-lg font-semibold">2</p></div></CardBody></Card>
      </div>

      

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<Search size={18} />}
            fullWidth
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {statuses.map(status => (
            <Badge
              key={status}
              variant={selectedStatus.includes(status) ? getStatusColor(status) : 'gray'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => toggleStatus(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><h2 className="text-lg font-medium text-gray-900">Active Pipeline</h2></CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Startup</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Equity</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDeals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{deal.startup.name}</div>
                        <div className="text-sm text-gray-500">{deal.startup.industry}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{deal.amount}</td>
                    <td className="px-6 py-4 text-sm">{deal.equity}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge></td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" leftIcon={<Eye size={14}/>}>Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Investment Deal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <div className="space-y-4">
              <Input label="Startup Name" fullWidth />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Amount ($)" placeholder="e.g. 500k" fullWidth />
                <Input label="Equity (%)" placeholder="e.g. 10" fullWidth />
              </div>
              <Button className="w-full mt-4" onClick={() => setIsModalOpen(false)}>Save Deal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsPage;