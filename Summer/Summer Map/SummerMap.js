Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'map', subtitle: 'Beaches, pools, markets and stars' });
  Festo.guard('the map', function () { FestoMap.mount(main, Object.assign({ title: 'Summer Map' }, window.SUMMER_MAP)); });
});
