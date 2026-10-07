Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'spring', module: 'weather', subtitle: "Pollen, air and rain" });
  Festo.guard('the weather page', function () {
    FestoWeather.mount(main, {
      season: 'spring',
      title: "Pollen & Rain Weather",
      eyebrow: "Fresh air, fewer sneezes",
      sub: "Pollen guidance, air quality, UV and rain chances for your spring plans.",
      widgets: ["now","pollen","air","uv","rain","temp","hourly","daily","sun"]
    });
  });
});
