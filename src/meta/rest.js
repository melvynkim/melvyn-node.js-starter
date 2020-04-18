import { Router } from 'express';
import buildInfo from '../../build.json';

const router = Router();

/**
 * @swagger
 *
 *  /meta/health:
 *   get:
 *     tags:
 *       - Meta
 *     summary: Services status
 *     operationId: metaStatus
 *     responses:
 *       '200':
 *         description: 'Server is running'
 * /meta/build:
 *   get:
 *     tags:
 *       - Meta
 *     summary: Meta build
 *     operationId: metaBuild
 *     responses:
 *       '200':
 *         description: 'Build information'
 */

router.get('/health', (req, res) => {
	return res.status(200).send('Server is running');
});

router.get('/build', (req, res) => {
	return res.json(buildInfo);
});

export default router;
