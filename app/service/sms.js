'use strict';

const Service = require('egg').Service;

class SmsService extends Service {

    async send(mobile, message) {
        this.app.logger.info(`Send to: ${mobile}, Message: ${message}`);
        const result = await this.app.curl(this.app.config.aliyunSms.api, {
            method: 'GET',
            headers: {
                'Authorization': `APPCODE ${this.app.config.aliyunSms.secret}`
            },
            dataType: 'json',
            data: {
                mobile: mobile,
                msg: message,
                sign: this.app.config.aliyunSms.sign
            }
        });
        this.ctx.logger.debug('Sms send result:', JSON.stringify(result));
        if (result.status == 200 && result.data.result == 0) {
            return;
        } else {
            this.ctx.logger.error('Sms send failed', result);
            throw new Error(`${result.status}: 短信发送失败`);
        }
    }

}

module.exports = SmsService;