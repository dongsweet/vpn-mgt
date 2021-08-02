'use strict';

const Service = require('egg').Service;
const IPREG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

class AdminVpnUserIPService extends Service {


    async getAvailableIPs() {
        let poolIP = await this.getPoolIPInt();
        let usedIP = await this.getUsedIPInt();
        let available = poolIP.filter(el => {
            return !usedIP.includes(el);
        }).sort((a, b) => { return a - b; }).map(el => {
            let ip = ((el >>> 24) & 0xff) + '.' + ((el >>> 16) & 0xff) + '.' + ((el >>> 8) & 0xff) + '.' + (el & 0xff);
            return ip;
        });

        return {
            data: available
        };
    }

    async getPoolIPInt() {
        let pool = new Set();
        let ipRanges = await this.app.mysql.select('vpn_ip_ranges');
        for (let ipRange of ipRanges) {
            let start = this.ipToInt(ipRange.start);
            let end = this.ipToInt(ipRange.end);
            for (let ip = start; ip <= end; ip++) {
                pool.add(ip);
            }
        }
        return Array.from(pool.values());
    }

    async getUsedIPInt() {
        let used = await this.app.mysql.select('vpn_users', {
            columns: ['ip'],
            where: { type: 'vpn' }
        });
        return used.map(v => { return this.ipToInt(v.ip) });
    }

    ipToInt(ip) {
        var result = IPREG.exec(ip);
        if (!result) return -1;
        return (parseInt(result[1]) << 24
            | parseInt(result[2]) << 16
            | parseInt(result[3]) << 8
            | parseInt(result[4])) >>> 0;
    }

}

module.exports = AdminVpnUserIPService;