/**
 * Android Notification System
 * Sends native Android notifications using the Web Notification API
 * Works on Android Chrome, Firefox, Samsung Internet, and PWA
 */

const AndroidNotification = (() => {
    // Check if notifications are supported
    const isSupported = () => {
        return 'Notification' in window && 'serviceWorker' in navigator;
    };

    // Initialize service worker for background notifications
    const initializeServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered for notifications:', registration);
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    };

    // Icons for different notification types (base64 encoded or emoji)
    const getIcon = (type) => {
        // Use emoji icons for simplicity, or use image URLs
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ⓘ'
        };
        return icons[type] || icons.info;
    };

    /**
     * Send a native Android notification
     * @param {string} title - Notification title
     * @param {object} options - Notification options
     */
    const sendNative = (title, options = {}) => {
        if (!isSupported()) {
            console.warn('Notifications not supported on this device');
            return false;
        }

        // Check permission
        if (Notification.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return false;
        }

        try {
            const defaultOptions = {
                icon: '/icon-192x192.png',
                badge: '/badge-72x72.png',
                requireInteraction: false,
                tag: 'notification-' + Date.now(),
                ...options
            };

            // Send the notification
            const notification = new Notification(title, defaultOptions);

            // Handle notification click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Failed to send notification:', error);
            return false;
        }
    };

    /**
     * Request notification permission
     */
    const requestPermission = async () => {
        if (!isSupported()) {
            console.warn('Notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            try {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                return false;
            }
        }

        return false;
    };

    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    const success = (title, message = '') => {
        return sendNative(title, {
            body: message,
            tag: 'notification-success',
            badge: '/badge-success.png',
            icon: '/icon-success.png'
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
            badge: '/badge-error.png',
            icon: '/icon-error.png',
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
            tag: 'notification-warning',
            badge: '/badge-warning.png',
            icon: '/icon-warning.png'
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
            tag: 'notification-info',
            badge: '/badge-info.png',
            icon: '/icon-info.png'
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
