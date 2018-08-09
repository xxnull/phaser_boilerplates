(function () {
  function TableManager(selector) {
    this._element = document.querySelector(selector);
  }

  TableManager.prototype.clear = function () {
    this._element.innerHTML = '';
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

    this._element.appendChild(row);
    return row;
  }

  var table = new TableManager('#table');
  var graph = document.getElementById('graph');
  var chart;

  function createGraph(parent, height) {
    return Highcharts.chart({
      title: '',
      chart: {
        renderTo: parent,
        type: 'line',
        height: height,
      },
      plotOptions: {
        series: {
          pointStart: 1
        }
      },
      xAxis: {
        max: 5,
        allowDecimals: false,
        title: {
          text: 'Total number of trials'
        }
      },
      yAxis: {
        min: 0,
        max: 1,
        title: {
          text: 'Experimental Probability'
        },
        lineWidth: 1
      },
      series: [{
        name: 'red',
        data: []
      }],
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      }
    });
  }

  function updateTable(history) {
    table.clear();
    var landsOnRed = 0;

    if (history.length) {
      var rows = history.reduce(function (prev, cur, index, arr) {
        var row = [];
        var trials = cur[0];
        landsOnRed += cur[1] === Spinner.colors.RED.color ? 1 : 0;
        var percent = landsOnRed / trials;
        row.push({ text: trials, attr: { width: '30%' } });
        row.push({ text: landsOnRed, attr: { width: '30%' } });
        row.push({
          text: (percent * 100).toFixed(1) + '%',
          attr: { width: '40%' },
          percent: percent,
        });
        prev.push(row);
        return prev;
      }, []);

      rows.forEach(function (row) {
        table.addRow(row);
      });

      var data = rows.map(function (row) {
        return [row[0].text, parseFloat(row[2].percent.toFixed(2))];
      });

      var trials = data.map(function (row) { return row[0]; });
      var maxTrial = Math.max.apply(Math, trials);
      var max = maxTrial < 5 ? maxTrial + (5 - maxTrial) : maxTrial;
      chart.xAxis[0].setExtremes(0, max);
      chart.series[0].addPoint(data[data.length - 1]);
    }
  }

  function disable(node, spinning) {
    if (spinning) node.setAttribute('disabled', 'disabled');
    else node.removeAttribute('disabled');
  }

  function createSpinner(container, slices) {
    var parent = document.querySelector(container + ' .spinner-container');
    var spin = document.querySelector(container + ' .spin-btn');
    var size = parent.clientHeight;
    var select = document.getElementById('select');
    var spinner = new Spinner.Game(size, parent, { slices: slices });

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

    var tableContainer = document.querySelector('.table-container');
    spinner.events.on('history:update', function (history) {
      updateTable(history);
      scrollTableContainer(tableContainer);
    });

    spin.addEventListener('click', spinner.spin.bind(spinner));
    chart = createGraph(graph, size);
  }

  function start() {
    var setup = localStorage.getItem('spinner');

    if (setup) {
      setup = JSON.parse(setup).map(function (color) {
        return { color: color };
      });

      if (setup.some(function (obj) { return !obj.color.lighter; })) {
        localStorage.setItem('spinner', '');
        setup = null;
      }
    }

    var spinner = {
      container: '#spinner-wrapper-1',
      slices: setup ? setup : [
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.RED },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.RED },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.BLUE },
        { color: Spinner.colors.BLUE },
      ],
    };

    createSpinner(spinner.container, spinner.slices);
    onWindowResize();
  }

  function scrollTableContainer(container) {
    TweenLite.to(container, 1, {
      scrollTo: container.scrollHeight,
    });
  }

  function onWindowResize() {
    var size = document.querySelector('#spinner-wrapper-1 .spinner-container').clientHeight;
    var headHeight = document.querySelector('.table-head').clientHeight;
    var tableContainer = document.querySelector('.table-container');
    tableContainer.style.maxHeight = size + 'px';
    tableContainer.style.paddingTop = headHeight + 'px';
    chart.setSize(graph.parentElement.clientWidth - 30, size - 40);
  }

  window.onload = start;
  window.onresize = onWindowResize;
})();
