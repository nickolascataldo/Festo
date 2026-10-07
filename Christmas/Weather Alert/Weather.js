Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'christmas', module: 'weather', subtitle: "Snowfall and light-show conditions" });
  Festo.guard('the weather page', function () {
    FestoWeather.mount(main, {
      season: 'christmas',
      title: "Snow & Frost Weather",
      eyebrow: "Winter watch",
      sub: "Snowfall, wind chill, and how good tonight is for a holiday light tour.",
      widgets: ["now","snow","lightShow","temp","wind","hourly","daily","moon"]
    });
  });
});
