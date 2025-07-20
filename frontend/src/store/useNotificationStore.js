import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Notification settings
      notificationsEnabled: true,
      showSenderName: true,
      showMessagePreview: true,

      // Actions
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setShowSenderName: (show) => set({ showSenderName: show }),
      setShowMessagePreview: (show) => set({ showMessagePreview: show }),

      // Get notification content based on settings
      getNotificationContent: (senderName, message) => {
        const { showSenderName, showMessagePreview } = get();
        
        let title = "New Message";
        let body = "";

        if (showSenderName) {
          title = `New message from ${senderName}`;
        }

        if (showMessagePreview) {
          body = message.text || (message.image ? "📷 Image" : "New message");
        } else if (showSenderName) {
          body = "You have a new message";
        } else {
          body = "You have a new message";
        }

        return { title, body };
      },
    }),
    {
      name: "notification-settings",
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        showSenderName: state.showSenderName,
        showMessagePreview: state.showMessagePreview,
      }),
    }
  )
);