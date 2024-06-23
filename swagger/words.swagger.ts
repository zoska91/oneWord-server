/**
 * @swagger
 * tags:
 *   - name: Words
 *     description: Endpoints for managing user words
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Word:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         basicWord:
 *           type: string
 *         transWord:
 *           type: string
 *         addLang:
 *           type: number
 *         status:
 *           type: number
 *           description: Status of the word.
 *           enum: [0, 1, 2]
 *         createdDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *       required:
 *         - basicWord
 *         - transWord
 *         - addLang
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddWordInput:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           properties:
 *             basicWord:
 *               type: string
 *             transWord:
 *               type: string
 *             addLang:
 *               type: number
 *             status:
 *               type: number
 *       required:
 *         - body
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PutWordInput:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           properties:
 *             basicWord:
 *               type: string
 *             transWord:
 *               type: string
 *             addLang:
 *               type: number
 *             status:
 *               type: number
 *         params:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       required:
 *         - body
 *         - params
 */

/**
 * @swagger
 * /words/all:
 *   get:
 *     summary: Get all user words
 *     tags:
 *       - Words
 *     description: Retrieves all words added by the logged-in user.
 *     responses:
 *       200:
 *         description: Successful operation - words retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 words:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Word'
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/add-one:
 *   post:
 *     summary: Add a new word
 *     tags:
 *       - Words
 *     description: Adds a new word for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWordInput'
 *     responses:
 *       200:
 *         description: Successful operation - word added successfully.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/add-csv:
 *   post:
 *     summary: Add words from CSV
 *     tags:
 *       - Words
 *     description: Adds multiple words from a CSV file for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful operation - words added successfully.
 *       400:
 *         description: Bad request - invalid file format or other errors.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/update-one/{id}:
 *   put:
 *     summary: Update a word
 *     tags:
 *       - Words
 *     description: Updates an existing word for the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutWordInput'
 *     responses:
 *       200:
 *         description: Successful operation - word updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       404:
 *         description: Not found - word not found for the provided id.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/delete-one/{id}:
 *   delete:
 *     summary: Delete a word
 *     tags:
 *       - Words
 *     description: Deletes a word for the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation - word deleted successfully.
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       404:
 *         description: Not found - word not found for the provided id.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/today-word:
 *   get:
 *     summary: Get today's word
 *     tags:
 *       - Words
 *     description: Retrieves today's word for the logged-in user.
 *     responses:
 *       200:
 *         description: Successful operation - today's word retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 basicWord:
 *                   type: string
 *                 transWord:
 *                   type: string
 *                 addLang:
 *                   type: number
 *                 status:
 *                   type: number
 *                   description: Status of the word.
 *                   enum: [0, 1, 2]
 *                 createdDate:
 *                   type: string
 *                   format: date-time
 *                 updatedDate:
 *                   type: string
 *                   format: date-time
 *                 shuffleWords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       basicWord:
 *                         type: string
 *                       transWord:
 *                         type: string
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       404:
 *         description: Not found - no words available for today.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /words/learned-words:
 *   get:
 *     summary: Get learned words
 *     tags:
 *       - Words
 *     description: Retrieves learned words for the logged-in user.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation - learned words retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 words:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Word'
 *       401:
 *         description: Unauthorized - no logged-in user or authentication.
 *       500:
 *         description: Server error.
 */
