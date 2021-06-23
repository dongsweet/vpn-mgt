'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcrypt');

class AdminUserController extends Controller {
  async testBcrypt() {
    const { ctx, service } = this;
    const test = {
      txx: await bcrypt.hash('12345678', 10)
    }
    ctx.body = test;
  }
  
}

module.exports = AdminUserController;