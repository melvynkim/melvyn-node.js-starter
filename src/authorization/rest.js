import passport from 'passport';
import { Router } from 'express';

import { hasRole } from './service';
import { Register, Login, ActivateAccount, Profile, TestJWT } from './controller';

const router = Router();

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: register new User
 *     operationId: register
 *     description: |
 *       By passing in the appropriate options, you can register in the system.
 *       After registration you have to confirm you email by submitting received verification code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: registering and retrieving Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: user's email
 *                 message:
 *                   type: string
 *                   description: success message
 *       '400':
 *         description: bad input parameter
 *       '422':
 *         description: bad input parameter
 */
router.post('/register', Register);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: log in
 *     operationId: login
 *     description: |
 *       By passing in the appropriate options, you can retrive your Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: retrieving Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Bearer token
 *       '400':
 *         description: bad input parameter
 *       '404':
 *         description: User not found
 *       '422':
 *         description: bad input parameter
 */
router.post('/login', Login);

/**
 * @swagger
 *
 * /auth/activateAccount:
 *   post:
 *     tags:
 *       - Auth
 *     summary: activates account with plain verification code (by code in email)
 *     operationId: activateByCode
 *     description: |
 *       By passing in the appropriate options, you can activate your profile info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               activationCode:
 *                 type: string
 *             required:
 *               - email
 *               - activationCode
 *     responses:
 *       '200':
 *         description: activates account with plain verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Bearer token
 *       '400':
 *         description: bad input parameter
 *       '422':
 *         description: bad input parameter
 */
router.post('/activateAccount', ActivateAccount);

/**
 * @swagger
 *
 * /auth/activateAccount:
 *   get:
 *     tags:
 *       - Auth
 *     summary: activates account with hashed verification code (by URL in email)
 *     operationId: activateByLink
 *     description: |
 *       By passing in the appropriate options, you can activate your profile 
 *     parameters:
 *       - in: query
 *         name: email
 *         description: email
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: activationCode
 *         description: activation hash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: activates account with hashed verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Bearer token
 *       '400':
 *         description: bad input parameter
 *       '422':
 *         description: bad input parameter
 */
router.get('/activateAccount', ActivateAccount);

/**
 * @swagger
 *
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: returns User's profile data
 *     operationId: profile
 *     description: |
 *       By passing in the appropriate options, you can receive your profile info
 *     security:
 *     	 - jwt token: []
 *     responses:
 *       '200':
 *         description: retrieving User's profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Bearer token
 *       '400':
 *         description: bad input parameter
 *       '422':
 *         description: bad input parameter
 */
router.get('/me', passport.authenticate('jwt', { session: false }), Profile);

/*
 * TEST ROUTES
 */
router
    .post('/check-jwt', passport.authenticate('jwt', { session: false }), TestJWT)
    .post('/check-user-role', passport.authenticate('jwt', { session: false }), hasRole('user'), TestJWT)
    .post('/check-admin-role', passport.authenticate('jwt', { session: false }), hasRole('admin'), TestJWT);


export default router;
