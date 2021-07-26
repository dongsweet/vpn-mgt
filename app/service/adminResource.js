'use strict';

const Service = require('egg').Service;
const uuidv4 = require('uuid').v4;


class AdminResourceService extends Service {
    async list() {
        let resources = await this.app.mysql.select('v_resources_branch');
        // , {
        //     offset: Number(start),
        //     limit: Number(length)
        // });
        // let resCount = await this.app.mysql.query('SELECT count(*) FROM v_resources_branch');
        // let total = resCount[0]['count(*)'];
        return {
            // recordsTotal: total,
            // recordsFiltered: total,
            data: resources
        };
    }

    /**
     * 向Resource插入一条数据
     * @param {*} data 
     * @returns Resource ID
     */
    async create(data) {

        let branch = await this.app.mysql.get('branches', { branch_id: data.branch_id });
        if (!branch) {
            throw new Error('错误的分支ID');
        }

        let type = await this.app.mysql.get('resource_types', { type_id: data.type_id });
        if (!type) {
            throw new Error('错误的业务类型ID');
        }

        data.resource_id = uuidv4();

        let result = await this.app.mysql.insert('resources', data);

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
                resource_id: data.resource_id
            }
        };

        let result = await this.app.mysql.update('resources', data, options);

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

    async delete(resource_id) {
        let result = await this.app.mysql.delete('resources', { resource_id: resource_id });

        if (1 !== result.affectedRows) {
            throw new Error(result.message);
        }
    }

}

module.exports = AdminResourceService;