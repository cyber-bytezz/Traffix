// SOS Service for managing SOS click count
class SosService {
  static STORAGE_KEY = 'traffic_sos_count';

  // Get current SOS count
  static getSosCount() {
    try {
      const count = localStorage.getItem(this.STORAGE_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error('Error getting SOS count:', error);
      return 0;
    }
  }

  // Increment SOS count
  static incrementSosCount() {
    try {
      const currentCount = this.getSosCount();
      const newCount = currentCount + 1;
      localStorage.setItem(this.STORAGE_KEY, newCount.toString());
      return newCount;
    } catch (error) {
      console.error('Error incrementing SOS count:', error);
      return 0;
    }
  }

  // Reset SOS count (for testing purposes)
  static resetSosCount() {
    try {
      localStorage.setItem(this.STORAGE_KEY, '0');
      return 0;
    } catch (error) {
      console.error('Error resetting SOS count:', error);
      return 0;
    }
  }

  // Set SOS count to a specific value
  static setSosCount(count) {
    try {
      localStorage.setItem(this.STORAGE_KEY, count.toString());
      return count;
    } catch (error) {
      console.error('Error setting SOS count:', error);
      return 0;
    }
  }
}

export default SosService; 