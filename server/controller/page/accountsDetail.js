const Accounts = require('../../model/Accounts');
const Articles = require('../../model/Articles');

exports.GET = async function (ctx) {
  const account = await Accounts.get(ctx.params.id);
  const articles = await Articles.listByWxId(account.wx_id);
  await ctx.render('accountsDetail', {account, articles});
}