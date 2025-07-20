import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { notificationManager, pageVisibilityManager } from "../lib/notifications";
import { useNotificationStore } from "./useNotificationStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      // Show notification if page is not visible and notifications are enabled
      const { notificationsEnabled } = useNotificationStore.getState();
      if (!pageVisibilityManager.isPageVisible() && 
          notificationManager.isPermissionGranted() && 
          notificationsEnabled) {
        const { users } = get();
        const sender = users.find(user => user._id === newMessage.senderId);
        if (sender) {
          const { getNotificationContent } = useNotificationStore.getState();
          const { title, body } = getNotificationContent(sender.fullName, newMessage);
          
          notificationManager.showNotification(title, {
            body,
            icon: sender.profilePic || '/avatar.png',
            tag: `message-${sender.fullName}`,
            data: {
              senderId: newMessage.senderId,
              senderName: sender.fullName,
              messageId: newMessage._id
            }
          });
        }
      }

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
            sender.fullName,
            newMessage,
            sender.profilePic
          );
        }
      }

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
