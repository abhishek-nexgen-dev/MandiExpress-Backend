import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';
import AuthConstant from '../api/v1/Auth/Auth.constant.mjs';
import SendResponse from '../utils/SendResponse.mjs';

/**
 * Express middleware to protect routes and optionally check roles
 * @param {Array} requiredRoles - Roles allowed to access the route
 * @returns {Function} Express middleware
 */
const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const token =
        req.cookies?.token || req.headers?.authorization?.split(' ')[1];
      const decoded = await AuthUtils.DecodeToken(String(token).trim());
      

      const user = await AuthUtils.FindByUserId(decoded.userId);
      if (!user) {
        throw new Error(AuthConstant.USER_NOT_FOUND || 'User not found');
      }

      req.user = user;

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new Error(
          `Access denied. Required roles: ${requiredRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      SendResponse.error(res, 401, error.message || 'Authentication failed.');
    }
  };
};

export default authMiddleware;
