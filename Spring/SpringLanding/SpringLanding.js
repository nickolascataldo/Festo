Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'landing' });
  Festo.guard('the home page', function () { FestoLanding.mount(main, 'spring'); });
});
