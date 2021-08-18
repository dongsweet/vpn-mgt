'use strict';

const Controller = require('egg').Controller;
const password = require('secure-random-password');

class AdminVpnUserController extends Controller {
    validate = {
        group_path: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        username: {
            type: 'string'
        },
        realname: {
            type: 'string'
        },
        ip: {
            type: 'IP4'
        },
        mobile: {
            type: 'string'
        },
        enabled: {
            type: 'int',
            min: 0,
            max: 1
        }
    };

    getResult(result, msg) {
        return {
            result: result,
            msg: msg
        };
    }

    async index() {
        const { ctx, service } = this;
        let vpnUserList = await service.adminVpnUser.list();
        ctx.body = vpnUserList;
    }

    async getAvailableIPs() {
        const { ctx, service } = this;
        let ipList = await service.adminVpnUserIP.getAvailableIPs();
        ctx.body = ipList;
    }

    async getGroupPathList() {
        const { ctx, service } = this;
        let groupPathList = await service.adminVpnUser.getGroupPathList();
        ctx.body = groupPathList;
    }

    async create() {
        const { ctx, service } = this;

        let createObj = ctx.request.body;
        for (let key of Object.keys(createObj)) {
            if ('' === createObj[key]) {
                createObj[key] = null;
            }
        }

        ctx.validate(this.validate);

        try {
            let id = await service.adminVpnUser.create(createObj);
        } catch (err) {
            console.log(err);
            ctx.body = this.getResult(false, '添加数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async update() {
        const { ctx, service } = this;

        let updateObj = ctx.request.body;
        for (let key of Object.keys(updateObj)) {
            if ('' === updateObj[key]) {
                updateObj[key] = null;
            }
        }
        if (ctx.params.id != updateObj.username) {
            ctx.status = 422;
            return;
        }
        ctx.validate(this.validate);

        try {
            await service.adminVpnUser.update(updateObj);
        } catch (err) {
            console.log(err);
            ctx.body = this.getResult(false, '修改数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async destroy() {
        const { ctx, service } = this;
        try {
            await service.adminVpnUser.delete(ctx.params.id);
        } catch (err) {
            console.log(err);
            ctx.body = this.getResult(false, '删除数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async getUserFromDevice() {
        const { ctx, service } = this;

        try {
            await service.adminVpnUser.getUserFromDevice(ctx.query.username);
        } catch (err) {
            console.log(err);
            ctx.body = this.getResult(false, '查询数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async sendResetPwdVerifyCode() {
        const { ctx, service, app } = this;

        if (ctx.session.captchaUsed) {
            ctx.body = this.getResult(false, '验证码已使用');
            return;
        }

        ctx.session.captchaUsed = true;
        if (!ctx.query.captcha || ctx.session.captcha.toLowerCase() != ctx.query.captcha.toLowerCase()) {
            ctx.body = this.getResult(false, '验证码错误');
            return;
        }

        let code;
        try {
            code = await service.adminVpnUser.sendResetPwdVerifyCode(ctx.query.username);
        } catch (err) {
            ctx.body = this.getResult(false, err.message);
            return;
        }

        ctx.session.resetPassword = {
            username: ctx.query.username,
            code: code,
            create: Date.now()
        };

        ctx.body = this.getResult(true);
    }

    async resetPassword() {
        const { ctx, service, app } = this;

        if (!ctx.session.resetPassword) {
            ctx.body = this.getResult(false, '请先获取验证码');
            return;
        }
        if (ctx.session.resetPassword.username != ctx.query.username
            || Date.now() - ctx.session.resetPassword.create > app.config.adminVpnUser.verifyPeriod * 60 * 1000
            || ctx.query.code != ctx.session.resetPassword.code) {
            ctx.body = this.getResult(false, '验证码错误或已失效');
            return;
        }

        ctx.session.resetPassword = null;

        let password;
        try {
            password = await service.adminVpnUser.resetPassword(ctx.query.username);
        } catch (err) {
            ctx.body = this.getResult(false, err.message);
            return;
        }
        ctx.body = this.getResult(true, password);
    }

}

module.exports = AdminVpnUserController;