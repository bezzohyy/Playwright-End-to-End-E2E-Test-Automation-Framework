/**
 * API Helper utilities for making HTTP requests
 */
class ApiHelper {
  constructor(baseURL = process.env.API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, headers = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...headers }
    });
    
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data = {}, headers = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...headers },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data = {}, headers = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...headers },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, headers = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...headers }
    });
    
    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.status} ${response.statusText}`);
    }
    
    return response.status === 204 ? null : await response.json();
  }

  /**
   * Set authorization header
   * @param {string} token - Authorization token
   */
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization header
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
}

module.exports = ApiHelper;
