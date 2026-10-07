Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'summer', module: 'weather', subtitle: "UV index and sunburn advice" });
  Festo.guard('the weather page', function () {
    FestoWeather.mount(main, {
      season: 'summer',
      title: "Weather & Sun Safety",
      eyebrow: "Stay sun-smart",
      sub: "Temperature, wind, rain and a colour-coded UV index with sunburn advice.",
      widgets: ["now","uv","temp","wind","rain","hourly","daily","sun","moon"]
    });
  });
});
