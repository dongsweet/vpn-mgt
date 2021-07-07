'use strict';

const Controller = require('egg').Controller;

class AdminResourceController extends Controller {
    validate = {
        branch_id: {
            type: 'int'
        },
        type_id: {
            type: 'int'
        },
        tag: {
            type: 'string?'
        },
        service_ip: {
            type: 'IP4'
        },
        service_domain: {
            type: 'string?'
        },
        service_url: {
            type: 'url?'
        },
        real_ip: {
            type: 'IP4?'
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
        let resList = await service.adminResource.list();
        ctx.body = resList;
    }

    async create() {
        const { ctx, service } = this;

        let createObj = ctx.request.body;
        for(let key of Object.keys(createObj)) {
            if(!createObj[key]) {
                createObj[key] = null;
            }
        }

        ctx.validate(this.validate);

        try {
            let id = await service.adminResource.create(createObj);
        } catch(err) {
            console.log(err);
            ctx.body = this.getResult(false, '添加数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async update() {
        const { ctx, service } = this;

        let updateObj = ctx.request.body;
        for(let key of Object.keys(updateObj)) {
            if(!updateObj[key]) {
                updateObj[key] = null;
            }
        }
        if(ctx.params.id != updateObj.id) {
            ctx.status = 422;
            return;
        }
        ctx.validate(this.validate);

        try {
            await service.adminResource.update(updateObj);
        } catch(err) {
            console.log(err);
            ctx.body = this.getResult(false, '修改数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }

    async destroy() {
        const { ctx, service } = this;
        try {
            await service.adminResource.delete(ctx.params.id);
        } catch(err) {
            console.log(err);
            ctx.body = this.getResult(false, '删除数据失败');
            return;
        }
        ctx.body = this.getResult(true);
    }


}

module.exports = AdminResourceController;