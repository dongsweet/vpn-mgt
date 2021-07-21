'use strict';

const Controller = require('egg').Controller;

class AdminMenuController extends Controller {
    async index() {
        const { ctx, service } = this;
        let menu = await service.adminMenu.list();
        ctx.body = menu;
    }
}

module.exports = AdminMenuController;