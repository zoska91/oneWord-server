/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Chat endpoints
 */

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send message
 *     tags:
 *       - Chat
 *     description: Sends a message to the AI for processing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 maxLength: 1024
 *               languageToLearn:
 *                 type: string
 *                 maxLength: 50
 *                 minLength: 2
 *               isStreaming:
 *                 type: boolean
 *               todayWord:
 *                 type: string
 *                 maxLength: 100
 *               currentConversationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation - message sent to AI.
 *       400:
 *         description: Bad request - invalid data or user unauthorized.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /chat/finished-conversation:
 *   post:
 *     summary: Finish conversation
 *     tags:
 *       - Chat
 *     description: Finishes and saves a conversation summary.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentConversationId:
 *                 type: string
 *             required:
 *               - currentConversationId
 *     responses:
 *       200:
 *         description: Successful operation - conversation summary saved.
 *       400:
 *         description: Bad request - invalid data or user unauthorized.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       404:
 *         description: Not found - conversation ID not provided.
 *       500:
 *         description: Server error.
 */
