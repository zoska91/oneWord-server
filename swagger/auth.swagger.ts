/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get user data
 *     tags:
 *       - Auth
 *     description: Retrieves data of the logged-in user.
 *     responses:
 *       200:
 *         description: Successful operation - user data retrieved.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     description: Logs in the user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 32
 *               password:
 *                 type: string
 *                 maxLength: 64
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful operation - logged in successfully.
 *       400:
 *         description: Bad request - incorrect login credentials.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 32
 *               password:
 *                 type: string
 *                 maxLength: 64
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful operation - user registered.
 *       400:
 *         description: Bad request - user already exists in the database.
 *       500:
 *         description: Server error.
 */
