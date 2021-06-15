'use strict';

const Service = require('egg').Service;

class InnerResourceService extends Service {
    async listByBranch(ipUserPrivilege) {
        let resList = [];
        if(ipUserPrivilege) {
            if(ipUserPrivilege.all) {
                resList = await this.app.mysql.select('v_resources_branch');
            } else {
                let where = '';
                if(ipUserPrivilege.branch) {
                    where += `branch_id in ( ${ipUserPrivilege.branch.join(',')} )`;
                }
                if(ipUserPrivilege.resource_group) {
                    if(where.length) {
                        where += ' OR ';
                    }
                    where += `id in (SELECT resource_id FROM group_resources WHERE group_id IN (${ipUserPrivilege.resource_group.join(',')}))`;
                }
                if(ipUserPrivilege.resource_type) {
                    if(where.length) {
                        where += ' OR ';
                    }
                    where += `type_id in (${ipUserPrivilege.resource_type.join(',')})`;
                }
                resList = await this.app.mysql.query(`SELECT * FROM v_resources_branch WHERE ${where}`);
            }
        }
         
        // 查询的数据已经按照 分支ID、类型ID、IP地址进行了排序
        const combined = this.combineByColumns(resList, 'resources', 'branch_id', 'branch');

        return combined;
    }

    async listByType() {
        const resList = await this.app.mysql.query('select * from v_resources_type');
        // 查询的数据已经按照 类型ID、分支ID、IP地址进行了排序
        const combined = this.combineByColumns(resList, 'resources', 'type_id', 'type');

        return combined;
    }

    combineByColumns(resList, to, ...cols) {
        const ordered = [];
        resList.forEach(element => {
            var last = null;
            if(ordered.length > 0) {
                last = ordered[ordered.length - 1];
            }
            if(last && cols.every(col => {
                return last[col] == element[col]
            })) {
                last[to].push(element);
            } else {
                last = {};
                cols.forEach(col => {
                    last[col] = element[col];
                });
                last[to] = [element];
                ordered.push(last);
            }
        });
        return ordered;
    }


}

module.exports = InnerResourceService;