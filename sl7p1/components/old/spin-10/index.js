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
  var simulations = 10;
  var initialMax = simulations * 5;
  var chart;

  function createGraph(parent, height) {
    return Highcharts.chart({
      title: '',
      chart: {
        renderTo: parent,
        type: 'line',
        height: height,
        animation: {
          duration: 150,
          easing: 'swing'
        }
      },
      plotOptions: {
        series: {
          pointStart: 1
        }
      },
      xAxis: {
        min: 0,
        max: initialMax,
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

    if (history.length) {
      var groups = history.reduce(function (collection, data, index) {
        var index = Math.floor(index / simulations);

        if (!collection[index]) {
          collection[index] = [];
        }

        collection[index].push(data);
        return collection;
      }, []);

      var landsOnRed = 0;
      var rows = groups.map(function (group, index) {
        var row = [];
        var trials = group.length + (group.length * index);
        landsOnRed += group.reduce((count, data) => {
          return data[1] === Spinner.colors.RED.color ? count + 1 : count;
        }, 0);
        var percent = landsOnRed / trials;

        row.push({ text: trials, attr: { width: '30%' } });
        row.push({ text: landsOnRed, attr: { width: '30%' } });
        row.push({
          text: (percent * 100).toFixed(1) + '%',
          percent: percent,
          attr: { width: '40%' },
        });

        return row;
      }, []);

      rows.forEach(function (row) {
        table.addRow(row);
      });
    }
  }

  function disable(node, spinning) {
    if (spinning) node.setAttribute('disabled', 'disabled');
    else node.removeAttribute('disabled');
  }

  function animateSpinButton(spin, duration) {
    var n = 1;
    var interval = setInterval(function () {
      if (n > simulations) {
        clearInterval(interval);
      } else {
        spin.textContent = 'Spin ' + n++;
      }
    }, (duration * 1000) / simulations);
  }

  function createSpinner(container, slices) {
    var parent = document.querySelector(container + ' .spinner-container');
    var spin = document.querySelector(container + ' .spin-btn');
    var size = parent.clientHeight;
    var spinner = new Spinner.Game(size, parent, {
      slices: slices,
      blurMotion: {
        enable: true,
        addRounds: 4,
        fadeTimeUnit: 20,
        fadeAlphaUnit: 1,
      },
    });

    disable(spin, true);

    spinner.events.on('ready', function () {
      disable(spin, false);
    });

    spinner.events.on('spin:start', function (duration) {
      disable(spin, true);
      animateSpinButton(spin, duration);
    });

    spinner.events.on('spin:end', function () {
      disable(spin, false);
    });

    var tableContainer = document.querySelector('.table-container');
    spinner.events.on('history:update', function (history) {
      updateTable(history);
      updateGraph(history);
      scrollTableContainer(tableContainer);
    });

    spinner.events.on('simulations:end', function (history, time) {
      updateGraph(history, true, time);
    });

    spin.addEventListener('click', spinner.spin.bind(spinner, simulations));
    chart = createGraph(graph, size);
  }

  function updateGraph(history, simulate, time) {
    var acc = 0;
    var data = history.map(function (row) {
      var trial = row[0];
      acc += row[1] === 'RED' ? 1 : 0;
      var percent = parseFloat((acc / trial).toFixed(2))
      return [trial, percent];
    });

    var trials = data.map(function (row) { return row[0]; });
    var maxTrial = Math.max.apply(Math, trials);
    var max = maxTrial < initialMax ? maxTrial + (initialMax - maxTrial) : maxTrial;
    chart.xAxis[0].setExtremes(0, max);

    var subtract = simulate ? simulations - 1 : simulations;
    var latestData = data.slice(history.length - subtract);

    if (simulate) {
      var duration = time * 1000;
      var timeInterval = duration / latestData.length;
      var index = 0;
      var interval = setInterval(function () {
        chart.series[0].addPoint(latestData[index++]);
        if (index === latestData.length) clearInterval(interval);
      }, timeInterval);
    } else {
      chart.series[0].addPoint(latestData[latestData.length - 1]);
    }
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
    chart.setSize(graph.parentElement.clientWidth - 30, size - 30);
  }

  window.onload = start;
  window.onresize = onWindowResize;
})();
