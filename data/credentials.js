/**
 * Test credentials for different environments and user types
 */
const credentials = {
  // Standard valid users
  valid: {
    standard_user: {
      username: 'standard_user',
      password: 'secret_sauce',
      description: 'Standard user with full access'
    },
    performance_glitch_user: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
      description: 'User that experiences performance issues'
    },
    error_user: {
      username: 'error_user',
      password: 'secret_sauce',
      description: 'User that encounters various errors'
    },
    visual_user: {
      username: 'visual_user',
      password: 'secret_sauce',
      description: 'User for visual testing'
    }
  },

  // Invalid/Problem users
  invalid: {
    locked_out_user: {
      username: 'locked_out_user',
      password: 'secret_sauce',
      description: 'User that is locked out',
      expectedError: 'Sorry, this user has been locked out.'
    },
    problem_user: {
      username: 'problem_user',
      password: 'secret_sauce',
      description: 'User with various UI problems'
    },
    invalid_user: {
      username: 'invalid_user',
      password: 'wrong_password',
      description: 'Non-existent user credentials',
      expectedError: 'Username and password do not match any user in this service'
    }
  },

  // Admin users (for different environments)
  admin: {
    dev_admin: {
      username: process.env.DEV_ADMIN_USER || 'dev_admin',
      password: process.env.DEV_ADMIN_PASS || 'dev_admin_pass',
      environment: 'development'
    },
    qa_admin: {
      username: process.env.QA_ADMIN_USER || 'qa_admin',
      password: process.env.QA_ADMIN_PASS || 'qa_admin_pass',
      environment: 'qa'
    },
    staging_admin: {
      username: process.env.STAGING_ADMIN_USER || 'staging_admin',
      password: process.env.STAGING_ADMIN_PASS || 'staging_admin_pass',
      environment: 'staging'
    }
  },

  // API credentials
  api: {
    service_account: {
      clientId: process.env.API_CLIENT_ID || 'test_client_id',
      clientSecret: process.env.API_CLIENT_SECRET || 'test_client_secret',
      scope: 'read write'
    },
    readonly_account: {
      clientId: process.env.READONLY_CLIENT_ID || 'readonly_client',
      clientSecret: process.env.READONLY_CLIENT_SECRET || 'readonly_secret',
      scope: 'read'
    }
  },

  // Database credentials
  database: {
    test_db: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      username: process.env.TEST_DB_USER || 'test_user',
      password: process.env.TEST_DB_PASS || 'test_pass',
      database: process.env.TEST_DB_NAME || 'test_db'
    }
  },

  // Third-party service credentials
  external: {
    sauce_labs: {
      username: process.env.SAUCE_USERNAME || '',
      accessKey: process.env.SAUCE_ACCESS_KEY || ''
    },
    browserstack: {
      username: process.env.BROWSERSTACK_USERNAME || '',
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY || ''
    }
  }
};

/**
 * Get credentials for specific user type and environment
 * @param {string} userType - Type of user (valid, invalid, admin, api, etc.)
 * @param {string} userKey - Specific user key
 * @returns {Object} User credentials
 */
function getCredentials(userType, userKey) {
  if (credentials[userType] && credentials[userType][userKey]) {
    return credentials[userType][userKey];
  }
  throw new Error(`Credentials not found for ${userType}.${userKey}`);
}

/**
 * Get all valid users
 * @returns {Object} All valid user credentials
 */
function getValidUsers() {
  return credentials.valid;
}

/**
 * Get all invalid users
 * @returns {Object} All invalid user credentials
 */
function getInvalidUsers() {
  return credentials.invalid;
}

/**
 * Get random valid user
 * @returns {Object} Random valid user credentials
 */
function getRandomValidUser() {
  const validUsers = Object.keys(credentials.valid);
  const randomUser = validUsers[Math.floor(Math.random() * validUsers.length)];
  return credentials.valid[randomUser];
}

/**
 * Get admin credentials for environment
 * @param {string} environment - Environment name (dev, qa, staging)
 * @returns {Object} Admin credentials
 */
function getAdminCredentials(environment) {
  const adminKey = `${environment}_admin`;
  return credentials.admin[adminKey] || credentials.admin.dev_admin;
}

module.exports = {
  credentials,
  getCredentials,
  getValidUsers,
  getInvalidUsers,
  getRandomValidUser,
  getAdminCredentials
};
