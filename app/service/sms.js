'use strict';

const Service = require('egg').Service;

class SmsService extends Service {

    async send(mobile, templateId, code, period) {
        this.app.logger.info(`Send to: ${mobile}, TemplateId: ${templateId}, Code: ${code}, Period: ${period}`);
        const result = await this.app.curl(this.app.config.aliyunSms.api, {
            method: 'POST',
            headers: {
                'Authorization': `APPCODE ${this.app.config.aliyunSms.secret}`
            },
            dataType: 'json',
            data: {
                mobile: mobile,
                param: this.app.config.aliyunSms.param(code, period),
                smsSignId: this.app.config.aliyunSms.smsSignId,
                templateId: templateId
            }
        });
        this.ctx.logger.debug('Sms send result:', JSON.stringify(result));
        if (result.status == 200 && result.data.code == "0") {
            return;
        } else {
            this.ctx.logger.error('Sms send failed', result);
            throw new Error(`${result.status}: 短信发送失败`);
        }
    }

}

module.exports = SmsService;