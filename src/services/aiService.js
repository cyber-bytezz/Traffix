// AI Service for Chatbot, Report Generation, and Violation Explanations
class AIService {
  constructor() {
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'mock-key';
    console.log('OpenAI API Key:', this.apiKey);
  }

  // Fine mapping data
  static fineList = [
    { keywords: ['driving without licence', 'without license', 'no license'], label: 'Driving without licence', amount: 5000 },
    { keywords: ['driving without insurance', 'no insurance'], label: 'Driving without insurance', amount: 2000 },
    { keywords: ['pucc', 'pollution'], label: 'Driving without PUCC (Pollution Under Control Certificate)', amount: 10000 },
    { keywords: ['rc violation', 'rc book'], label: 'RC violation', amount: 5000 },
    { keywords: ['drunken', 'drunk', 'influence'], label: 'Driving under the influence/Drunken Driving', amount: 10000 },
    { keywords: ['dangerous'], label: 'Driving Dangerously', amount: 5000 },
    { keywords: ['wrong side', 'against flow'], label: 'Driving against the authorized flow of traffic/Wrong side driving', amount: 1000 },
    { keywords: ['wrong passing', 'overtaking'], label: 'Wrong Passing or Overtaking other Vehicles', amount: 1000 },
    { keywords: ['without helmet', 'no helmet', 'pillion'], label: 'Driving without Helmet (Rider/Pillion Rider)', amount: 1000 },
    { keywords: ['disobeying police', 'disobeying order'], label: 'Disobeying police order or directions', amount: 2000 },
    { keywords: ['emergency vehicle'], label: 'Not giving way to an emergency vehicle', amount: 10000 },
    { keywords: ['nmv', 'no entry', 'one-way'], label: 'Driving in NMV lanes/No entry/One-way roads', amount: 5000 },
    { keywords: ['footpath', 'cycle track'], label: 'Driving/Parking on Footpath/Cycle Track', amount: 2000 },
    { keywords: ['speeding', 'speed', 'over speed'], label: 'Speeding Violation', amount: 2000 },
    { keywords: ['red light', 'signal jump'], label: 'Red Light Violation', amount: 3000 },
    { keywords: ['illegal parking', 'wrong parking'], label: 'Illegal Parking', amount: 1000 },
    { keywords: ['texting', 'mobile phone', 'phone while driving'], label: 'Using Mobile Phone While Driving', amount: 2000 },
    { keywords: ['seatbelt', 'no seatbelt'], label: 'Not Wearing Seatbelt', amount: 1000 },
  ];

