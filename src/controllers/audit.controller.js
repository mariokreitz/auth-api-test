import Audit from "../models/audit.model.js";

/**
 * @description Get audit logs filtered by user, action, and date range
 * @route GET /audit
 * @access Admin
 * @param {string} [user] - Filter by username
 * @param {string} [action] - Filter by action type
 * @param {string} [startDate] - Filter by date range start date
 * @param {string} [endDate] - Filter by date range end date
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of logs per page
 * @returns {object} JSON response with an array of audit logs and pagination information
 * @example
 * // Request
 * GET /audit HTTP/1.1
 * Authorization: Bearer <token>
 *
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "logs": [
 *     {
 *       "_id": "616269052588",
 *       "user": "testuser",
 *       "action": "login",
 *       "details": "Accessed /login",
 *       "timestamp": "2021-10-12T12:00:00.000Z",
 *       "ip": "127.0.0.1"
 *     },
 *     ...
 *   ],
 *   "pagination": {
 *     "total": 20,
 *     "page": 1,
 *     "limit": 10,
 *     "totalPages": 2
 *   }
 * }
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, user, action, startDate, endDate } = req.query;

    const query = {};
    if (user) query.user = { $eq: user };
    if (action) query.action = { $eq: action };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Audit.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Audit.countDocuments(query);

    res.status(200).json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Failed to retrieve audit logs" });
  }
};
