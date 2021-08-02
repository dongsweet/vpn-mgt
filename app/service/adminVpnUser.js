'use strict';

const Service = require('egg').Service;


class AdminVpnUserService extends Service {
    async list() {
        let vpnUsers = await this.app.mysql.select('v_vpn_users');
        return {
            data: vpnUsers
        };
    }

    async exist(username) {
        let vpnUser = await this.app.mysql.get('vpn_users', {username: username});
        if(!vpnUser) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 向Resource插入一条数据
     * @param {*} data 
     * @returns Resource ID
     */
    async create(data) {

        let result = await this.app.mysql.insert('vpn_users', data);

        if (1 !== result.affectedRows) {
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
        const options = {
            where: {
                username: data.username
            }
        };
        let result = await this.app.mysql.update('vpn_users', data, options);

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async delete(username) {
        let result = await this.app.mysql.delete('vpn_users', { username: username });

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async getGroupPathList() {
        let groupPathList = await this.app.mysql.query('SELECT DISTINCT(group_path) FROM vpn_users ORDER BY group_path');
        return {
            data: groupPathList
        };
    }

}

module.exports = AdminVpnUserService;