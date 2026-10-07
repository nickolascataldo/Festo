Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'store', subtitle: 'Wear, make, decorate and taste' });
  Festo.guard('the shop', function () { FestoStore.mount(main, window.SPRING_STORE); });
});
