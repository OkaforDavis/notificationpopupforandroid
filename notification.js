/**
 * NotifyPopup - In-app notification popup system
 * A lightweight notification popup system for web applications
 * Works great on mobile devices including Android
 * 
 * NOTE: Named "NotifyPopup" to avoid overwriting the browser's native Notification API
 */

const NotifyPopup = (() => {
    // Configuration
    const config = {
        defaultDuration: 5000, // milliseconds
        animationDuration: 400, // milliseconds
        maxNotifications: 5,
    };

    // Icons for different notification types (SVG-based for crisp rendering)
    const icons = {
        success: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="currentColor" opacity="0.15"/><path d="M6.5 11.5L9.5 14.5L15.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        error: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="currentColor" opacity="0.15"/><path d="M8 8L14 14M14 8L8 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        warning: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L21 20H1L11 2Z" fill="currentColor" opacity="0.15"/><path d="M11 9V13M11 16V16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        info: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="currentColor" opacity="0.15"/><path d="M11 10V16M11 7V7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
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
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        notificationDiv.innerHTML = `
            <div class="notification-icon-wrap">
                <div class="notification-icon">${icon}</div>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <div class="notification-title">${escapeHtml(title)}</div>
                    <span class="notification-time">${timestamp}</span>
                </div>
                ${message ? `<div class="notification-message">${escapeHtml(message)}</div>` : ''}
                <div class="notification-progress-bar"><div class="notification-progress-fill"></div></div>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
        `;

        // Close button functionality
        const closeBtn = notificationDiv.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notificationDiv);
        });

        // Swipe to dismiss on mobile
        let startX = 0;
        let currentX = 0;
        notificationDiv.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        notificationDiv.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            if (diff > 0) {
                notificationDiv.style.transform = `translateX(${diff}px)`;
                notificationDiv.style.opacity = Math.max(0, 1 - diff / 200);
            }
        }, { passive: true });
        notificationDiv.addEventListener('touchend', () => {
            const diff = currentX - startX;
            if (diff > 100) {
                removeNotification(notificationDiv);
            } else {
                notificationDiv.style.transform = '';
                notificationDiv.style.opacity = '';
            }
        });

        return notificationDiv;
    };

    /**
     * Remove a notification with animation
     */
    const removeNotification = (element) => {
        if (element.classList.contains('removing')) return;
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
        const notifications = container.querySelectorAll('.notification:not(.removing)');
        
        if (notifications.length > config.maxNotifications) {
            for (let i = 0; i < notifications.length - config.maxNotifications; i++) {
                removeNotification(notifications[i]);
            }
        }
    };

    /**
     * Play notification sound (subtle)
     */
    const playSound = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const frequencies = {
                success: [523, 659],
                error: [330, 262],
                warning: [440, 440],
                info: [523, 523],
            };
            
            const freqs = frequencies[type] || frequencies.info;
            oscillator.frequency.setValueAtTime(freqs[0], ctx.currentTime);
            oscillator.frequency.setValueAtTime(freqs[1], ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch(e) {
            // Sound not critical
        }
    };

    /**
     * Trigger device vibration on Android
     */
    const vibrate = (type) => {
        if ('vibrate' in navigator) {
            const patterns = {
                success: [50],
                error: [100, 50, 100],
                warning: [80, 40, 80],
                info: [30],
            };
            navigator.vibrate(patterns[type] || [30]);
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

        // Play feedback
        playSound(type);
        vibrate(type);

        // Auto-dismiss if duration is specified
        if (duration === null) {
            duration = config.defaultDuration;
        }

        // Animate the progress bar
        if (duration > 0) {
            const progressFill = notificationElement.querySelector('.notification-progress-fill');
            if (progressFill) {
                progressFill.style.transition = `width ${duration}ms linear`;
                requestAnimationFrame(() => {
                    progressFill.style.width = '0%';
                });
            }

            setTimeout(() => {
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
                console.log('✓ Notification system initialized');
            })
            .catch(err => {
                console.warn('Service Worker registration failed:', err);
            });
    }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotifyPopup;
}
