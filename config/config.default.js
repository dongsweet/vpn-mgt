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
    proxy: true
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1621350242096_9833';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
