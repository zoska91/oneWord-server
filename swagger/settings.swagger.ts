/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: User settings endpoints
 */

/**
 * @swagger
 * /settings/user-settings:
 *   get:
 *     summary: Get user settings
 *     tags:
 *       - Settings
 *     description: Retrieves settings of the logged-in user.
 *     responses:
 *       200:
 *         description: Successful operation - user settings retrieved.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /settings/user-settings:
 *   put:
 *     summary: Update user settings
 *     tags:
 *       - Settings
 *     description: Updates settings for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               breakDay:
 *                 type: number
 *               isBreak:
 *                 type: boolean
 *               isSummary:
 *                 type: boolean
 *               summaryDay:
 *                 type: number
 *               notifications:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                     type:
 *                       type: string
 *               languageToLearn:
 *                 type: number
 *               baseLanguage:
 *                 type: number
 *             required:
 *               - breakDay
 *               - isBreak
 *               - isSummary
 *               - summaryDay
 *               - notifications
 *               - languageToLearn
 *               - baseLanguage
 *     responses:
 *       200:
 *         description: Successful operation - settings updated.
 *       400:
 *         description: Bad request - invalid data or user unauthorized.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */
