'use strict';

const Controller = require('egg').Controller;

class VpnUserResourceController extends Controller {
  async getUserResources() {
    const { ctx, service } = this;
    const resList = await service.vpnUserResource.getUserResources(ctx.ip);
    ctx.body = resList;
  }
}

module.exports = VpnUserResourceController;
