'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcrypt');

class AdminUserService extends Service {
    async checkUserPwd(username, pwd) {
        let adminUser = await this.app.mysql.get('admin_users', { username: username });
        if(!adminUser) {
            return false;
        }
        return await bcrypt.compare(pwd, adminUser.password);
    }

}

module.exports = AdminUserService;