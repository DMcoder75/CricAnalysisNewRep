/**
 * MySQL Database Connection for Crichattric
 * This file handles database connections and provides query functions
 */

const mysql = require('mysql2/promise');
const dbConfig = require('./db-config');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Execute a SQL query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results
 */
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single row from a query
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} - Single row result
 */
async function getOne(sql, params) {
  const rows = await query(sql, params);
  return rows[0];
}

/**
 * Insert data into a table
 * @param {string} table - Table name
 * @param {Object} data - Data to insert (column:value pairs)
 * @returns {Promise<Object>} - Insert result
 */
async function insert(table, data) {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);
  
  const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  const [result] = await pool.execute(sql, values);
  
  return {
    id: result.insertId,
    affectedRows: result.affectedRows
  };
}

/**
 * Update data in a table
 * @param {string} table - Table name
 * @param {Object} data - Data to update (column:value pairs)
 * @param {string} whereClause - WHERE clause (without 'WHERE')
 * @param {Array} whereParams - Parameters for WHERE clause
 * @returns {Promise<Object>} - Update result
 */
async function update(table, data, whereClause, whereParams) {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), ...whereParams];
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  const [result] = await pool.execute(sql, values);
  
  return {
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
}

/**
 * Delete data from a table
 * @param {string} table - Table name
 * @param {string} whereClause - WHERE clause (without 'WHERE')
 * @param {Array} whereParams - Parameters for WHERE clause
 * @returns {Promise<Object>} - Delete result
 */
async function remove(table, whereClause, whereParams) {
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  const [result] = await pool.execute(sql, whereParams);
  
  return {
    affectedRows: result.affectedRows
  };
}

/**
 * Check database connection
 * @returns {Promise<boolean>} - Connection status
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Export database functions
module.exports = {
  query,
  getOne,
  insert,
  update,
  remove,
  testConnection,
  pool
};
