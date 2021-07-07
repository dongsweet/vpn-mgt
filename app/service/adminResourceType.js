'use strict';

const Service = require('egg').Service;


class AdminResourceTypeService extends Service {
    async list() {
        let resTypes = await this.app.mysql.select('resource_types');
        return {
            data: resTypes
        };
    }

}

module.exports = AdminResourceTypeService;