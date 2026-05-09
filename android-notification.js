/**
 * Android Notification System
 * Sends native Android notifications using the Web Notification API
 * Falls back to in-app popup notifications (NotifyPopup) when native isn't available
 * Works on Android Chrome, Firefox, Samsung Internet, and PWA
 */

// Save a reference to the browser's native Notification API before anything can overwrite it
const NativeNotification = window.Notification;

const AndroidNotification = (() => {
    // Check if native notifications are supported
    const isNativeSupported = () => {
        return typeof NativeNotification !== 'undefined';
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
                return false;
            }
        }
    };

    /**
     * Send a native Android notification + always show in-app popup
     * @param {string} title - Notification title
     * @param {string} type - success, error, warning, info
     * @param {object} options - Notification options
     */
    const sendNative = (title, type = 'info', options = {}) => {
        // Always show the in-app popup notification (this always works)
        if (typeof NotifyPopup !== 'undefined') {
            NotifyPopup.show(title, options.body || '', type);
        }

        // Also try to send native notification if permission granted
        if (isNativeSupported() && NativeNotification.permission === 'granted') {
            try {
                const nativeOpts = {
                    body: options.body || '',
                    requireInteraction: false,
                    tag: options.tag || 'notification-' + Date.now(),
                    silent: false
                };

                // Try service worker notification first (works better on Android)
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(title, nativeOpts).catch(() => {
                            // Fallback to direct notification
                            new NativeNotification(title, nativeOpts);
                        });
                    });
                } else {
                    const notification = new NativeNotification(title, nativeOpts);
                    notification.onclick = () => {
                        window.focus();
                        notification.close();
                    };
                }

                console.log('✓ Native notification sent');
                return true;
            } catch (error) {
                console.warn('Native notification failed, using in-app popup:', error);
                return true; // In-app popup already shown
            }
        }

        return true; // In-app popup was shown
    };

    /**
     * Request notification permission
     */
    const requestPermission = async () => {
        if (!isNativeSupported()) {
            console.warn('Native notifications not supported — using in-app popups');
            return false;
        }

        if (NativeNotification.permission === 'granted') {
            return true;
        }

        if (NativeNotification.permission === 'denied') {
            console.warn('User has blocked notifications. Enable in browser settings.');
            return false;
        }

        try {
            const permission = await NativeNotification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting permission:', error);
            return false;
        }
    };

    /**
     * Get current permission state
     */
    const getPermission = () => {
        if (!isNativeSupported()) return 'unsupported';
        return NativeNotification.permission;
    };

    /**
     * Show success notification
     */
    const success = (title, message = '') => {
        return sendNative(title, 'success', {
            body: message,
            tag: 'notification-success-' + Date.now()
        });
    };

    /**
     * Show error notification
     */
    const error = (title, message = '') => {
        return sendNative(title, 'error', {
            body: message,
            tag: 'notification-error-' + Date.now(),
            requireInteraction: true
        });
    };

    /**
     * Show warning notification
     */
    const warning = (title, message = '') => {
        return sendNative(title, 'warning', {
            body: message,
            tag: 'notification-warning-' + Date.now()
        });
    };

    /**
     * Show info notification
     */
    const info = (title, message = '') => {
        return sendNative(title, 'info', {
            body: message,
            tag: 'notification-info-' + Date.now()
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
        // Also clear in-app popups
        if (typeof NotifyPopup !== 'undefined') {
            NotifyPopup.clearAll();
        }
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeServiceWorker);
    } else {
        initializeServiceWorker();
    }

    // Public API
    return {
        sendNative,
        success,
        error,
        warning,
        info,
        requestPermission,
        getPermission,
        close,
        closeAll,
        isNativeSupported
    };
})();

// Make it globally available
window.AndroidNotification = AndroidNotification;

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AndroidNotification;
}
