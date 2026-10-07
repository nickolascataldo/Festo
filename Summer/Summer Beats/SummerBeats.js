Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'music' });
  Festo.guard('the music page', function () { FestoMusic.mount(main, window.SUMMER_MUSIC); });
});
