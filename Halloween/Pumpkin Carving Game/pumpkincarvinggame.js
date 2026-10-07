Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'pumpkin' });
  Festo.guard('the pumpkin studio', function () { FestoPumpkin.mount(main, { storageKey: 'festo_halloween_pumpkin' }); });
});
