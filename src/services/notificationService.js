// Notification Service for Traffic Violation System
// This service handles SMS notifications and other notification types

class NotificationService {
  // Send SMS notification to violator
  static async sendSMSNotification(mobileNumber, violationData) {
    try {
      // In a real application, this would integrate with an SMS service like Twilio, AWS SNS, etc.
      const message = this.formatSMSMessage(violationData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just log the message
      console.log(`SMS sent to ${mobileNumber}: ${message}`);
      
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        message: message
      };
    } catch (error) {
      console.error('SMS notification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format SMS message
  static formatSMSMessage(violationData) {
    const { violatorName, violationType, date, time, vehicleNumber, ticketNumber } = violationData;
    
    return `Dear ${violatorName}, a traffic violation ticket (${ticketNumber || 'TKT' + Date.now()}) has been issued for ${violationType} on ${date} at ${time}. Vehicle: ${vehicleNumber}. Please pay the fine within 30 days. Contact traffic department for details.`;
  }

  // Send email notification (for future use)
  static async sendEmailNotification(email, violationData) {
    try {
      // In a real application, this would integrate with an email service
      const subject = 'Traffic Violation Notice';
      const message = this.formatEmailMessage(violationData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Email sent to ${email}: ${subject}`);
      
      return {
        success: true,
        messageId: `email_${Date.now()}`,
        subject: subject,
        message: message
      };
    } catch (error) {
      console.error('Email notification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format email message
  static formatEmailMessage(violationData) {
    const { violatorName, violationType, date, time, vehicleNumber, ticketNumber } = violationData;
    
    return `
      Dear ${violatorName},
      
      This is to inform you that a traffic violation ticket has been issued against your vehicle.
      
      Ticket Details:
      - Ticket Number: ${ticketNumber || 'TKT' + Date.now()}
      - Violation Type: ${violationType}
      - Date: ${date}
      - Time: ${time}
      - Vehicle Number: ${vehicleNumber}
      
      Please ensure timely payment of the fine to avoid additional penalties.
      
      Best regards,
      Traffic Management System
    `;
  }

  // Validate mobile number format
  static validateMobileNumber(mobileNumber) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobileNumber);
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default NotificationService; 