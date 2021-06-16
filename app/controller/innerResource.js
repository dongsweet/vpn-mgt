'use strict';

const Controller = require('egg').Controller;

class InnerResourceController extends Controller {
  async getUserResources() {
    const { ctx, service } = this;
    const resList = await service.innerResource.getUserResources(ctx.ip);
    ctx.body = resList;
  }
}

module.exports = InnerResourceController;
