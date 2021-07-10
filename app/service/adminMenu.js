'use strict';

const Service = require('egg').Service;


class AdminMenuService extends Service {
    async list() {
        let menu = await this.app.mysql.select('menu', {
            orders: [['parent_menu_id', 'asc'], ['order', 'asc']]
        });
        return {
            data: menu
        };
    }

}

module.exports = AdminMenuService;