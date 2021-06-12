module.exports = options => {
    return async function (ctx, next) {
        const ip = ctx.ip;
        ctx.ipUserPrivilege = await ctx.service.vpnUserPrivilege.getIpUserPrivilege(ip);
        if (!ctx.ipUserPrivilege) {
            ctx.logger.warn(`Access IP ${ip} not return a privilege object.`);
        }
        await next();
    };
};