# Quick Start Guide

## Get Started in 2 Minutes

### Step 1: Include the Files

Add these lines to your HTML `<head>` tag:

```html
<link rel="stylesheet" href="styles.css">
<script src="notification.js"></script>
```

### Step 2: Show Your First Notification

That's it! Now you can use notifications in your JavaScript code:

```javascript
// After a successful action
Notification.success('Done!', 'Your file has been saved');

// For errors
Notification.error('Oops!', 'Something went wrong');

// For warnings
Notification.warning('Hold on', 'Please confirm before proceeding');

// For information
Notification.info('Quick tip', 'You can save time using keyboard shortcuts');
```

---

## Common Use Cases

### After Form Submission

```html
<form id="myForm" onsubmit="handleSubmit(event)">
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <button type="submit">Submit</button>
</form>

<script>
function handleSubmit(event) {
    event.preventDefault();
    
    // Show success notification
    Notification.success('Form Submitted', 'Thank you! We will be in touch soon.');
    
    // Clear the form
    event.target.reset();
}
</script>
```

### After API Call

```javascript
// Fetch data from server
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        // Show success notification
        Notification.success('Data Loaded', `Got ${data.length} items`);
        updateUI(data);
    })
    .catch(error => {
        // Show error notification
        Notification.error('Load Failed', 'Could not fetch data');
        console.error(error);
    });
```

### After Button Click

```html
<button onclick="deleteItem(123)">Delete</button>

<script>
function deleteItem(id) {
    if (confirm('Are you sure?')) {
        fetch(`/api/items/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    Notification.success('Deleted', 'Item removed successfully');
                } else {
                    Notification.error('Failed', 'Could not delete item');
                }
            });
    }
}
</script>
```

### File Upload

```html
<input type="file" id="fileInput" onchange="uploadFile(event)">

<script>
function uploadFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Show "uploading" message
    Notification.info('Uploading...', `${file.name}`, 0);
    
    fetch('/upload', { method: 'POST', body: formData })
        .then(() => {
            // Clear loading and show success
            Notification.clearAll();
            Notification.success('Uploaded', `${file.name} saved successfully`);
        })
        .catch(() => {
            // Clear loading and show error
            Notification.clearAll();
            Notification.error('Upload Failed', 'Please try again');
        });
}
</script>
```

---

## API Quick Reference

### Show Notification

```javascript
// Basic
Notification.success(title, message);
Notification.error(title, message);
Notification.warning(title, message);
Notification.info(title, message);

// With custom duration
Notification.success(title, message, 3000);  // 3 seconds
Notification.success(title, message, 0);    // Manual dismiss only

// Generic method
Notification.show(title, message, 'success', 3000);
```

### Clear Notifications

```javascript
// Remove all notifications
Notification.clearAll();
```

### Configure Defaults

```javascript
// Change default settings
Notification.setConfig({
    defaultDuration: 5000,      // Auto-dismiss after 5 seconds
    maxNotifications: 3,        // Show max 3 at once
    animationDuration: 300      // Animation speed
});
```

---

## Notification Types

| Type | Color | When to Use |
|------|-------|-------------|
| `success` | 🟢 Green | Successful actions, uploads, logins |
| `error` | 🔴 Red | Errors, failures, validation issues |
| `warning` | 🟠 Orange | Warnings, confirmations, cautions |
| `info` | 🔵 Blue | Tips, information, general updates |

---

## Tips

- ✅ **Keep messages short** - Mobile users have limited screen space
- ✅ **Use appropriate types** - Match the notification to the action
- ✅ **Auto-dismiss short messages** - Let users read quickly
- ✅ **Manual dismiss for errors** - Errors might need user action
- ✅ **Clear old notifications** - Use `clearAll()` before critical messages
- ✅ **Test on mobile** - Always test on actual Android devices

---

## Troubleshooting

**Q: Notifications not showing?**  
A: Make sure both `styles.css` and `notification.js` are included in your HTML.

**Q: Wrong position?**  
A: Notifications appear in the top-right on desktop. On mobile, they center at the top.

**Q: Need them in different position?**  
A: Edit the `.notification-container` CSS in `styles.css`:

```css
.notification-container {
    top: 20px;      /* Change this */
    right: 20px;    /* Or this */
    /* or use: bottom, left, etc. */
}
```

**Q: Want different colors?**  
A: Edit the CSS variables at the top of `styles.css`:

```css
:root {
    --success-color: #34C759;   /* Change to your color */
    --error-color: #FF3B30;
    --warning-color: #FF9500;
    --info-color: #5AC8FA;
}
```

---

## Next Steps

- Open [index.html](index.html) to see the demo
- Check [examples.html](examples.html) for advanced patterns
- Read [README.md](README.md) for complete documentation

---

**Happy coding! 🚀**
