import { environment } from '../../environments/environment';

export class ApiConfig {
  static readonly BASE_URL = environment.apiUrl;
  static readonly VERSION = environment.apiVersion;
  static readonly TIMEOUT = environment.timeout;
  
  // HTTP Headers
  static readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // HTTP Methods
  static readonly HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
  };
  
  // API Response Codes
  static readonly RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  };
  
  // Authentication
  static readonly AUTH_HEADER = 'Authorization';
  static readonly BEARER_PREFIX = 'Bearer';
  static readonly TOKEN_KEY = 'auth_token';
  static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  // Pagination
  static readonly DEFAULT_PAGE_SIZE = 10;
  static readonly DEFAULT_PAGE = 1;
  static readonly MAX_PAGE_SIZE = 100;
  
  // Cache
  static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  // Endpoints
  static readonly ENDPOINTS = environment.endpoints;
  
  // Features
  static readonly FEATURES = environment.features;
  
  // Get full API URL
  static getFullUrl(endpoint: string): string {
    return `${this.BASE_URL}${endpoint}`;
  }
  
  // Get versioned URL
  static getVersionedUrl(endpoint: string): string {
    return `${this.BASE_URL}/${this.VERSION}${endpoint}`;
  }
}
