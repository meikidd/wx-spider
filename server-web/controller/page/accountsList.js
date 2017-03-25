const Accounts = require('../../model/Accounts');

exports.GET = async function (ctx) {
  const list = await Accounts.list();
  await ctx.render('accountsList', {list});
}