Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'wheel', subtitle: 'Spin for tonight\'s plan' });
  Festo.guard('the wheel', function () { FestoWheel.mountPage(main, window.CHRISTMAS_WHEEL); });
});
