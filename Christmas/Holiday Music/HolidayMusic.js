Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'music' });
  Festo.guard('the music page', function () { FestoMusic.mount(main, window.CHRISTMAS_MUSIC); });
});
