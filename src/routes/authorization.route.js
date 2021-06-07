import express from 'express';

function initAuthorizationRoute(authorizationController) {
    const router = express.Router();

    router.route('/login')
        .post(authorizationController.login);

    return router;
}

export default initAuthorizationRoute;
