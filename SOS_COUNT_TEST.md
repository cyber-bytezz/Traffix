# SOS Count Tracking Test Guide

## Overview
This guide demonstrates how the SOS button click count is tracked and displayed in real-time across the Traffic Cop Dashboard and Traffic Central Dashboard.

## How It Works

### 1. **SOS Service (sosService.js)**
- **Storage**: Uses localStorage to persist SOS count
- **Methods**:
  - `getSosCount()` - Get current count
  - `incrementSosCount()` - Increment and return new count
  - `resetSosCount()` - Reset to 0 (for testing)
  - `setSosCount(count)` - Set to specific value

### 2. **Traffic Cop Dashboard**
- **SOS Button**: Clicking increments the count
- **Toast Notification**: Shows "🚨 SOS Alert Sent Successfully! (Total: X)"
- **Real-time Update**: Count is immediately saved to localStorage

### 3. **Traffic Central Dashboard**
- **Real-time Display**: Shows current SOS count from localStorage
- **Auto-refresh**: Updates every 2 seconds
- **Live Counter**: Displays in the SOS stat card

## Testing Steps

### Step 1: Initial State
1. Open Traffic Central Dashboard
2. Note the current SOS count (should be 0 initially)
3. Navigate to Traffic Cop Dashboard

### Step 2: Click SOS Button
1. Click the red SOS button in Traffic Cop Dashboard
2. **Expected Result**: 
   - Toast notification: "🚨 SOS Alert Sent Successfully! (Total: 1)"
   - Count increments by 1

### Step 3: Verify Count Update
1. Navigate back to Traffic Central Dashboard
2. **Expected Result**: SOS count should show 1
3. Click SOS button multiple times
4. **Expected Result**: Count should increment each time

### Step 4: Real-time Updates
1. Keep Traffic Central Dashboard open
2. Open Traffic Cop Dashboard in another tab/window
3. Click SOS button in Traffic Cop Dashboard
4. **Expected Result**: Count should update in Traffic Central Dashboard within 2 seconds

## Test Scenarios

### ✅ **Valid Test Cases**
- **Single Click**: SOS count increases by 1
- **Multiple Clicks**: Count increments with each click
- **Cross-tab Updates**: Count syncs between different tabs
- **Page Refresh**: Count persists after page refresh
- **Browser Restart**: Count persists after browser restart

### 🔄 **Real-time Behavior**
- **Update Frequency**: Every 2 seconds
- **Immediate Feedback**: Toast shows current count
- **Persistent Storage**: Count survives page refreshes
- **Cross-component Sync**: Both dashboards show same count

## Sample Test Data

### Expected Count Progression
```
Initial: 0
Click 1: 1
Click 2: 2
Click 3: 3
...
Click 10: 10
```

### Toast Messages
```
🚨 SOS Alert Sent Successfully! (Total: 1)
🚨 SOS Alert Sent Successfully! (Total: 2)
🚨 SOS Alert Sent Successfully! (Total: 3)
...
```

## Technical Implementation

### 1. **localStorage Key**
- **Key**: `traffic_sos_count`
- **Type**: String (converted to number)
- **Default**: 0

### 2. **Component Integration**
- **TrafficCopDashboard**: Imports SosService, calls incrementSosCount()
- **TrafficCentralDashboard**: Imports SosService, uses useEffect to monitor changes

### 3. **Error Handling**
- **localStorage Errors**: Graceful fallback to 0
- **Parsing Errors**: Safe conversion with parseInt()
- **Service Errors**: Console logging for debugging

## Reset Functionality

### For Testing Purposes
```javascript
// In browser console
import SosService from './services/sosService';
SosService.resetSosCount(); // Resets to 0
```

### Manual Reset
```javascript
// In browser console
localStorage.setItem('traffic_sos_count', '0');
```

## Troubleshooting

### Common Issues
1. **Count not updating**: Check if localStorage is enabled
2. **Cross-tab not working**: Ensure both tabs are on same domain
3. **Toast not showing**: Verify React Toastify is properly imported
4. **Count resetting**: Check for localStorage clearing scripts

### Debug Steps
1. Open browser console (F12)
2. Check localStorage: `localStorage.getItem('traffic_sos_count')`
3. Verify SosService: `SosService.getSosCount()`
4. Test increment: `SosService.incrementSosCount()`

## Production Considerations

### 1. **Data Persistence**
- **localStorage**: Client-side only, limited storage
- **Server-side**: Consider database storage for production
- **Backup**: Implement data backup mechanisms

### 2. **Security**
- **Validation**: Server-side validation of SOS requests
- **Rate Limiting**: Prevent spam clicking
- **Authentication**: Verify user permissions

### 3. **Scalability**
- **Real-time Updates**: Consider WebSocket for live updates
- **Multiple Users**: Handle concurrent SOS requests
- **Data Analytics**: Track SOS patterns and trends

## Conclusion
The SOS count tracking system provides real-time synchronization between the Traffic Cop Dashboard and Traffic Central Dashboard, with persistent storage and immediate user feedback through toast notifications. 