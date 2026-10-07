Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'workshop', subtitle: 'Decorate, then save your picture' });
  Festo.guard('the workshop', function () { FestoStudio.mount(main, window.CHRISTMAS_WORKSHOP); });
});
