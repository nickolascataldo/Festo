Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'map', subtitle: 'Lights, rinks, slopes and Santa' });
  Festo.guard('the map', function () { FestoMap.mount(main, Object.assign({ title: 'Light Radar' }, window.CHRISTMAS_MAP)); });
});
