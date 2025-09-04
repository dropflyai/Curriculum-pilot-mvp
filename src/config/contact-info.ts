/**
 * CodeFly Contact Information & Brand Assets
 * ==========================================
 * Centralized configuration for all contact details, domains, and brand information
 * Used across email templates, contact forms, legal pages, and support documentation
 */

export const CODEFLY_CONTACT = {
  // Primary Domain
  domain: 'www.codeflyai.com',
  websiteUrl: 'https://www.codeflyai.com',
  
  // Official Email Addresses
  emails: {
    support: 'support@codeflyai.com',        // Primary support contact
    admin: 'admin@codeflyai.com',            // Administrative contact
    info: 'info@codeflyai.com',              // General information & marketing
    rio: 'rio@codeflyai.com',                // Rio Allen (Founder)
    erik: 'erik.scott@codeflyai.com'         // Erik Scott (Team Member)
  },
  
  // Default Email Settings
  defaultFromEmail: 'info@codeflyai.com',
  defaultFromName: 'CodeFly ✈️',
  defaultReplyTo: 'support@codeflyai.com',
  
  // Company Information
  company: {
    name: 'CodeFly',
    fullName: 'CodeFly - Learn To Code On The Fly',
    tagline: 'Professional Coding Education Platform',
    description: 'Transforming how people learn to code through immersive, practical education'
  },
  
  // Brand Assets
  brand: {
    logo: '✈️',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2', 
      accent: '#38bdf8',
      success: '#10b981',
      background: '#0f172a'
    }
  },
  
  // Social Media (when available)
  social: {
    // twitter: '@codeflyai',
    // linkedin: 'company/codefly',
    // github: 'codefly'
  }
} as const

// Helper functions for easy access
export const getContactEmail = (type: keyof typeof CODEFLY_CONTACT.emails) => {
  return CODEFLY_CONTACT.emails[type]
}

export const getDefaultEmailConfig = () => ({
  from: `${CODEFLY_CONTACT.defaultFromName} <${CODEFLY_CONTACT.defaultFromEmail}>`,
  replyTo: CODEFLY_CONTACT.defaultReplyTo
})

export const getBrandInfo = () => CODEFLY_CONTACT.company

// Type exports for TypeScript
export type ContactEmailType = keyof typeof CODEFLY_CONTACT.emails
export type CodeFlyContact = typeof CODEFLY_CONTACT