'use strict';
const NodeRSA = require('node-rsa');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    this.app.key= new NodeRSA();
    this.app.key.generateKeyPair();
    // TODO 不该继续使用pkcs1方案了，但由于前端库的限制，暂时不好替换
    this.app.key.setOptions({encryptionScheme: 'pkcs1'});
    console.log('Genereate key pair');


    this.app.validator.addRule('IP4', (rule, value) => {
      if(false == rule.required) {
        if(!value) {
          return true;
        }
      }
      if(false == /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/.test(value)) {
        return 'Must be a valid IPv4 address';
      }
    });
  }

}

module.exports = AppBootHook;