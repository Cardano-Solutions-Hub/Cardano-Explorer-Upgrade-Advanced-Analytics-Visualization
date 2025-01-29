// Helper function to get the start and end dates of today
function getTodayDateRange() {
    const today = new Date();
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
  
    // Set to the start of today (00:00:00)
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to the end of today (23:59:59)
    endOfDay.setHours(23, 59, 59, 999);
  
    return { start: startOfDay, end: endOfDay };
  }

export default getTodayDateRange