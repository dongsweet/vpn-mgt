'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcrypt');

class AdminUserService extends Service {
    async checkUserPwd(username, pwd) {
        let adminUser = await this.app.mysql.get('admin_users', { username: username });
        if (!adminUser) {
            return false;
        }
        if (await bcrypt.compare(pwd, adminUser.password)) {
            return adminUser;
        } else {
            return null;
        }
    }

}

module.exports = AdminUserService;