'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/api/innerResource/getUserResources', controller.vpnUserResource.getUserResources);
  router.get('/api/adminUser/publicKey', controller.adminUser.getPublicKey);
  router.post('/api/adminUser/login', controller.adminUser.login);
  router.get('/api/adminUser/loginInfo', controller.adminUser.loginInfo);
  router.get('/api/adminUser/logout', controller.adminUser.logout);
  router.get('/api/adminUser/genBc/:pwd', controller.adminUser.genBc);
  router.get('/api/captcha', controller.captcha.getCaptcha);
  router.resources('resources', '/api/admin/resources', middleware.adminLogin(), controller.adminResource);
  router.resources('branches', '/api/admin/branches', middleware.adminLogin(), controller.adminBranch);
  router.resources('resource_types', '/api/admin/resource_types', middleware.adminLogin(), controller.adminResourceType);
  router.resources('menu', '/api/admin/menu', middleware.adminLogin(), controller.adminMenu);
};
