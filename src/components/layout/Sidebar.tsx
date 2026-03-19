import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Calendar, Video,
  Handshake, Wallet as WalletIcon 
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ${
          isActive 
            ? 'bg-blue-50 text-blue-700 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // 1. Items for Entrepreneur (Jo aapki 1st image mein hye)
  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/deals', icon: <Handshake size={20} />, text: 'Investment Deals' },
    { to: '/wallet', icon: <WalletIcon size={20} />, text: 'My Wallet' }, // Added Wallet
    { to: '/schedule', icon: <Calendar size={20} />, text: 'Schedule' },
    { to: '/video', icon: <Video size={20} />, text: 'Video Call' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
  ];
  
  // 2. Items for Investor (Jo aapki 2nd image mein hye)
  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/deals', icon: <Handshake size={20} />, text: 'Active Deals' },
    { to: '/wallet', icon: <WalletIcon size={20} />, text: 'My Wallet' }, // Added Wallet
    { to: '/schedule', icon: <Calendar size={20} />, text: 'Schedule' },
    { to: '/video', icon: <Video size={20} />, text: 'Video Call' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
  ];
  
  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-gray-50 flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Nexus</span>
        </div>

        {/* Links Section */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1 text-left">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </div>
          
          <div className="mt-8 px-3 text-left">
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, index) => (
                <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};