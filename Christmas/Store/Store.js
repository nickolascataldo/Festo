Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'store', subtitle: 'Apparel, decor, crafts and treats' });
  Festo.guard('the shop', function () { FestoStore.mount(main, window.CHRISTMAS_STORE); });
});
