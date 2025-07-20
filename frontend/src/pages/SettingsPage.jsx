import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Bell, BellOff } from "lucide-react";
import { notificationManager } from "../lib/notifications";
import { useState, useEffect } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [notificationPermission, setNotificationPermission] = useState(
    notificationManager.permission
  );

  useEffect(() => {
    // Update permission state when it changes
    const checkPermission = () => {
      setNotificationPermission(notificationManager.permission);
    };
    
    // Check periodically in case user changes permission in browser settings
    const interval = setInterval(checkPermission, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationToggle = async () => {
    if (notificationPermission !== 'granted') {
      const granted = await notificationManager.requestPermission();
      setNotificationPermission(notificationManager.permission);
      
      if (granted) {
        // Show test notification
        notificationManager.showNotification('Notifications Enabled!', {
          body: 'You will now receive message notifications when away from the app.',
          icon: '/avatar.png'
        });
      }
    }
  };
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-base-content/70">
              Manage your notification preferences
            </p>
          </div>

          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationPermission === 'granted' ? (
                  <Bell className="w-5 h-5 text-success" />
                ) : (
                  <BellOff className="w-5 h-5 text-base-content/60" />
                )}
                <div>
                  <h3 className="font-medium">Browser Notifications</h3>
                  <p className="text-sm text-base-content/70">
                    {notificationPermission === 'granted'
                      ? 'Notifications are enabled'
                      : notificationPermission === 'denied'
                      ? 'Notifications are blocked. Enable in browser settings.'
                      : 'Get notified when you receive new messages'}
                  </p>
                </div>
              </div>
              
              {notificationPermission !== 'denied' && (
                <button
                  onClick={handleNotificationToggle}
                  className={`btn btn-sm ${
                    notificationPermission === 'granted' ? 'btn-success' : 'btn-primary'
                  }`}
                  disabled={notificationPermission === 'granted'}
                >
                  {notificationPermission === 'granted' ? 'Enabled' : 'Enable'}
                </button>
              )}
            </div>
            
            {notificationPermission === 'denied' && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg">
                <p className="text-sm text-warning">
                  Notifications are blocked. To enable them:
                  <br />
                  1. Click the lock icon in your browser's address bar
                  <br />
                  2. Set notifications to "Allow"
                  <br />
                  3. Refresh the page
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
