/**
 * Android Notification System
 * Sends native Android notifications using the Web Notification API
 * Works on Android Chrome, Firefox, Samsung Internet, and PWA
 */

const AndroidNotification = (() => {
    // Check if notifications are supported
    const isSupported = () => {
        return 'Notification' in window;
    };

    // Initialize service worker for background notifications
    const initializeServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js', { scope: '/' });
                console.log('✓ Service Worker registered:', registration);
                return true;
            } catch (error) {
                console.warn('⚠ Service Worker registration failed (optional):', error.message);
                // This is OK - notifications still work without it
                return false;
            }
        }
    };

    // Create emoji data URI for icon
    const createEmojiIcon = (emoji) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.font = '60px Arial';
        ctx.fillText(emoji, 20, 70);
        return canvas.toDataURL();
    };

    /**
     * Send a native Android notification
     * @param {string} title - Notification title
     * @param {object} options - Notification options
     */
    const sendNative = (title, options = {}) => {
        if (!isSupported()) {
            console.warn('✗ Notifications not supported on this device');
            return null;
        }

        // Check permission
        if (Notification.permission !== 'granted') {
            console.warn('✗ Notification permission not granted. Request permission first.');
            return null;
        }

        try {
            const defaultOptions = {
                requireInteraction: false,
                tag: 'notification-' + Date.now(),
                ...options
            };

            // Don't include icon if it's an invalid path - let Android use default
            if (defaultOptions.icon && defaultOptions.icon.startsWith('/')) {
                delete defaultOptions.icon;
            }
            if (defaultOptions.badge && defaultOptions.badge.startsWith('/')) {
                delete defaultOptions.badge;
            }

            console.log('📤 Sending notification:', { title, ...defaultOptions });

            // Send the notification
            const notification = new Notification(title, defaultOptions);

            // Handle notification click
            notification.onclick = () => {
                console.log('Notification clicked');
                window.focus();
                notification.close();
            };

            notification.onshow = () => {
                console.log('✓ Notification shown');
            };

            notification.onerror = (error) => {
                console.error('✗ Notification error:', error);
            };

            console.log('✓ Notification sent successfully');
            return notification;
        } catch (error) {
            console.error('✗ Failed to send notification:', error);
            return null;
        }
    };

    /**
     * Request notification permission
     */
    const requestPermission = async () => {
        if (!isSupported()) {
            console.warn('✗ Notifications not supported');
            return false;
        }

        console.log('📋 Current permission:', Notification.permission);

        if (Notification.permission === 'granted') {
            console.log('✓ Notifications already granted');
            return true;
        }

        if (Notification.permission === 'denied') {
            console.warn('✗ User has blocked notifications. Enable in browser settings.');
            return false;
        }

        // Permission is 'default' - ask user
        try {
            console.log('🔔 Requesting notification permission...');
            const permission = await Notification.requestPermission();
            console.log('✓ Permission result:', permission);
            return permission === 'granted';
        } catch (error) {
            console.error('✗ Error requesting permission:', error);
            return false;
        }
    };

    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    const success = (title, message = '') => {
        return sendNative(title, {
            body: message,
            tag: 'notification-success'
        });
    };

    /**
     * Show error notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    const error = (title, message = '') => {
        return sendNative(title, {
            body: message,
            tag: 'notification-error',
            requireInteraction: true  // Don't auto-dismiss errors
        });
    };

    /**
     * Show warning notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    const warning = (title, message = '') => {
        return sendNative(title, {
            body: message,
            tag: 'notification-warning'
        });
    };

    /**
     * Show info notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    const info = (title, message = '') => {
        return sendNative(title, {
            body: message,
            tag: 'notification-info'
        });
    };

    /**
     * Close a specific notification
     */
    const close = (tag) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.controller?.postMessage({
                type: 'CLOSE_NOTIFICATION',
                tag: tag
            });
        }
    };

    /**
     * Close all notifications
     */
    const closeAll = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.controller?.postMessage({
                type: 'CLOSE_ALL_NOTIFICATIONS'
            });
        }
    };

    // Initialize on load
    if (isSupported()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeServiceWorker);
        } else {
            initializeServiceWorker();
        }
    }

    // Public API
    return {
        sendNative,
        success,
        error,
        warning,
        info,
        requestPermission,
        close,
        closeAll,
        isSupported
    };
})();

// Make it globally available
window.AndroidNotification = AndroidNotification;

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AndroidNotification;
}
