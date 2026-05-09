/**
 * Notification System
 * A lightweight notification popup system for web applications
 * Works great on mobile devices including Android
 */

const Notification = (() => {
    // Configuration
    const config = {
        defaultDuration: 4000, // milliseconds
        animationDuration: 300, // milliseconds
        maxNotifications: 5,
    };

    // Icons for different notification types
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ⓘ',
    };

    /**
     * Get or create the notification container
     */
    const getContainer = () => {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    };

    /**
     * Create a notification element
     */
    const createNotificationElement = (title, message, type = 'info') => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${type}`;

        const icon = icons[type] || icons.info;

        notificationDiv.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${escapeHtml(title)}</div>
                ${message ? `<div class="notification-message">${escapeHtml(message)}</div>` : ''}
            </div>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Close button functionality
        const closeBtn = notificationDiv.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notificationDiv);
        });

        return notificationDiv;
    };

    /**
     * Remove a notification with animation
     */
    const removeNotification = (element) => {
        element.classList.add('removing');
        setTimeout(() => {
            element.remove();
        }, config.animationDuration);
    };

    /**
     * Escape HTML to prevent XSS
     */
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /**
     * Check and remove old notifications if exceeding max
     */
    const checkMaxNotifications = () => {
        const container = getContainer();
        const notifications = container.querySelectorAll('.notification');
        
        while (notifications.length > config.maxNotifications) {
            const oldest = notifications[0];
            removeNotification(oldest);
            notifications.forEach((el, idx) => {
                notifications[idx] = el;
            });
        }
    };

    /**
     * Show a notification
     * @param {string} title - The notification title
     * @param {string} message - The notification message
     * @param {string} type - The notification type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - How long to show the notification in milliseconds (0 = manual dismiss only)
     */
    const show = (title, message = '', type = 'info', duration = null) => {
        // Validate type
        if (!['success', 'error', 'warning', 'info'].includes(type)) {
            type = 'info';
        }

        // Create notification element
        const notificationElement = createNotificationElement(title, message, type);

        // Add to container
        const container = getContainer();
        container.appendChild(notificationElement);

        // Check max notifications
        checkMaxNotifications();

        // Auto-dismiss if duration is specified
        if (duration === null) {
            duration = config.defaultDuration;
        }

        if (duration > 0) {
            setTimeout(() => {
                // Check if element still exists (user might have closed it)
                if (document.body.contains(notificationElement)) {
                    removeNotification(notificationElement);
                }
            }, duration);
        }

        return notificationElement;
    };

    /**
     * Show success notification
     */
    const success = (title, message = '', duration = null) => {
        return show(title, message, 'success', duration);
    };

    /**
     * Show error notification
     */
    const error = (title, message = '', duration = null) => {
        return show(title, message, 'error', duration);
    };

    /**
     * Show warning notification
     */
    const warning = (title, message = '', duration = null) => {
        return show(title, message, 'warning', duration);
    };

    /**
     * Show info notification
     */
    const info = (title, message = '', duration = null) => {
        return show(title, message, 'info', duration);
    };

    /**
     * Clear all notifications
     */
    const clearAll = () => {
        const container = getContainer();
        const notifications = container.querySelectorAll('.notification');
        notifications.forEach(notif => {
            removeNotification(notif);
        });
    };

    /**
     * Set configuration options
     */
    const setConfig = (options) => {
        Object.assign(config, options);
    };

    /**
     * Get current configuration
     */
    const getConfig = () => {
        return { ...config };
    };

    // Public API
    return {
        show,
        success,
        error,
        warning,
        info,
        clearAll,
        setConfig,
        getConfig,
    };
})();

/**
 * Initialize notification system
 * Call this on page load
 */
function initializeNotifications() {
    // Register service worker for notifications
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Notification system initialized');
            })
            .catch(err => {
                console.warn('Service Worker registration failed:', err);
            });
    }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notification;
}
