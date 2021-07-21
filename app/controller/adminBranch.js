'use strict';

const Controller = require('egg').Controller;

class AdminBranchController extends Controller {
    async index() {
        const { ctx, service } = this;
        let branches = await service.adminBranch.list();
        ctx.body = branches;
    }
}

module.exports = AdminBranchController;