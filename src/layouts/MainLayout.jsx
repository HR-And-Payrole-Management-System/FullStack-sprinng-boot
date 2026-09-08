import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import NetworkStatusBanner from '../components/NetworkStatusBanner';
import { useMailSocket } from '../hooks/useMailSocket';
import { useToast } from '../context/ToastContext';
import TelegramChatButton from '../components/TelegramChatButton';

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { showToast } = useToast();

  useMailSocket((envelope) => {
  if (envelope.type === 'NEW_MESSAGE') {
    showToast(`New message from ${envelope.data.senderName}`, 'info');
    window.dispatchEvent(new CustomEvent('mail:new-message', { detail: envelope.data }));
  }
});

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div
        className="d-flex flex-column"
        style={{ minWidth: 0, flex: '1 1 0%', height: '100vh' }}
      >
        <Topbar onToggleSidebar={() => setCollapsed((c) => !c)} />

        {/* តំបន់នេះតែមួយគត់ដែល scroll — Sidebar/Topbar នៅនឹងកន្លែង */}
        <main
          id="main-content"
          className="p-4 flex-grow-1"
          style={{ width: '100%', overflowY: 'auto' }}
        >
          <Breadcrumb />
          <Outlet />
        </main>
        <Footer />
      </div>
       <TelegramChatButton />
    </div>
  );
}

export default MainLayout;