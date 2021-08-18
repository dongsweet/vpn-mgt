'use strict';

const Service = require('egg').Service;
const password = require('secure-random-password');


class AdminVpnUserService extends Service {
    async list() {
        let vpnUsers = await this.app.mysql.select('v_vpn_users');
        return {
            data: vpnUsers
        };
    }

    async getUser(username) {
        let vpnUser = await this.app.mysql.get('vpn_users', { username: username });
        return vpnUser;
    }

    async exist(username) {
        let vpnUser = await this.app.mysql.get('vpn_users', { username: username });
        if (!vpnUser) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 向Resource插入一条数据
     * @param {*} data 
     * @returns Resource ID
     */
    async create(data) {

        let result = await this.app.mysql.insert('vpn_users', data);

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        } else {
            return result.insertId;
        }
    }

    /**
     * 修改一条数据
     * @param {*} data 
     */
    async update(data) {
        const options = {
            where: {
                username: data.username
            }
        };
        let result = await this.app.mysql.update('vpn_users', data, options);

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async delete(username) {
        let result = await this.app.mysql.delete('vpn_users', { username: username });

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async getGroupPathList() {
        let groupPathList = await this.app.mysql.query('SELECT DISTINCT(group_path) FROM vpn_users ORDER BY group_path');
        return {
            data: groupPathList
        };
    }

    async sendResetPwdVerifyCode(username) {
        this.ctx.logger.info(`Requested verify code to reset password of ${username}`);

        let user = await this.getUser(username);
        if (!user) {
            this.ctx.logger.info(`User not found from local: ${username}`);
            throw new Error('用户信息未配置');
        }

        if (!user.mobile) {
            throw new Error('用户手机号码未配置');
        }

        let code = password.randomPassword({length: this.app.config.adminVpnUser.verifyLength, characters: password.digits});

        await this.service.sms.send(user.mobile, this.app.config.adminVpnUser.verifyMsg(code, this.app.config.adminVpnUser.verifyPeriod));

        this.ctx.logger.info(`Verify code to reset password of ${username} sent ${code}`);
        return code;
    }

    async resetPassword(username) {
        this.ctx.logger.info(`Requested password reset of ${username}`);

        let user = await this.getUser(username);
        if (!user) {
            this.ctx.logger.info(`User not found from local: ${username}`);
            throw new Error('用户信息未配置');
        }

        let pwd = password.randomPassword({characters: password.lower});

        // 若有异常继续抛出即可
        await this.service.sangforApi.initUserPwd(username, user.group_path, pwd);   

        this.ctx.logger.info(`Reset password of ${username} into ${pwd}`);
        return pwd;
    }



}

module.exports = AdminVpnUserService;