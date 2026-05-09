# 🔔 Android Notification System for Android 16+

A complete web system that sends **native Android notifications** just like BetApps, SoccerScore, and other professional apps.

## 🎯 Key Features

✅ **Native Android Notifications** - Appears in Android notification center  
✅ **System Integration** - Works with Android lock screen notifications  
✅ **Background Notifications** - Service Worker handles background messages  
✅ **PWA Ready** - Can be installed as a standalone app on Android  
✅ **Multiple Types** - Success, Error, Warning, and Info notifications  
✅ **No Dependencies** - Pure JavaScript and Web APIs  
✅ **Works Offline** - Service Worker caches everything  
✅ **Android 16+ Compatible** - Uses latest Web APIs  

## 📱 What It Does

When you use this system:

1. **User enables notifications** - One-time permission on first use
2. **Action completes** - Your code sends a notification
3. **Native Android notification appears** - Shows in notification center like native apps
4. **User interacts** - Can tap to focus the app or dismiss

Just like:
- ⚽ **SoccerScore**: "⚽ GOAL! Messi scored at 45' - Score 2-1"
- 💰 **BetApps**: "💰 Bet Confirmed - Wager: $50 | Odds: 2.5"
- 📱 **Messaging**: Notifications on lock screen and notification center

## 🚀 Getting Started

### Step 1: Request Permission

Show a button to enable notifications:

```html
<button onclick="requestNotificationPermission()">
    Enable Notifications
</button>

<script src="android-notification.js"></script>
<script>
    function requestNotificationPermission() {
        AndroidNotification.requestPermission().then(granted => {
            if (granted) {
                console.log('Notifications enabled!');
            }
        });
    }
</script>
```

### Step 2: Send Notifications

After user enables notifications, send them from your code:

```javascript
// Success notification
AndroidNotification.success(
    'Upload Complete ✓',
    'Your file has been uploaded successfully'
);

// Error notification
AndroidNotification.error(
    'Connection Failed ✕',
    'Could not connect to server'
);

// Warning notification
AndroidNotification.warning(
    'Warning ⚠',
    'Please check this information'
);

// Info notification
AndroidNotification.info(
    'Update Available ⓘ',
    'A new version is available'
);
```

## 📋 Complete Usage Examples

### Example 1: File Upload with Notification

```javascript
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Send native Android notification
            AndroidNotification.success(
                'Upload Complete ✓',
                `${file.name} uploaded successfully`
            );
        }
    } catch (error) {
        AndroidNotification.error(
            'Upload Failed ✕',
            'Check your connection and try again'
        );
    }
}
```

### Example 2: Game Goal Notification (Like SoccerScore)

```javascript
function onGoal(team, player, minute, score) {
    AndroidNotification.success(
        `⚽ GOAL! ${team}`,
        `${player} scored at ${minute}' - Score: ${score}`
    );
}

// Usage
onGoal('Manchester United', 'Cristiano Ronaldo', '89', '2-1');
// Shows: "⚽ GOAL! Manchester United"
// With body: "Cristiano Ronaldo scored at 89' - Score: 2-1"
```

### Example 3: Betting Confirmation (Like BetApps)

```javascript
function confirmBet(amount, odds, totalWin) {
    AndroidNotification.success(
        '💰 Bet Confirmed',
        `Wager: $${amount} | Odds: ${odds} | Potential Win: $${totalWin}`
    );
}

// Usage
confirmBet(50, 2.5, 125);
// Shows native Android notification with bet details
```

### Example 4: Form Submission

```javascript
document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: new FormData(e.target)
        });
        
        if (response.ok) {
            AndroidNotification.success(
                'Submitted ✓',
                'Your form has been submitted successfully'
            );
            e.target.reset();
        }
    } catch (error) {
        AndroidNotification.error(
            'Error ✕',
            'Failed to submit form. Try again.'
        );
    }
});
```

### Example 5: Real-Time Update Notification

```javascript
// WebSocket or Server-Sent Events
const socket = new WebSocket('wss://api.example.com/updates');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'order_shipped':
            AndroidNotification.success(
                '📦 Order Shipped',
                `Your order #${data.orderId} is on the way`
            );
            break;
            
        case 'message_received':
            AndroidNotification.info(
                '💬 New Message',
                `${data.senderName}: ${data.preview}`
            );
            break;
            
        case 'alert':
            AndroidNotification.warning(
                '⚠ Alert',
                data.message
            );
            break;
    }
};
```

## 📁 File Structure

```
notificationpopupforandroid/
├── index.html                 # Main page with demo buttons
├── android-notification.js    # Native Android notification API
├── sw.js                       # Service Worker for background notifications
├── manifest.json               # PWA manifest for app installation
├── notification.js             # Web popup notifications (optional)
├── styles.css                  # Styling
├── README.md                   # Complete documentation
├── QUICK_START.md              # Quick start guide
├── CONFIGURATION.md            # Advanced configuration
└── ANDROID_SETUP.md            # Android-specific setup guide
```

## 🔧 API Reference

### Permission

```javascript
// Request notification permission
const granted = await AndroidNotification.requestPermission();

