'use strict';

const Service = require('egg').Service;
const { createHash } = require('crypto');

class SangforApiService extends Service {


    async initUserPwd(username, groupPath, pwd) {
        if(!pwd) {
            throw new Error('密码不可为空');
        }

        let user;
        try {
            user = await this.getUser(username);
        } catch (e) {
            this.ctx.logger.warn(`User not found from device: ${username}`, e);
            throw new Error('用户信息未同步');
        }

        let group;
        try {
            group = await this.getGroup(groupPath);
        } catch (e) {
            this.ctx.logger.warn(`User group not found from device: ${groupPath}`, e);
            throw new Error('用户组配置不正确');
        }

        if(group.id != user.grpid) {
            this.ctx.logger.warn(`User group not match: ${username}, local: ${groupPath}(${group.id}), device: ${user.grpid}`);
            throw new Error('用户组不匹配');
        }

        let params = {
            controler: 'User',
            action: 'UpdateUserCloud',
            old_name: username,
            new_name: username,
            parent_group: groupPath,
            passwd: pwd,
            // 怀疑为BUG，不填则变空
            note: user.note,
            phone: user.phone,
            delay_flush: 1
        };

        try {
            await this.doApiPost(params);
        } catch (e) {
            this.ctx.logger.error(`Reset password failed of ${username}.`, e);
            throw new Error('修改密码失败');
        }

        try {
            await this.saveChange();
        } catch (e) {
            this.ctx.logger.error(`Reset password save failed of ${username}.`, e);
            throw new Error('修改密码失败');
        }
    }

    async getGroup(groupPath) {
        let params = {
            controler: 'Group',
            action: 'GetGroupInfo',
            group_name: groupPath
        };

        return await this.doApiPost(params);
    }

    async getUser(username) {
        let params = {
            controler: 'User',
            action: 'ExGetUserInfo',
            username: username
        };

        return await this.doApiPost(params);
    }

    async doApiPost(params) {
        this.buildSinforApiToken(params);
        let postInfo = this.buildPostInfo(params);
        this.ctx.logger.debug('Post Data:', JSON.stringify(postInfo));
        const result = await this.app.curl(postInfo.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            rejectUnauthorized: false,
            dataType: 'json',
            data: postInfo.params
        });
        this.ctx.logger.debug('Result Data:', JSON.stringify(result));
        if (result.status == 200 && result.data.success == true) {
            return result.data.result;
        } else {
            throw new Error(result.data.message);
        }
    }

    async saveChange() {
        let params = {
            controler: 'Updater',
            action: 'DataSyncCloud',
        };

        return await this.doApiPost(params);
    }

    buildSinforApiToken(params) {
        let timestamp = Math.floor(Date.now() / 1000);
        params.timestamp = timestamp;

        let paramString = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
        let key = this.config.vpnDevice.secret;
        let signString = paramString + timestamp + key;

        let sha256 = createHash('sha256');
        sha256.update(signString);
        params['sinfor_apitoken'] = sha256.digest('hex');
    }

    buildPostInfo(params) {
        let url = this.config.vpnDevice.api(params.controler, params.action);
        let filter = ['controler', 'action'];
        let filteredParams = {};
        Object.keys(params).filter(k => {
            return !filter.includes(k);
        }).forEach(k => {
            filteredParams[k] = params[k];
        });

        return {
            url: url,
            params: filteredParams
        };
    }
}

module.exports = SangforApiService;