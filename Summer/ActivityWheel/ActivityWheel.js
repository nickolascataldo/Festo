Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'wheel', subtitle: 'Spin for a summer day' });
  Festo.guard('the wheel', function () { FestoWheel.mountPage(main, window.SUMMER_WHEEL); });
});
