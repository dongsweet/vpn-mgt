'use strict';

const Service = require('egg').Service;


class AdminVpnUserService extends Service {
    async list() {
        let vpnUsers = await this.app.mysql.select('vpn_users');
        return {
            data: vpnUsers
        };
    }

    /**
     * 向Resource插入一条数据
     * @param {*} data 
     * @returns Resource ID
     */
    async create(data) {
        let result = await this.app.mysql.insert('resources', data);

        if(1 !== result.affectedRows) {
            throw new Error(result.message);
        } else {
            return result.insertId;
        }
    }

    /**
     * 修改一条数据
     * @param {*} data 
     */
     async update(data) {
        let result = await this.app.mysql.update('resources', data);

        if(1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async delete(id) {
        let result = await this.app.mysql.delete('resources', {id: id});

        if(1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

}

module.exports = AdminVpnUserService;