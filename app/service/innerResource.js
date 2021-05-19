'use strict';

const Service = require('egg').Service;

class InnerResourceService extends Service {
    async listByBranch() {
        const resList = await this.app.mysql.query('select * from v_resources_branch');
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