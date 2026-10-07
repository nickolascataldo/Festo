Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'store', subtitle: 'Costumes, decor, crafts & treats' });
  Festo.guard('the Coven Boutique', function () { FestoStore.mount(main, window.HALLOWEEN_STORE); });
});
