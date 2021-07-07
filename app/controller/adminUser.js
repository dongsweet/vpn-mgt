'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcrypt');

class AdminUserController extends Controller {
    async getPublicKey() {
        const { app, ctx } = this;
        const key = app.key;
        const pubKey = key.exportKey('pkcs8-public');
        ctx.body = pubKey;
    }

    async login() {
        const { app, ctx, service } = this;

        if(ctx.session.captchaUsed) {
            ctx.body = this.getResult(false, '验证码已使用');
            return;
        }
        // 解码
        const key = app.key;
        let dec = key.decrypt(ctx.request.body.enc, 'utf8');   
        let loginData = JSON.parse(dec);

        // 对比验证码
        ctx.session.captchaUsed = true;
        if(!loginData.captcha || ctx.session.captcha.toLowerCase() != loginData.captcha.toLowerCase()) {
            ctx.body = this.getResult(false, '验证码错误');
            return;
        }

        // 对比用户名密码
        if(await service.adminUser.checkUserPwd(loginData.username, loginData.password)) {
            ctx.body = this.getResult(true);
            ctx.session.adminUser = loginData.username;
        } else {
            ctx.body = this.getResult(false, '用户名或密码错误');
        }
        
    }

    async logout() {
        const { ctx } = this;
        ctx.session.adminUser = null;
        ctx.body = this.getResult(true);
    }

    getResult(result, msg) {
        return {
            result: result,
            msg: msg
        };
    }

    async genBc() {
        const { ctx } = this;
        ctx.body = await bcrypt.hash(ctx.params.pwd, this.config.adminUser.bcryptSaltRound);
    }
}

module.exports = AdminUserController;