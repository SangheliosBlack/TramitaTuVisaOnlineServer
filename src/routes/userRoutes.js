
    const express = require('express');
    const passport = require('passport');
    const UserController = require('../controllers/userController');
    const checkPermissions = require('../middlewares/checkPermissions');
    const router = express.Router();
    
    router.use(passport.authenticate('jwt', { session: false }));
    
    /**
     * @swagger
     * tags:
     *   name: User
     *   description: API endpoints for User
     */
    
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Retrieve a list of User
     *     description: Retrieve a list of all User
     *     tags: [User]
     *     responses:
     *       200:
     *         description: A list of User
     */
    router.get("/", checkPermissions('read', 'all'), UserController.getAllUser);

    /**
     * @swagger
     * tags:
     *   name: User
     *   description: API endpoints for User
     */
    
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Retrieve a list of User
     *     description: Retrieve a list of all User
     *     tags: [User]
     *     responses:
     *       200:
     *         description: A list of User
     */
    router.get("/internal", checkPermissions('read', 'all'), UserController.getAllInternalUsers);

    /**
     * @swagger
     * tags:
     *   name: User
     *   description: API endpoints for User
     */
    
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Retrieve a list of User
     *     description: Retrieve a list of all User
     *     tags: [User]
     *     responses:
     *       200:
     *         description: A list of User
     */
    router.get("/referred", checkPermissions('read', 'all'), UserController.getReferredUsers);
    
    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Create a new User
     *     description: Create a new User
     *     tags: [User]
     *     parameters: 
*       - in: path
*         name: name
*         required: true
*         schema:
*           type: String
*       - in: path
*         name: email
*         required: true
*         schema:
*           type: String
*       - in: path
*         name: password
*         required: true
*         schema:
*           type: String
*       - in: path
*         name: phone
*         required: true
*         schema:
*           type: String
*       - in: path
*         name: last_login_date
*         required: false
*         schema:
*           type: Date
*       - in: path
*         name: role
*         required: true
*         schema:
*           type: String
*       - in: path
*         name: _id
*         required: undefined
*         schema:
*           type: ObjectID
*       - in: path
*         name: updatedAt
*         required: undefined
*         schema:
*           type: Date
*       - in: path
*         name: createdAt
*         required: undefined
*         schema:
*           type: Date
*       - in: path
*         name: __v
*         required: undefined
*         schema:
*           type: Number
     *     requestBody:
     *       description: User data
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: User created successfully
     */
    router.post("/", checkPermissions('read', 'all'), UserController.createNewUser);
    
    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     summary: Retrieve a single User by ID
     *     description: Retrieve a single User by ID
     *     tags: [User]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A single User
     */
    router.get("/:id", checkPermissions('read', 'all'), UserController.getUserById);
    
    /**
     * @swagger
     * /user/{id}:
     *   patch:
     *     summary: Update a User by ID
     *     description: Update a single User by ID
     *     tags: [User]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       description: User data
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: User updated successfully
     */
    router.patch("/:id", checkPermissions('read', 'all'), UserController.updateUser);
    
    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     summary: Delete a User by ID
     *     description: Delete a single User by ID
     *     tags: [User]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     */
    router.delete("/:id", checkPermissions('read', 'all'), UserController.deleteUser);
    
    module.exports = router;
    