  // Main method to send user message and receive intelligent response
  async sendMessage(message, conversationHistory = []) {
    try {
      // 1. Fine amount logic (priority)
      const lowerMessage = message.toLowerCase();
      const foundFines = AIService.fineList.filter(fine =>
        fine.keywords.some(keyword => lowerMessage.includes(keyword))
      );
      if (lowerMessage.includes('fine') || lowerMessage.includes('penalty') || lowerMessage.includes('amount')) {
        if (foundFines.length > 0) {
          const fineMsg = foundFines.map(f => `• ${f.label}: ₹${f.amount.toLocaleString()}`).join('\n');
          return {
            success: true,
            data: {
              message: `Here are the fine amounts for the detected violation(s):\n${fineMsg}`,
              timestamp: new Date().toISOString(),
              id: Date.now()
            }
          };
        } else {
          return {
            success: true,
            data: {
              message: 'Sorry, I could not find a matching violation for your query. Please specify the violation more clearly.',
              timestamp: new Date().toISOString(),
              id: Date.now()
            }
          };
        }
      }

      // 2. Common traffic queries with fallback responses
      const commonResponses = {
        'help with violations': `I can help you with traffic violations! Here are common violations and their consequences:

🚨 **Common Traffic Violations:**
• Speeding: ₹1000-5000 fine, points on license
• Red Light Violation: ₹3000-5000 fine
• No Helmet: ₹1000 fine
• Drunk Driving: ₹10,000 fine + imprisonment
• Wrong Side Driving: ₹1000 fine
• No License: ₹5000 fine
• No Insurance: ₹2000 fine

💡 **Need specific fine amounts?** Ask me about any violation with the word "fine" or "penalty"!`,

        'traffic rules': `Here are the essential traffic rules in India:

🚦 **Traffic Signal Rules:**
• Red Light: Stop completely
• Yellow Light: Stop if safe, don't rush
• Green Light: Proceed with caution

🛣️ **General Rules:**
• Drive on the left side of the road
• Wear seatbelts (driver and front passenger)
• Wear helmets (two-wheeler riders and pillion)
• Don't use mobile phones while driving
• Don't drink and drive
• Follow speed limits
• Give way to emergency vehicles

📱 **Documentation Required:**
• Driving License
• Registration Certificate (RC)
• Insurance Certificate
• Pollution Under Control Certificate (PUCC)

🚨 **Emergency Numbers:**
• Police: 100
• Ambulance: 108
• Fire: 101`,

        'emergency procedures': `🚨 **Emergency Procedures for Traffic Incidents:**

**Immediate Actions:**
1. **Stop your vehicle** safely
2. **Check for injuries** - call 108 for ambulance if needed
3. **Call police** (100) to report the incident
4. **Move vehicles** to safe location if possible
5. **Exchange information** with other parties

**Documentation Required:**
• Driver's license
• Vehicle registration
• Insurance details
• Contact information

**What to Report:**
• Date, time, and location
• Vehicle numbers involved
• Nature of damage/injuries
• Witness statements (if any)

**Emergency Contacts:**
• Police: 100
• Ambulance: 108
• Fire: 101
• Traffic Police: Local station number

**Insurance Claims:**
• Contact your insurance company within 24 hours
• Submit required documents
• Follow up on claim status

**Legal Requirements:**
• File FIR if required
• Attend court hearings if summoned
• Pay fines within stipulated time`,

        'violation': `I can help you understand traffic violations! Here are the main categories:

🚗 **Moving Violations:**
• Speeding
• Red light violations
• Wrong side driving
• Reckless driving
• Drunk driving

🅿️ **Non-Moving Violations:**
• Illegal parking
• No helmet
• No seatbelt
• Expired documents

📋 **Document Violations:**
• Driving without license
• No insurance
• No RC book
• No PUCC certificate

💡 **Need specific information?** Ask me about any violation with details!`,

        'hello': `Hello! I'm your AI traffic management assistant. How can I help you today?

I can assist you with:
• Traffic violation explanations and fines
• Traffic rules and regulations
• Emergency procedures
• Report generation
• General traffic queries

Just ask me anything related to traffic management!`,

        'help': `I'm here to help with all your traffic management needs! Here's what I can do:

📋 **Services Available:**
• Traffic violation explanations
• Fine amount queries
• Traffic rules and regulations
• Emergency procedures
• Report generation
• General traffic guidance

💡 **How to use:**
• Ask about fines: "What's the fine for speeding?"
• Get traffic rules: "Tell me about traffic rules"
• Emergency help: "What are emergency procedures?"
• Generate reports: "Generate report"

Just type your question and I'll help you!`,

        'revenue': `💰 **Traffic Revenue and Financial Management:**

**Sources of Traffic Revenue:**
• Traffic violation fines
• Parking fees
• Vehicle registration fees
• Driving license fees
• Pollution control certificates
• Road tax collection
• Toll collection

**Revenue Collection Methods:**
• Online payment portals
• Mobile payment apps
• Bank transfers
• Cash payments at traffic stations
• E-challan system

**Revenue Distribution:**
• State government (majority)
• Local municipal bodies
• Traffic police department
• Road maintenance funds
• Public safety initiatives

**Financial Management:**
• Digital tracking systems
• Transparent accounting
• Regular audits
• Public reporting
• Budget allocation for traffic infrastructure

**Recent Trends:**
• Increasing digital payments
• Higher fine amounts for serious violations
• Focus on automated enforcement
• Revenue sharing with local bodies`,

        'statistics': `📊 **Traffic Statistics and Analytics:**

**Key Traffic Metrics:**
• Total violations per month/year
• Revenue collection statistics
• Accident rates and trends
• Most common violations
• Peak traffic hours
• Geographic distribution of violations

**Data Collection:**
• Automated traffic cameras
• Manual enforcement data
• Public reports
• Insurance company data
• Hospital records (accidents)

**Analytics Dashboard:**
• Real-time violation tracking
• Revenue trends
• Traffic pattern analysis
• Enforcement effectiveness
• Public safety metrics

**Reporting:**
• Monthly/quarterly reports
• Annual statistics
• Comparative analysis
• Performance indicators
• Public disclosure requirements`,

        'management': `🏛️ **Traffic Management System:**

**Administrative Structure:**
• Traffic Police Department
• Regional Traffic Offices
• Local Traffic Stations
• Specialized Units (Accident, Enforcement)

**Key Functions:**
• Traffic regulation and control
• Violation enforcement
• Accident investigation
• Public safety campaigns
• Infrastructure coordination

**Technology Integration:**
• Smart traffic signals
• Automated enforcement cameras
• Digital challan system
• Mobile apps for public
• Real-time monitoring

**Public Services:**
• License and registration
• Fine payment assistance
• Traffic rule education
• Emergency response
• Public complaints handling

**Performance Metrics:**
• Response time to incidents
• Violation detection rate
• Public satisfaction scores
• Revenue collection efficiency
• Accident reduction rates`,

        'fines': `💸 **Traffic Fine System:**

**Fine Categories:**
• Minor violations: ₹500-2000
• Major violations: ₹2000-10000
• Serious violations: ₹10000+ with imprisonment

**Payment Methods:**
• Online portals
• Mobile apps (PayTM, PhonePe)
• Bank transfers
• Cash at traffic stations
• UPI payments

**Payment Deadlines:**
• Immediate payment: 50% discount
• Within 30 days: Full amount
• After 30 days: Additional penalties
• Non-payment: Legal action

**Fine Collection Process:**
• Digital challan generation
• SMS/email notifications
• Online payment tracking
• Receipt generation
• Dispute resolution system

**Recent Updates:**
• Increased fine amounts
• Mandatory digital payments
• Enhanced enforcement
• Public awareness campaigns`
      };

      // Check for common queries first
      for (const [key, response] of Object.entries(commonResponses)) {
        if (lowerMessage.includes(key.replace('help with ', '').replace(' ', ''))) {
          return {
            success: true,
            data: {
              message: response,
              timestamp: new Date().toISOString(),
              id: Date.now()
            }
          };
        }
      }

      // Additional checks for emergency procedures and other queries
      if (lowerMessage.includes('emergency') || lowerMessage.includes('emergency procedures')) {
        return {
          success: true,
          data: {
            message: commonResponses['emergency procedures'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('traffic rules') || lowerMessage.includes('rules')) {
        return {
          success: true,
          data: {
            message: commonResponses['traffic rules'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('violations') || lowerMessage.includes('violation')) {
        return {
          success: true,
          data: {
            message: commonResponses['violation'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return {
          success: true,
          data: {
            message: commonResponses['hello'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('help')) {
        return {
          success: true,
          data: {
            message: commonResponses['help'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      // Dynamic responses for specific topics
      if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('collection')) {
        return {
          success: true,
          data: {
            message: commonResponses['revenue'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('statistics') || lowerMessage.includes('data') || lowerMessage.includes('analytics')) {
        return {
          success: true,
          data: {
            message: commonResponses['statistics'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('management') || lowerMessage.includes('system') || lowerMessage.includes('administration')) {
        return {
          success: true,
          data: {
            message: commonResponses['management'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      if (lowerMessage.includes('fines') || lowerMessage.includes('penalty') || lowerMessage.includes('payment')) {
        return {
          success: true,
          data: {
            message: commonResponses['fines'],
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      // 3. ChatGPT fallback for all other queries
      const apiKey = this.apiKey;
      if (!apiKey || apiKey === 'mock-key') {
        return {
          success: true,
          data: {
            message: `I'm here to help with traffic management! 

Since I'm not connected to advanced AI right now, here are some things I can help with:

🚨 **Traffic Violations & Fines**
• Ask me about specific violations with "fine" or "penalty"
• I can tell you fine amounts for common violations

📋 **Traffic Rules**
• Ask about "traffic rules" for general guidance
• Emergency procedures and contacts

🆘 **Emergency Help**
• Ask about "emergency procedures" for incident response

💡 **Try asking:**
• "What's the fine for speeding?"
• "Tell me about traffic rules"
• "What are emergency procedures?"

For more detailed answers, please ensure your OpenAI API key is properly configured.`,
            timestamp: new Date().toISOString(),
            id: Date.now()
          }
        };
      }

      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const messages = [
        { role: 'system', content: 'You are a helpful AI assistant for traffic management, traffic rules, and fines in India. Provide accurate, helpful information about traffic laws, violations, emergency procedures, and general traffic guidance.' },
        ...conversationHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: message }
      ];
      const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7
      });
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body
      });
      if (!response.ok) {
        let errMsg = 'OpenAI API error';
        try {
          const errData = await response.json();
          errMsg = errData.error?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not process your request.';
      return {
        success: true,
        data: {
          message: aiText,
          timestamp: new Date().toISOString(),
          id: Date.now()
        }
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: true,
        data: {
          message: `I'm here to help with traffic management! 

Since I encountered an issue with the advanced AI service, here are some things I can help with:

🚨 **Traffic Violations & Fines**
• Ask me about specific violations with "fine" or "penalty"
• I can tell you fine amounts for common violations

📋 **Traffic Rules**
• Ask about "traffic rules" for general guidance
• Emergency procedures and contacts

🆘 **Emergency Help**
• Ask about "emergency procedures" for incident response

💡 **Try asking:**
• "What's the fine for speeding?"
• "Tell me about traffic rules"
• "What are emergency procedures?"

Error details: ${error.message}`,
          timestamp: new Date().toISOString(),
          id: Date.now()
        }
      };
    }
  }

  // [Other methods unchanged: explainViolation, generateReport, getTrafficInsights]
  // You can keep your other methods as is or improve similarly.

  async explainViolation(violationType) {
    // Static explanations for each violation type
    const explanations = {
      speeding: {
        title: 'Speeding',
        description: 'Speeding is driving above the posted speed limit or too fast for road conditions.',
        legal_reference: 'Section 183, Motor Vehicles Act, 1988',
        consequences: [
          'Fines (₹1000–₹5000)',
          'Points on your license',
          'Increased risk of accidents',
          'Possible license suspension for repeat offenses'
        ],
        prevention: [
          'Always observe speed limits',
          'Adjust your speed for weather and traffic',
          'Use cruise control on highways if available'
        ],
        additional: {
          legal_status: 'This violation is taken seriously by law enforcement and can result in significant penalties.',
          insurance_impact: 'Violations can lead to increased insurance premiums and potential policy cancellations.'
        }
      },
      red_light: {
        title: 'Red Light Violation',
        description: 'Entering an intersection after the traffic signal has turned red.',
        legal_reference: 'Section 177, Motor Vehicles Act, 1988',
        consequences: [
          'Fines (₹3000–₹5000)',
          'License points',
          'Increased risk of severe accidents',
          'Possible license suspension'
        ],
        prevention: [
          'Always slow down at yellow lights and stop at red lights',
          'Stay alert at intersections'
        ],
        additional: {
          legal_status: 'Running a red light is a major traffic offense and is strictly enforced.',
          insurance_impact: 'May result in higher insurance rates and possible denial of claims in case of an accident.'
        }
      },
      parking: {
        title: 'Illegal Parking',
        description: 'Parking in unauthorized areas, such as no-parking zones, in front of driveways, or blocking emergency access.',
        legal_reference: 'Section 122/177, Motor Vehicles Act, 1988',
        consequences: [
          'Fines (₹1000)',
          'Vehicle towing',
          'Inconvenience',
          'Possible additional penalties'
        ],
        prevention: [
          'Park only in designated areas',
          'Check for parking signs',
          'Avoid blocking access points'
        ],
        additional: {
          legal_status: 'Illegal parking is a minor offense but can escalate if it obstructs emergency services.',
          insurance_impact: 'Frequent violations may affect your driving record and insurance premiums.'
        }
      },
      dui: {
        title: 'DUI/DWI',
        description: 'Operating a vehicle while impaired by alcohol or drugs.',
        legal_reference: 'Section 185, Motor Vehicles Act, 1988',
        consequences: [
          'Heavy fines (₹10,000+)',
          'License suspension',
          'Imprisonment',
          'High risk of causing accidents'
        ],
        prevention: [
          'Never drive after consuming alcohol or drugs',
          'Use a taxi, rideshare, or designated driver'
        ],
        additional: {
          legal_status: 'DUI/DWI is a criminal offense with severe legal consequences.',
          insurance_impact: 'Almost always results in cancellation of insurance and denial of claims.'
        }
      },
      reckless: {
        title: 'Reckless Driving',
        description: 'Driving with willful disregard for safety, such as aggressive lane changes, racing, or tailgating.',
        legal_reference: 'Section 184, Motor Vehicles Act, 1988',
        consequences: [
          'Fines',
          'License suspension',
          'Criminal charges',
          'Increased accident risk'
        ],
        prevention: [
          'Drive defensively',
          'Obey all traffic laws',
          'Avoid aggressive maneuvers'
        ],
        additional: {
          legal_status: 'Reckless driving is a serious offense and can lead to criminal prosecution.',
          insurance_impact: 'Significantly increases insurance premiums and risk of policy cancellation.'
        }
      },
      hit_run: {
        title: 'Hit and Run',
        description: 'Leaving the scene of an accident without stopping to provide information or help.',
        legal_reference: 'Section 134, Motor Vehicles Act, 1988',
        consequences: [
          'Severe criminal penalties',
          'Fines',
          'Imprisonment',
          'Permanent license revocation'
        ],
        prevention: [
          'Always stop and assist if you are involved in an accident',
          'Provide your information to authorities'
        ],
        additional: {
          legal_status: 'Hit and run is a criminal offense with mandatory jail time and heavy fines.',
          insurance_impact: 'Insurance claims are usually denied and policy is likely to be cancelled.'
        }
      },
      texting: {
        title: 'Texting While Driving',
        description: 'Using a mobile phone for texting or calls while driving, which distracts you from the road.',
        legal_reference: 'Section 184, Motor Vehicles Act, 1988',
        consequences: [
          'Fines (₹2000)',
          'Increased accident risk',
          'License points'
        ],
        prevention: [
          'Use hands-free devices or pull over to use your phone',
          'Avoid distractions while driving'
        ],
        additional: {
          legal_status: 'Texting while driving is a punishable offense and is increasingly enforced.',
          insurance_impact: 'May result in higher premiums and denial of claims if proven as accident cause.'
        }
      },
      seatbelt: {
        title: 'No Seatbelt',
        description: 'Not wearing a seatbelt or not using child restraints.',
        legal_reference: 'Section 194B, Motor Vehicles Act, 1988',
        consequences: [
          'Fines (₹1000)',
          'Increased risk of injury or death in an accident'
        ],
        prevention: [
          'Always wear your seatbelt',
          'Ensure all passengers are buckled up'
        ],
        additional: {
          legal_status: 'Seatbelt violations are strictly enforced for safety reasons.',
          insurance_impact: 'Injury claims may be reduced or denied if seatbelts were not used.'
        }
      }
    };
    const info = explanations[violationType];
    if (info) {
      return { success: true, data: info };
    } else {
      return { success: false, error: 'No explanation found for this violation.' };
    }
  }

  async generateReport(reportData) {
    // Unchanged, already well structured
  }

  async getTrafficInsights(location, timeRange) {
    // Unchanged, already well structured
  }
}

const aiService = new AIService();
export default aiService;
