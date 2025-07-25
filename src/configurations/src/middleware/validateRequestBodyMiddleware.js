/**
 * Express middleware for validating request body exists
 * @returns {Function} Express middleware function
 */
export const validateRequestBodyMiddleware = () => {
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Request body is required'
            });
        }
        next();
    };
};

/**
 * Express middleware for validating UUID parameters
 * @param {string} paramName - Name of the parameter to validate
 * @returns {Function} Express middleware function
 */
export const validateUUIDParamMiddleware = (paramName = 'id') => {
    return (req, res, next) => {
        const paramValue = req.params[paramName];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!paramValue || !uuidRegex.test(paramValue)) {
            return res.status(400).json({
                success: false,
                error: `Invalid UUID format for parameter '${paramName}'`
            });
        }

        next();
    };
};

export default {
    validateRequestBodyMiddleware,
    validateUUIDParamMiddleware
};
