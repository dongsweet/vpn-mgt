'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class CaptchaController extends Controller {
    async getCaptcha() {
        const { app, ctx } = this;
        const captcha = svgCaptcha.create();
        ctx.session.captcha = captcha.text;
        ctx.session.captchaUsed = false;
        ctx.set('content-type', 'image/svg+xml');
        ctx.body = captcha.data;
    }
    
}
  
module.exports = CaptchaController;