Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'music' });
  Festo.guard('the music page', function () { FestoMusic.mount(main, window.SPRING_MUSIC); });
});
