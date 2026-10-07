Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'wheel', subtitle: 'Spin for a spring quest' });
  Festo.guard('the wheel', function () { FestoWheel.mountPage(main, window.SPRING_WHEEL); });
});
