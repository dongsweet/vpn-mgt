'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/innerResource/listByBranch', controller.innerResource.listByBranch);
  router.get('/innerResource/listByType', controller.innerResource.listByType);
};
