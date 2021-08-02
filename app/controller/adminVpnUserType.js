'use strict';

const Controller = require('egg').Controller;

class AdminVpnUserTypeController extends Controller {
    async index() {
        const { ctx, service } = this;
        let vpnUserTypes = await service.adminVpnUserType.list();
        ctx.body = vpnUserTypes;
    }
}

module.exports = AdminVpnUserTypeController;