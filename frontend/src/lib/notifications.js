// Notification utility functions
export class NotificationManager {
  constructor() {
    this.permission = Notification.permission;
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

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  // Show notification
  showNotification(title, options = {}) {
    if (!('Notification' in window) || this.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      icon: '/avatar.png',
      badge: '/avatar.png',
      tag: 'chat-message',
      requireInteraction: false,
      silent: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  // Show message notification
  showMessageNotification(senderName, message, senderProfilePic) {
    const title = `New message from ${senderName}`;
    const body = message.text || (message.image ? '📷 Image' : 'New message');
    
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
}

// Create singleton instance
export const notificationManager = new NotificationManager();

// Page visibility detection
export class PageVisibilityManager {
  constructor() {
    this.isVisible = !document.hidden;
    this.callbacks = [];
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      this.callbacks.forEach(callback => callback(this.isVisible));
    });

    // Listen for focus/blur events as fallback
    window.addEventListener('focus', () => {
      this.isVisible = true;
      this.callbacks.forEach(callback => callback(true));
    });

    window.addEventListener('blur', () => {
      this.isVisible = false;
      this.callbacks.forEach(callback => callback(false));
    });
  }

  // Add callback for visibility changes
  onVisibilityChange(callback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  // Check if page is currently visible
  isPageVisible() {
    return this.isVisible;
  }
}

// Create singleton instance
export const pageVisibilityManager = new PageVisibilityManager();