Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'weather', subtitle: "Moon, mist and trick-or-treat" });
  Festo.guard('the weather page', function () {
    FestoWeather.mount(main, {
      season: 'halloween',
      title: "Moon & Mist Weather",
      eyebrow: "Forecast for the witching hour",
      sub: "Moon phase, a just-for-fun spook meter, and a trick-or-treat preview for tonight.",
      widgets: ["now","haunt","moon","ootNight","wind","hourly","daily"]
    });
  });
});
