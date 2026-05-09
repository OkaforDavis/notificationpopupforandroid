# Configuration Guide

## Customize Your Notification System

### Default Configuration

```javascript
Notification.setConfig({
    defaultDuration: 4000,      // Auto-dismiss after 4 seconds
    animationDuration: 300,     // Animation speed in milliseconds
    maxNotifications: 5,        // Maximum simultaneous notifications
});
```

### Duration Options

The `duration` parameter (in milliseconds) controls how long a notification displays:

```javascript
// Quick notification (2 seconds)
Notification.success('Saved', 'Your changes have been saved', 2000);

// Long notification (10 seconds)
Notification.error('Error', 'A serious error occurred', 10000);

// No auto-dismiss (requires user to click close)
Notification.warning('Important', 'This requires your attention', 0);

// Use default duration
Notification.info('Quick update'); // Uses 4000ms (default)
Notification.info('Quick update', 'message'); // Uses 4000ms
```

### Max Notifications

Control how many notifications can appear at the same time:

```javascript
// Show only 1 notification (new ones replace old)
Notification.setConfig({ maxNotifications: 1 });

// Standard: Show up to 3
Notification.setConfig({ maxNotifications: 3 });

// Aggressive: Show up to 5
Notification.setConfig({ maxNotifications: 5 });

// Conservative: Show only 1 for critical alerts
Notification.setConfig({ maxNotifications: 1 });
Notification.error('Critical Alert', 'This is important', 0);
```

### Animation Speed

Adjust how fast notifications slide in and out:

```javascript
// Faster animations (good for snappy feeling)
Notification.setConfig({ animationDuration: 150 });

// Standard animations
Notification.setConfig({ animationDuration: 300 });

// Slower animations (dramatic effect)
Notification.setConfig({ animationDuration: 600 });
```

---

## CSS Customization

### Position the Notifications

Edit `.notification-container` in `styles.css`:

```css
/* Top-right (default) */
.notification-container {
    top: 20px;
    right: 20px;
}

/* Top-left */
.notification-container {
    top: 20px;
    left: 20px;
}

/* Bottom-right */
.notification-container {
    bottom: 20px;
    right: 20px;
}

/* Bottom-left */
.notification-container {
    bottom: 20px;
    left: 20px;
}

/* Center-top */
.notification-container {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
}
```

### Color Scheme

Edit the CSS variables at the top of `styles.css`:

```css
:root {
    /* Main brand color */
    --primary-color: #007AFF;

    /* Notification type colors */
    --success-color: #34C759;   /* Green */
    --error-color: #FF3B30;     /* Red */
    --warning-color: #FF9500;   /* Orange */
    --info-color: #5AC8FA;      /* Blue */

    /* Background colors */
    --dark-bg: #1a1a1a;
    --light-bg: #f5f5f5;

    /* Text colors */
    --text-dark: #333;
    --text-light: #666;

    /* Shadow effects */
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

### Custom Color Theme

Create your own color scheme:

```css
:root {
    --success-color: #06d6a0;   /* Teal */
    --error-color: #e63946;     /* Deep Red */
    --warning-color: #f77f00;   /* Deep Orange */
    --info-color: #2a9d8f;      /* Sea Green */
}
```

### Dark Mode

Add dark mode support:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --text-dark: #f0f0f0;
        --text-light: #ccc;
        --light-bg: #2a2a2a;
        --dark-bg: #1a1a1a;
    }

    body {
        background: #1a1a1a;
    }

    .container {
        background: #2a2a2a;
        color: #f0f0f0;
    }
}
```

### Notification Size

Adjust notification dimensions:

```css
/* Make notifications smaller */
.notification {
    padding: 8px;          /* Reduce from 16px */
    gap: 6px;              /* Reduce from 12px */
    font-size: 12px;       /* Smaller text */
}

.notification-title {
    font-size: 13px;       /* Reduce from 15px */
}

.notification-message {
    font-size: 11px;       /* Reduce from 13px */
}
```

### Notification Border Radius

Change the notification shape:

```css
/* Rounded corners (default) */
.notification {
    border-radius: 12px;
}

/* Very rounded (pill-shaped) */
.notification {
    border-radius: 20px;
}

/* Sharp corners */
.notification {
    border-radius: 0px;
}

/* Material Design style */
.notification {
    border-radius: 4px;
}
```

