import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

// New Feature Pages
import SchedulePage from './pages/schedule/SchedulePage';
import VideoPage from './pages/video/VideoPage';

// --- WALLET IMPORT ---
// Humne isay components/layout folder se import kiya hye jaisa aapne bataya tha
import Wallet from './components/layout/Wallet'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main App Routes (Wrapped in DashboardLayout) */}
          <Route element={<DashboardLayout />}>
            {/* Dashboard Specifics */}
            <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="/dashboard/investor" element={<InvestorDashboard />} />
            
            {/* Core Features */}
            <Route path="/investors" element={<InvestorsPage />} />
            <Route path="/entrepreneurs" element={<EntrepreneursPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            
            {/* Payment & Wallet Feature (Linked with Sidebar /wallet path) */}
            <Route path="/wallet" element={<Wallet />} />
            
            {/* Communication */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Scheduling & Video */}
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/video" element={<VideoPage />} />
            
            {/* Profiles */}
            <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="/profile/investor/:id" element={<InvestorProfile />} />
            
            {/* Settings & Support */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>
          
          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;