// Check if notifications are supported
const isSupported = AndroidNotification.isSupported();
```

### Send Notifications

```javascript
// Success
AndroidNotification.success(title, message);

// Error (requires interaction, doesn't auto-dismiss)
AndroidNotification.error(title, message);

// Warning
AndroidNotification.warning(title, message);

// Info
AndroidNotification.info(title, message);

// Generic with options
AndroidNotification.sendNative(title, {
    body: 'message',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'unique-id',  // Replaces previous notification with same tag
    requireInteraction: false  // Auto-dismiss after notification timeout
});
```

### Close Notifications

```javascript
// Close specific notification by tag
AndroidNotification.close('unique-id');

// Close all notifications
AndroidNotification.closeAll();
```

## 📱 Installation on Android

### Option 1: Chrome / Firefox (Recommended)

1. Open the app in Chrome or Firefox on Android
2. Click the **Enable Notifications** button
3. Grant permission when prompted
4. Tap menu (⋮) → "Install app" or "Add to Home Screen"
5. The app now appears like a native app

### Option 2: Via Web Address

1. Save the URL to your home screen
2. App behaves like native app when opened

### Option 3: As Web App Shortcut

Chrome offers different ways to "install":
- **Home screen shortcut** - Works like a bookmark
- **Standalone mode** - Full-screen without browser UI
- **Installable app** - Via "Add to Home Screen"

## 🎯 When to Use Native Notifications

✅ **User Action Completed**
- File uploaded
- Form submitted
- Payment processed
- Download finished

✅ **Real-Time Updates**
- Score updated (SoccerScore)
- Message received
- Bet confirmed (BetApps)
- Order status changed

✅ **Important Alerts**
- Error occurred
- Network disconnected
- Critical warning
- Action required

✅ **Background Events**
- Push notification received
- Scheduled task completed
- Server event triggered

## ⚙️ Permission Handling

### First Time User

```
1. User opens app
2. UI shows "Enable Notifications" button
3. User clicks button
4. Android system shows permission dialog
5. User grants permission
6. Notifications now work
```

### Permission States

```javascript
// Check current permission
if (Notification.permission === 'granted') {
    // Can send notifications immediately
} else if (Notification.permission === 'denied') {
    // User blocked notifications - show info
} else {
    // Default - need to request
}
```

## 🔐 Security Notes

- Notifications only show if permission is granted
- Users can disable notifications anytime
- Notifications don't require internet (if using Service Worker)
- Data is not sent to any external service
- Everything runs locally on the device

## 🌍 Browser Compatibility

| Browser | Status | Android 16+ | Notifications |
|---------|--------|-------------|---------------|
| Chrome | ✅ Supported | ✅ | ✅ Full |
| Firefox | ✅ Supported | ✅ | ✅ Full |
| Samsung Internet | ✅ Supported | ✅ | ✅ Full |
| Opera | ✅ Supported | ✅ | ✅ Full |
| Edge | ✅ Supported | ✅ | ✅ Full |
| Safari | ⚠️ Limited | ⚠️ iOS only | ⚠️ Partial |

## 🐛 Troubleshooting

### Problem: "Enable Notifications" button doesn't appear

**Solution:**
```javascript
// Check browser support
if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
}

// Check if running on HTTPS or localhost
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('Notifications require HTTPS');
}
```

### Problem: Notifications don't appear on Android

1. **Check permission is granted**
   - Go to Android Settings → Apps → Your App → Permissions
   - Enable "Notifications" or "Post notifications"

2. **Verify HTTPS (if not localhost)**
   - Notifications require secure context
   - Use HTTPS on production

3. **Check app isn't in Do Not Disturb mode**
   - Settings → Sound & Vibration → Do Not Disturb

4. **Ensure Service Worker is registered**
   ```javascript
   navigator.serviceWorker.getRegistrations().then(regs => {
       console.log('Registered Service Workers:', regs.length);
   });
   ```

### Problem: Notifications appear but with wrong icons

Create actual icon files:
```javascript
// Instead of using default, provide your own icons
AndroidNotification.sendNative('Title', {
    body: 'Message',
    icon: '/images/icon-192.png',  // 192x192px PNG
    badge: '/images/badge-72.png'  // 72x72px PNG
});
```

### Problem: Notifications don't persist after app closes

This is expected behavior for most browsers. Use a backend:
- Send Push Notifications from your server
- Use Firebase Cloud Messaging (FCM)
- Implement Web Push Protocol

## 🚀 Advanced: Server Push Notifications

For persistent background notifications, use Web Push:

```javascript
// 1. Get subscription
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_KEY
});

// 2. Send subscription to server
fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
});

// 3. Server sends notifications (requires backend implementation)
```

## 📚 Additional Resources

- [Web Notification API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [Service Worker API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [PWA Manifest MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 📝 License

Free to use for personal and commercial projects.

---

**Ready to add native notifications to your Android app? Start with index.html! 🚀**
