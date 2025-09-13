/**
 * Database Helper utilities for database operations
 */
const { Pool } = require('pg'); // PostgreSQL client

class DbHelper {
  constructor(config = {}) {
    this.config = {
      host: config.host || process.env.DB_HOST || 'localhost',
      port: config.port || process.env.DB_PORT || 5432,
      database: config.database || process.env.DB_NAME,
      user: config.user || process.env.DB_USER,
      password: config.password || process.env.DB_PASSWORD,
      max: 10, // max number of clients in pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
      connectionTimeoutMillis: 2000, // how long to wait for connection
    };
    
    this.pool = null;
  }

  /**
   * Initialize database connection pool
   */
  async connect() {
    try {
      this.pool = new Pool(this.config);
      
      // Test connection
      const client = await this.pool.connect();
      console.log('Database connected successfully');
      client.release();
      
      return this.pool;
    } catch (error) {
      console.error('Database connection error:', error.message);
      throw error;
    }
  }

  /**
   * Execute a query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(query, params = []) {
    if (!this.pool) {
      await this.connect();
    }
    
    try {
      const result = await this.pool.query(query, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  }

  /**
   * Get a single record
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object|null>} Single record or null
   */
  async getOne(query, params = []) {
    const result = await this.query(query, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get multiple records
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Array of records
   */
  async getMany(query, params = []) {
    const result = await this.query(query, params);
    return result.rows;
  }

  /**
   * Insert a record
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Inserted record
   */
  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {Object} data - Data to update
   * @param {string} whereClause - WHERE condition
   * @param {Array} whereParams - WHERE parameters
   * @returns {Promise<Object>} Updated record
   */
  async update(table, data, whereClause, whereParams = []) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const whereParamOffset = values.length;
    
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING *
    `;
    
    const allParams = [...values, ...whereParams];
    const result = await this.query(query, allParams);
    return result.rows[0];
  }

  /**
   * Delete records
   * @param {string} table - Table name
   * @param {string} whereClause - WHERE condition
   * @param {Array} whereParams - WHERE parameters
   * @returns {Promise<number>} Number of deleted records
   */
  async delete(table, whereClause, whereParams = []) {
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.query(query, whereParams);
    return result.rowCount;
  }

  /**
   * Clean up test data
   * @param {Array} tables - Tables to clean
   */
  async cleanupTestData(tables = []) {
    for (const table of tables) {
      await this.query(`DELETE FROM ${table} WHERE created_by = 'test'`);
    }
  }

  /**
   * Begin transaction
   */
  async beginTransaction() {
    return await this.query('BEGIN');
  }

  /**
   * Commit transaction
   */
  async commitTransaction() {
    return await this.query('COMMIT');
  }

  /**
   * Rollback transaction
   */
  async rollbackTransaction() {
    return await this.query('ROLLBACK');
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('Database connection closed');
    }
  }
}

module.exports = DbHelper;
