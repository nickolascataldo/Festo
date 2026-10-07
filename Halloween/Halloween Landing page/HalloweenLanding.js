Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'landing' });
  Festo.guard('the home page', function () { FestoLanding.mount(main, 'halloween'); });
});
