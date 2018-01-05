const nextRoutes = require('next-routes');

const routes = module.exports = nextRoutes();

routes.add({ name: 'index', pattern: '/' });
routes.add({ name: 'login', pattern: '/login' });
routes.add({ name: 'logout', pattern: '/logout' });
routes.add({ name: 'products', pattern: '/products' });
