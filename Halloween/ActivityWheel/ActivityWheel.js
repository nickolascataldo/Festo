Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'wheel', subtitle: 'Four kinds of Halloween night' });
  Festo.guard('the Activity Wheel', function () { FestoWheel.mountPage(main, window.HALLOWEEN_WHEEL); });
});
