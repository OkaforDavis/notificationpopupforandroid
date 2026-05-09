# Notification Popup System for Android

A lightweight, responsive notification popup system designed for web applications, optimized for mobile devices including Android.

## Features

✨ **Mobile-First Design** - Built with responsive design for small screens  
🎨 **Beautiful UI** - Modern card-based notifications with smooth animations  
⚡ **Lightweight** - No dependencies, minimal JavaScript code  
🎯 **Multiple Types** - Success, Error, Warning, and Info notifications  
🔧 **Flexible Configuration** - Customize duration, max notifications, and more  
♿ **Accessible** - Semantic HTML and proper ARIA labels  
📱 **Touch-Friendly** - Large touch targets and gestures  

## Installation

Simply include the CSS and JavaScript files in your HTML:

```html
<link rel="stylesheet" href="styles.css">
<script src="notification.js"></script>
```

## Usage

### Basic Usage

Show a notification after an action completes:

```javascript
// Success notification
Notification.success('Upload Complete', 'Your file has been uploaded successfully');

// Error notification
Notification.error('Upload Failed', 'Please check your connection and try again');

// Warning notification
Notification.warning('Are you sure?', 'This action cannot be undone');

// Info notification
Notification.info('Heads up', 'New updates are available');
```

### Generic Show Method

```javascript
Notification.show(title, message, type, duration);
```

**Parameters:**
- `title` (string): Notification title
- `message` (string): Notification message (optional)
- `type` (string): One of `'success'`, `'error'`, `'warning'`, `'info'` (default: 'info')
- `duration` (number): How long to show in milliseconds. 0 = manual dismiss only. null = use default (4000ms)

### Examples

```javascript
// Show notification that auto-dismisses after 2 seconds
Notification.success('Done!', 'Operation completed', 2000);

// Show notification that requires manual dismissal
Notification.error('Critical', 'Manual action required', 0);

// Quick notification
Notification.info('Quick message');

// With default timing (4 seconds)
Notification.show('Title', 'Message', 'warning');
```

### Advanced Usage

```javascript
// Clear all notifications
Notification.clearAll();

// Configure defaults
Notification.setConfig({
    defaultDuration: 5000,      // Default dismiss time
    maxNotifications: 3,        // Max simultaneous notifications
    animationDuration: 300      // Animation speed in ms
});

// Get current configuration
const config = Notification.getConfig();
```

## Real-World Examples

### File Upload

```javascript
function uploadFile(file) {
    showProgress(); // Show progress bar
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            hideProgress();
            Notification.success('Upload Complete', `${file.name} uploaded successfully`);
        })
        .catch(err => {
            hideProgress();
            Notification.error('Upload Failed', err.message);
        });
}
```

### Form Submission

```javascript
function submitForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(res => res.json())
    .then(data => {
        Notification.success('Success', 'Form submitted successfully');
        e.target.reset();
    })
    .catch(err => {
        Notification.error('Error', 'Failed to submit form');
    });
}
```

### Data Fetching

```javascript
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        Notification.success('Data Loaded', `Fetched ${data.length} items`);
        return data;
    } catch (error) {
        Notification.error('Load Failed', 'Could not fetch data');
        return null;
    }
}
```

### Delete Confirmation

```javascript
function deleteItem(id) {
    if (confirm('Are you sure?')) {
        fetch(`/api/item/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    Notification.success('Deleted', 'Item has been removed');
                    // Remove from UI
                } else {
                    Notification.error('Delete Failed', 'Could not delete item');
                }
            })
            .catch(err => {
                Notification.error('Error', 'Network error occurred');
            });
    }
}
```

## Styling

### Default Notification Position
Notifications appear in the **top-right corner** on desktop and **top-center** on mobile.

### Customize Colors

Edit `styles.css` to change the color scheme:

```css
:root {
    --primary-color: #007AFF;
    --success-color: #34C759;
    --error-color: #FF3B30;
    --warning-color: #FF9500;
    --info-color: #5AC8FA;
}
```

### Notification Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| `success` | Green (#34C759) | Successful operations |
| `error` | Red (#FF3B30) | Errors and failures |
| `warning` | Orange (#FF9500) | Warnings and cautions |
| `info` | Blue (#5AC8FA) | Information and notices |

## Mobile Optimization

The system is fully optimized for Android:
- **Responsive layout** adapts to all screen sizes
- **Touch-friendly buttons** with large tap targets
- **Smooth animations** that don't drain battery
- **Safe area support** for notches and rounded corners
- **Performance optimized** for lower-end devices

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Android Chrome | ✅ Full support |
| Android Firefox | ✅ Full support |
| Samsung Internet | ✅ Full support |

## File Structure

```
notificationpopupforandroid/
├── index.html          # Demo page with examples
├── notification.js     # Notification system library
├── styles.css          # Styling and responsive design
└── README.md           # This file
```

## Performance

- **Zero dependencies** - Pure JavaScript and CSS
- **Minimal file size** - ~15KB total (uncompressed)
- **Lazy loading** - Container created only when needed
- **Memory efficient** - Auto-cleanup of old notifications
- **GPU accelerated** - CSS animations for smooth performance

## API Reference

### `Notification.show(title, message, type, duration)`
Show a notification with full control.

### `Notification.success(title, message, duration)`
Show a success notification.

### `Notification.error(title, message, duration)`
Show an error notification.

### `Notification.warning(title, message, duration)`
Show a warning notification.

### `Notification.info(title, message, duration)`
Show an info notification.

### `Notification.clearAll()`
Remove all active notifications.

### `Notification.setConfig(options)`
Configure system behavior.

### `Notification.getConfig()`
Get current configuration.

## Tips & Best Practices

1. **Use appropriate types** - Match notification type to the action (success for good news, error for failures)
2. **Keep messages brief** - Mobile screens have limited space
3. **Don't overuse** - Too many notifications can be annoying
4. **Use meaningful titles** - Make the purpose immediately clear
5. **Consider auto-dismiss timing** - Let users read before auto-dismissing
6. **Test on real devices** - Especially on Android devices like phones and tablets

## Troubleshooting

### Notifications not appearing?
- Make sure both `notification.js` and `styles.css` are included
- Check browser console for JavaScript errors
- Verify the notification container is being created

### Styling looks off?
- Clear browser cache (Ctrl+Shift+Delete)
- Check that `styles.css` is loaded before any custom styles
- Ensure no CSS conflicts with your own styles

### Notifications appear in wrong position?
- Check `.notification-container` CSS position
- Verify z-index values if overlapping other elements
- Test in different browsers for compatibility

## License

Free to use for personal and commercial projects.

## Support

For issues, questions, or suggestions, please refer to the inline code comments in the files.

---

**Happy Notifying! 🎉**
