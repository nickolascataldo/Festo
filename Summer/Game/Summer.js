Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'game', subtitle: 'Tap to drop. Line it up.' });
  Festo.guard('the game', function () { FestoArcade.mount(main, window.SUMMER_ARCADE); });
});
