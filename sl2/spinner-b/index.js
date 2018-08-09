(function () {
  function disable(btn, spinning) {
    if (spinning) btn.setAttribute('disabled', 'disabled');
    else btn.removeAttribute('disabled');
  }

  function createSpinner(container, slices) {
    var parent = document.querySelector(container + ' .spinner-container');
    var spin = document.querySelector(container + ' .spin-btn');
    var size = parent.clientHeight - 50;
    var spinner = new Spinner.Game(size, parent, { slices: slices, factor: 1 });

    disable(spin, true);

    spinner.events.on('ready', function () {
      disable(spin, false);
    });

    spinner.events.on('spin:start', function (count) {
      disable(spin, true);
    });

    spinner.events.on('spin:end', function (count, color) {
      disable(spin, false);
    });

    spin.addEventListener('click', spinner.spin.bind(spinner));
  }

  function displayTexts(lang) {
    var texts = {
      '#btn': lang.spinButtonText
    };

    for (var selector in texts) {
      if (texts.hasOwnProperty(selector)) {
        API.setText(selector, texts[selector]);
      }
    }
  }

  function displaySpinner(settings) {
    var spinner = {
      container: '#spinner-wrapper-1',
      slices: settings.sections.map(function (color) {
        return { color: Spinner.colors[color] };
      }),
    };

    createSpinner(spinner.container, spinner.slices);
  }

  function start() {
    API.fetchSettings('./', function (lang, settings) {
      displayTexts(lang);
      displaySpinner(settings);
    });
  }

  window.onload = start;
})();
