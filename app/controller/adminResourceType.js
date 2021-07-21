'use strict';

const Controller = require('egg').Controller;

class AdminResourceTypeController extends Controller {
    async index() {
        const { ctx, service } = this;
        let resTypes = await service.adminResourceType.list();
        ctx.body = resTypes;
    }
}

module.exports = AdminResourceTypeController;