---

## Advanced Customization

### Custom Animation

Replace the built-in animations:

```css
/* Fade in instead of slide */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.notification {
    animation: fadeIn 0.3s ease forwards;
}

/* Pop animation */
@keyframes popIn {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.notification {
    animation: popIn 0.3s ease forwards;
}
```

### Custom Styling Per Type

Style each notification type differently:

```css
/* Success notifications - icon background */
.notification.success .notification-icon {
    background: rgba(52, 199, 89, 0.2);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Error notifications - bold text */
.notification.error .notification-title {
    font-weight: 900;
}

/* Warning notifications - uppercase */
.notification.warning .notification-title {
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

### Notification with Progress Bar

Add a progress indicator:

```css
.notification {
    position: relative;
    overflow: hidden;
}

.notification::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    animation: shrink 4s linear forwards;
}

@keyframes shrink {
    from { width: 100%; }
    to { width: 0; }
}
```

### Notification with Icon Background

Create a box for the icon:

```css
.notification-icon {
    background: rgba(52, 199, 89, 0.15);  /* Color by type */
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification.error .notification-icon {
    background: rgba(255, 59, 48, 0.15);
}

.notification.warning .notification-icon {
    background: rgba(255, 149, 0, 0.15);
}

.notification.info .notification-icon {
    background: rgba(90, 200, 250, 0.15);
}
```

---

## Performance Optimization

### Reduce Animation Duration for Low-End Devices

```javascript
// Detect device performance
const isLowEndDevice = () => {
    const cores = navigator.hardwareConcurrency || 1;
    return cores <= 2;
};

// Set appropriate animation speed
if (isLowEndDevice()) {
    Notification.setConfig({ animationDuration: 100 });
} else {
    Notification.setConfig({ animationDuration: 300 });
}
```

### Disable Animations for Users Who Prefer Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    .notification {
        animation: none;
        opacity: 1;
        transform: none;
    }

    .notification.removing {
        animation: none;
    }
}
```

### Optimize for Mobile

```javascript
// Reduce max notifications on mobile
const isMobile = window.innerWidth <= 480;
Notification.setConfig({
    maxNotifications: isMobile ? 2 : 5,
    defaultDuration: isMobile ? 3000 : 4000
});
```

---

## Configuration Profiles

### Web App Profile

```javascript
Notification.setConfig({
    defaultDuration: 3000,
    maxNotifications: 3,
    animationDuration: 200
});
```

### Mobile App Profile

```javascript
Notification.setConfig({
    defaultDuration: 2500,
    maxNotifications: 2,
    animationDuration: 150
});
```

### Critical Alerts Profile

```javascript
Notification.setConfig({
    defaultDuration: 0,         // Manual dismiss only
    maxNotifications: 1,        // One at a time
    animationDuration: 400      // Slow animation for attention
});
```

### Fast Feedback Profile

```javascript
Notification.setConfig({
    defaultDuration: 1500,
    maxNotifications: 5,
    animationDuration: 100      // Quick animation
});
```

---

## Responsive Design

Customize for different screen sizes:

```css
/* Mobile (small phones) */
@media (max-width: 360px) {
    .notification-container {
        top: 5px;
        right: 5px;
        left: 5px;
        width: calc(100% - 10px);
    }

    .notification {
        padding: 10px;
    }
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1024px) {
    .notification-container {
        max-width: 450px;
    }
}

/* Large Desktop */
@media (min-width: 1200px) {
    .notification-container {
        max-width: 500px;
    }
}
```

---

## Best Practices

✅ **Keep it consistent** - Don't change config too often  
✅ **Test on real devices** - Mobile rendering varies  
✅ **Consider accessibility** - Use enough contrast and size  
✅ **Respect user preferences** - Honor `prefers-reduced-motion`  
✅ **Profile before optimizing** - Measure actual performance  
✅ **Use semantic HTML** - For better accessibility

---

## Need Help?

- Check [QUICK_START.md](QUICK_START.md) for common use cases
- See [examples.html](examples.html) for working code
- Review [README.md](README.md) for complete API docs
