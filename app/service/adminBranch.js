'use strict';

const Service = require('egg').Service;


class AdminBranchService extends Service {
    async list() {
        let branches = await this.app.mysql.select('branches');
        return {
            data: branches
        };
    }

}

module.exports = AdminBranchService;