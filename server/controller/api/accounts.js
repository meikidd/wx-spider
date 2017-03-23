const Parse = require('co-body');
const Accounts = require('../../model/Accounts');

exports.POST = async function (ctx) {
  const body = ctx.request.body;
  if(body.method === 'DELETE') {
    await exports.DELETE(ctx);
  } else {
    delete body.method;
    await Accounts.insert(body);
    ctx.redirect('/page/accounts_list');
  }
}

exports.DELETE = async function (ctx) {
  const body = ctx.request.body;
  await Accounts.remove(body.id);
  ctx.redirect('/page/accounts_list');  
}