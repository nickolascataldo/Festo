Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'store', subtitle: 'Swim, wear, outdoors and eat' });
  Festo.guard('the shop', function () { FestoStore.mount(main, window.SUMMER_STORE); });
});
