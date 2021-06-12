'use strict';

const Service = require('egg').Service;

class VpnUserPrivilegeService extends Service {
    async findUserByIp(ip) {
        let user = await this.app.mysql.get('vpn_users', { ip: ip });
        if (!user) {
            user = {
                id: 0,
                realname: "UnknownUser",
                ip: ip
            };
        }
        return user;
    }

    async listUserPrivilege(userId) {
        return await this.app.mysql.select('vpn_user_privileges', {
            where: { vpn_user_id: userId }
        });
    }

    async getIpUserPrivilege(ip) {
        let user = await this.findUserByIp(ip);
        let privilegeList = await this.listUserPrivilege(user.id);
        let privilege = {};
        privilegeList.forEach(element => {
            let type = element.privilege_type;
            if (!privilege[type]) {
                privilege[type] = [];
            }
            privilege[type].push(element.privilege_value);
        });
        return privilege;
    }
}

module.exports = VpnUserPrivilegeService;