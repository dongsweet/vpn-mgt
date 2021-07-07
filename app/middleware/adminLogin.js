module.exports = options => {
    return async function(ctx, next) {
        if(ctx.session.adminUser) {
            await next();
        } else {
            ctx.status = 401;
        }
    }
}