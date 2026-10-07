Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'map', subtitle: 'Haunts, cemeteries and ghost stories' });
  Festo.guard('the Spectral Map', function () {
    FestoMap.mount(main, Object.assign({ title: 'Spectral Map' }, window.HALLOWEEN_MAP));
  });
});
