'use strict';

const Controller = require('egg').Controller;

class VpnUserController extends Controller {
  async getUserByIp() {
    const { ctx, service } = this;
    const user = await service.vpnUserPrivilege.findUserByIp(ctx.ip);
    ctx.body = user;
  }
  
}

module.exports = VpnUserController;