'use strict';

const Service = require('egg').Service;

const SELECT = 'username, realname, ip, group_path, branch_id, branch, type_id, type, tag, service_ip, service_domain, service_url, real_ip, description, classify_type, classify_display, res_display';

class VpnUserResourceService extends Service {
    async getUserResources(ip) {
        let resList = await this.app.mysql.query(`SELECT ${SELECT} FROM v_user_resources WHERE ip='${ip}'`);
        if (!resList.length) {
            //若未查到数据，按未知用户进行查询
            resList = await this.app.mysql.query(`SELECT ${SELECT} FROM v_user_resources WHERE ip='0.0.0.0'`);
        }

        // 查询的数据已经按照 分支ID、类型ID、IP地址进行了排序
        const userResources = this.toUserResources(ip, resList);

        return userResources;
    }

    toUserResources(ip, resList) {
        if (!resList.length) {
            return resList;
        }
        
        const classified = {};
        resList.forEach(element => {
            let classifyType = element['classify_type'];
            let clazz = element[classifyType];
            // 根据分类类型，查询对象中是否已初始化该类型结构
            let clazzRes = classified[clazz];

            if (!clazzRes) {
                // 未进行过初始化，新建
                let clazzDispField = element['classify_display'];
                clazzRes = {
                    clazz: element[clazzDispField],
                    resources: []
                };
                classified[clazz] = clazzRes;
            }
            // 将真实数据放入resources数组中
            let resDispField = element['res_display'];
            // 取指定字段的值作名称
            element.name = element[resDispField];
            clazzRes.resources.push(element);
        });
        let classifiedList = [];
        Object.keys(classified).sort((a, b) => a - b).forEach(clazz => {
            classifiedList.push(classified[clazz]);
        });
        return {
            realname: resList[0]["realname"],
            ip: ip,
            usertype: resList[0]["usertype"],
            username: resList[0]["username"],
            group_path: resList[0]["group_path"],
            classified: classifiedList
        };
    }


}

module.exports = VpnUserResourceService;