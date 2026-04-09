/**
 * Unified API response shape.
 */
export class ApiResponse {
  /**
   * @param {object} params
   * @param {boolean} params.success
   * @param {number} params.statusCode
   * @param {any} params.data
   * @param {string} params.message
   */
  constructor({ success, statusCode, data, message }) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}


