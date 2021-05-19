'use strict';

const Controller = require('egg').Controller;

class InnerResourceController extends Controller {
  async listByBranch() {
    const { ctx, service } = this;
    const resList = await service.innerResource.listByBranch();
    ctx.body = resList;
  }

  async listByType() {
    const { ctx, service } = this;
    const resList = await service.innerResource.listByType();
    ctx.body = resList;
  }
}

module.exports = InnerResourceController;
