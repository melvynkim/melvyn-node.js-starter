import { Router } from 'express';

import helloWorld from '~/hello-world/rest';
import crudOperations from '~/crud-operations/rest';
import authorization from '~/authorization/rest';
import meta from '~/meta/rest';

const router = Router();

router.get('/', (req, res) => {
  res.send('app-root');
});

/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     jwt token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 			 description: You can obtain your token on /auth/login
 *
 * tags:
 *  - name: Auth
 *    description: Authentication and Authorization operations
 */
router.use('/auth', authorization);
router.use('/hello-world', helloWorld);
router.use('/crud-operations', crudOperations);
router.use('/authorization', authorization);
router.use('/meta', meta);

export default router;
