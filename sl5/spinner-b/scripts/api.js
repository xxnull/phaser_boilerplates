var API = (function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function fetch(path, callback) {
    $.getJSON(path + 'settings.json', callback);
  }

  function setText(selector, text) {
    var node = document.querySelector(selector);
    node.textContent = text;
  }

  function fetchSettings(path, callback) {
    API.fetch(path, function (settings) {
      var lang = API.getParameterByName('lang') || 'EN';
      if (!lang in settings.lang) lang = 'EN';
      callback(settings.lang[lang], settings.setup);
    });
  }

  return {
    fetch: fetch,
    getParameterByName: getParameterByName,
    setText: setText,
    fetchSettings: fetchSettings,
  };
})();
