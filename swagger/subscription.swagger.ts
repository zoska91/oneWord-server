/**
 * @swagger
 * tags:
 *   - name: Subscription
 *     description: User subscription endpoints
 */

/**
 * @swagger
 * /subscription/subscribe:
 *   post:
 *     summary: Subscribe for notifications
 *     tags:
 *       - Subscription
 *     description: Subscribes the user for push notifications.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription:
 *                 type: object
 *                 properties:
 *                   endpoint:
 *                     type: string
 *                   keys:
 *                     type: object
 *                     properties:
 *                       p256dh:
 *                         type: string
 *                       auth:
 *                         type: string
 *             required:
 *               - subscription
 *     responses:
 *       200:
 *         description: Successful operation - subscribed successfully.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       409:
 *         description: Conflict - subscription already exists.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /subscription/unsubscribe-device:
 *   delete:
 *     summary: Unsubscribe device
 *     tags:
 *       - Subscription
 *     description: Unsubscribes the device from push notifications.
 *     responses:
 *       200:
 *         description: Successful operation - device unsubscribed.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /subscription/unsubscribe-all:
 *   delete:
 *     summary: Unsubscribe all devices
 *     tags:
 *       - Subscription
 *     description: Unsubscribes all devices from push notifications.
 *     responses:
 *       200:
 *         description: Successful operation - all devices unsubscribed.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /subscription/showCrons:
 *   get:
 *     summary: Show active cron jobs
 *     tags:
 *       - Subscription
 *     description: Retrieves the number of active cron jobs.
 *     responses:
 *       200:
 *         description: Successful operation - number of active cron jobs retrieved.
 *       500:
 *         description: Server error.
 */
