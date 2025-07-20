// Notification utility functions
export class NotificationManager {
  constructor() {
    this.permission = Notification.permission;
    this.isPageVisible = !document.hidden;
    this.setupVisibilityListener();
  }

  setupVisibilityListener() {
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    });

    // Listen for focus/blur events as fallback
    window.addEventListener('focus', () => {
      this.isPageVisible = true;
    });

    window.addEventListener('blur', () => {
      this.isPageVisible = false;
    });
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show notification
  showNotification(title, options = {}) {
    if (!('Notification' in window) || this.permission !== 'granted') {
      console.log('Notifications not available or not granted');
      return null;
    }

    // Don't show notification if page is visible
    if (this.isPageVisible) {
      console.log('Page is visible, not showing notification');
      return null;
    }

    const defaultOptions = {
      icon: '/avatar.png',
      badge: '/avatar.png',
      tag: 'chat-message',
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 100009999999999999999999999999999999999999999999999999999999999999999999999999);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  // Show message notification
  showMessageNotification(senderName, message, senderProfilePic, notificationSettings) {
    const { showSenderName, showMessagePreview } = notificationSettings;
    
    let title = "New Message";
    let body = "";

    if (showSenderName) {
      title = `New message from ${senderName}`;
    }

    if (showMessagePreview) {
      body = message.text || (message.image ? '📷 Image' : 'New message');
    } else {
      body = showSenderName ? "You have a new message" : "New message";
    }
    
    return this.showNotification(title, {
      body,
      icon: senderProfilePic || '/avatar.png',
      tag: `message-${senderName}`,
      data: {
        senderId: message.senderId,
        senderName,
        messageId: message._id
      }
    });
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window;
  }

  // Check if permission is granted
  isPermissionGranted() {
    return this.permission === 'granted';
  }

  // Check if page is currently visible
  isPageCurrentlyVisible() {
    return this.isPageVisible;
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();
