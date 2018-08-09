(function () {
  function TableManager(selector) {
    this.table = document.querySelector(selector);
  }

  TableManager.prototype.clear = function () {
    this.table.innerHTML = '';
  }

  TableManager.prototype.addRow = function (rowData) {
    var row = document.createElement('tr');
    rowData.forEach(function (cellData) {
      var cell = document.createElement('td');
      cell.textContent = cellData.text;

      if (!cellData.attr) cellData.attr = {};

      for (var property in cellData.attr) {
        if (cellData.attr.hasOwnProperty(property)) {
          cell.setAttribute(property, cellData.attr[property]);
        }
      }

      row.appendChild(cell);
    });

    this.table.appendChild(row);
    return row;
  }

  var table = new TableManager('#table');

  function updateTable(history, lang) {
    table.clear();

    if (history.length) {
      history.map(function (row) {
        return row.map(function (text, index) {
          return { text: text };
        });
      }).forEach(function (row) {
        var color = row[1].text;
        row[1].text = lang.colors[color];
        var tr = table.addRow(row);
        tr.classList.add('row--' + color.toLowerCase());
      });
    }
  }

  function disable(node, spinning) {
    if (spinning) node.setAttribute('disabled', 'disabled');
    else node.removeAttribute('disabled');
  }

  function createSpinner(container, config) {
    var tableContainer = document.querySelector('.table-container');
    var parent = document.querySelector(container + ' .spinner-container');
    var spin = document.querySelector(container + ' .spin-btn');
    var size = parent.clientHeight;
    var select = document.getElementById('select');
    var spinner = new Spinner.Game(size, parent, {
      editionMode: config.setupMode,
      slices: config.slices,
      allowedColors: config.allowedColors,
    });

    disable(spin, true);

    spinner.events.on('ready', function () {
      if (!spinner._editing) {
        disable(spin, false);
      }
    });

    spinner.events.on('spin:start', function (count) {
      disable(spin, true);
      disable(select, true);
    });

    spinner.events.on('spin:end', function (count, color) {
      disable(spin, false);
      disable(select, false);
    });

    spinner.events.on('edition:on', function () {
      disable(spin, true);
    });

    spinner.events.on('edition:change', function (readyToSpin) {
      disable(spin, !readyToSpin);
    });

    spinner.events.on('history:update', function (history) {
      updateTable(history, config.lang);
      scrollTableContainer(tableContainer);
    });

    updateTable([], config.lang);

    spin.addEventListener('click', spinner.spin.bind(spinner));
  }

  function scrollTableContainer(container) {
    TweenLite.to(container, 1, {
      scrollTo: container.scrollHeight,
    });
  }

  function displayTexts(lang) {
    var texts = {
      '#btn': lang.spinButtonText,
      '#select-text': lang.selectLabelText,
      '#trial': lang.tableHeaderTrial,
      '#outcome': lang.tableHeaderOutcome,
    };

    for (var selector in texts) {
      if (texts.hasOwnProperty(selector)) {
        API.setText(selector, texts[selector]);
      }
    }
  }

  function displaySpinner(lang, settings) {
    var spinner = {
      container: '#spinner-wrapper-1',
      allowedColors: settings.allowedColors.map(function (color) {
        return { color: color };
      }),
      slices: settings.sections.map(function (color) {
        return { color: Spinner.colors[color] };
      }),
    };

    createSpinner(spinner.container, {
      setupMode: settings.setupMode,
      slices: spinner.slices,
      allowedColors: spinner.allowedColors,
      lang: lang
    });
  }

  function start() {
    API.fetchSettings('./', function (lang, settings) {
      displayTexts(lang);
      displaySpinner(lang, settings);
      setMaxHeight();
    });
  }

  function setMaxHeight() {
    var size = document.querySelector('#spinner-wrapper-1 .spinner-container').clientHeight;
    var tableContainer = document.querySelector('.table-container');
    tableContainer.style.maxHeight = size + 'px';
  }

  window.onload = start;
  window.onresize = setMaxHeight;
})();
