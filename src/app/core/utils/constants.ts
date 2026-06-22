// API Related Constants
export const API_CONSTANTS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Authentication Constants
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_info',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000 // 5 minutes
};

// Pagination Constants
export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  DEFAULT_PAGE: 1
};

// Status Constants
export const STATUS_CONSTANTS = {
  AGENT: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ERROR: 'error',
    PAUSED: 'paused'
  },
  
  EXECUTION: {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  },
  
  FAILURE: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  }
};

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Date Formats
export const DATE_FORMATS = {
  SHORT_DATE: 'MM/dd/yyyy',
  LONG_DATE: 'MMMM d, yyyy',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'MM/dd/yyyy HH:mm:ss'
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme_preference',
  SIDEBAR_STATE: 'sidebar_state'
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred on the server. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  SAVED: 'Saved successfully.'
};
