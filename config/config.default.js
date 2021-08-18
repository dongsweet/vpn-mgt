/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: 'db',
        // 端口号
        port: '3306',
        // 用户名
        user: 'vpn-mgt',
        // 密码
        password: 'Wxsgy@2021',
        // 数据库名
        database: 'vpn-mgt',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    proxy: true,
    validate: {
      convert: true,
      // validateRoot: false,
    },
    logger: {
      consoleLevel: 'DEBUG',
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1621350242096_9833';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    adminUser: {
      bcryptSaltRound: 10
    },
    vpnDevice: {
      api: (controller, action) => `https://vpn.dev.sgwan.cn:4430/cgi-bin/php-cgi/html/delegatemodule/WebApi.php?controler=${controller}&action=${action}`,
      secret: 'f8946cfa3b52b0bf3d4bca55cc0f7697'
    },
    aliyunSms: {
      api: 'http://smsbanling.market.alicloudapi.com/smsapis',
      secret: '31ea3d0f6b7d483d98756a5ba937720a',
      sign: '曙光云SGWAN'
    },
    adminVpnUser: {
      verifyMsg: (code, period) => `您正在重置VPN密码，验证码${code}，切勿泄露于他人，有效期${period}分钟`,
      verifyPeriod: 10,
      verifyLength: 4
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
