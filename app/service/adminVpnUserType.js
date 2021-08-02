'use strict';

const Service = require('egg').Service;


class AdminVpnUserTypeService extends Service {
    async list() {
        let vpnUserTypes = await this.app.mysql.select('vpn_user_types');
        return {
            data: vpnUserTypes
        };
    }

}

module.exports = AdminVpnUserTypeService;