import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { notificationManager } from '../lib/notifications';

const NotificationPermission = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [permission, setPermission] = useState(notificationManager.permission);

  useEffect(() => {
    // Show banner if notifications are supported but not granted
    if (notificationManager.isSupported() && permission === 'default') {
      setShowBanner(true);
    }
  }, [permission]);

  const handleRequestPermission = async () => {
    const granted = await notificationManager.requestPermission();
    setPermission(notificationManager.permission);
    if (granted) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Store dismissal in localStorage to not show again for this session
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  useEffect(() => {
    const dismissed = localStorage.getItem('notification-banner-dismissed');
    if (dismissed) {
      setShowBanner(false);
    }
  }, []);

  if (!showBanner || !notificationManager.isSupported()) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-primary text-primary-content rounded-lg shadow-lg p-4 flex items-center gap-3">
        <Bell className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Enable notifications</p>
          <p className="text-xs opacity-90">Get notified when you receive new messages</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRequestPermission}
            className="btn btn-sm btn-ghost text-primary-content hover:bg-primary-content/20"
          >
            Enable
          </button>
          <button
            onClick={handleDismiss}
            className="btn btn-sm btn-ghost text-primary-content hover:bg-primary-content/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;