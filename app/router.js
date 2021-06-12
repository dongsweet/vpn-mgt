'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/api/innerResource/listByBranch', middleware.ipToPrivilege(), controller.innerResource.listByBranch);
  router.get('/api/vpnUser/getUserByIp', controller.vpnUser.getUserByIp);
};
