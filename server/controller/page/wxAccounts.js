const Parse = require('co-body');
const Accounts = require('../../model/Accounts');

exports.GET = async function (ctx) {
  const list = await Accounts.list();
  await ctx.render('wxAccounts', {list});
}

exports.POST = async function (ctx) {
  const formData = await Parse(ctx);
  console.log(formData);
  await Accounts.insert(formData);
  const list = await Accounts.list();
  await ctx.render('wxAccounts', {list});
}