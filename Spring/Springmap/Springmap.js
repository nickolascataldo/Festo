Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'map', subtitle: 'Gardens, blooms and birding' });
  Festo.guard('the map', function () { FestoMap.mount(main, Object.assign({ title: 'Garden Trails' }, window.SPRING_MAP)); });
});
