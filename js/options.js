(function(){

  var settings = {};
  var status;


  var init = function(){
    initUI();
    // bug in FF49: no reply on first tab load
    var timer = setTimeout(function(){
      document.location.reload();
    }, 500);
    chrome.storage.local.get(null, function( data ){
      clearTimeout(timer);
      if (data.settings) settings = data.settings;
      processSettings();
      populateCountries();
      populateCurrencies();
    });
  };


  var checkMaintenance = function(){
    chrome.runtime.sendMessage({
      cmd: 'api.isOnline'
    }, function(response){
      if (!response.data) {
        $('.maintenance-msg')
          .removeClass('hidden')
          .text(response.message);
      }
    });
  };


  var initUI = function(){
    checkMaintenance();

    status = new Helpers.Status( $('#status'), {
      show: {method: 'slideDown', params: []},
      hide: {method: 'slideUp', params: []}
    } );

    $('input, select').change(function(e){
      // custom handler for sources list
      if (this.dataset.source) return;
      if (this.dataset.metric) return;
      var id = this.id;
      if (!id) return;
      if (this.type === 'checkbox') settings[id] = this.checked;
      else if (this.type === 'number') {
        settings[id] = parseFloat(this.value) || 0;
      }
      else if (this.type === 'radio') {
        settings[id] = this.value;
      }
      else settings[id] = $.trim(this.value);
      saveSettings();
    });

    $('#apiKey').keyup(function(e){
      if (e.keyCode === 13) {
        $(this).trigger('change');
        $('#validate').trigger('click');
      }
    });

    $('#validate').click(function(e){
      if (!settings.apiKey) {
        status.error('API key is empty', 3000);
        return;
      }
      chrome.runtime.sendMessage({
        cmd: 'api.checkApiKey',
        data: {key: settings.apiKey}
      }, function(json){
        if (json.error) status.error(json.data, 5000);
        else {
          if (json.data) {
            status.success('The API key is valid.', 3000);
            $('.error-msg').addClass('hidden');
          }
          else if (json.data === false) {
            status.error('The API Key is not valid. If you have generated it within the last 10 minutes, please wait till 10 minutes are up and check again. If not, then please email me at kevin@keywordseverywhere.com');
          }
          else {
            status.error('Please refresh the page or check your internet connection. If you continue having issues please email kevin@keywordseverywhere.com');
          }
        }
      });
    });
  };


  var processSettings = function(){
    if (!settings.apiKey) {
      $('.error-msg').removeClass('hidden').text('Please setup a valid API key');
    }
    processHighlightSettings();
    if (settings.apiKey) $('#apiKey').val(settings.apiKey);
    $('[name=input-dataSource][value=' + settings.dataSource + ']').prop('checked', true);
    $('#showAddAllButton').prop('checked', !!settings.showAddAllButton);
    $('#showExportButton').prop('checked', !!settings.showExportButton);
    $('#showMetricsForSuggestions').prop('checked', !!settings.showMetricsForSuggestions);
    $('#defaultPopupAction').val(settings.defaultPopupAction);
    $('#googlePos').val(settings.googlePos);
    var sourceListHTML = '';
    for (var key in SourceList) {
      var name = SourceList[key];
      sourceListHTML += getSourceInputHTML(key, name);
    }
    for (var key in settings.metricsList) {
      var checked = settings.metricsList[key];
      $('input[data-metric="' + key + '"').prop('checked', checked);
    }
    $('#sourceList').html( sourceListHTML );
    initSourceListClickHandlers();
    initMeticsListClickHandlers();
  };


  var processHighlightSettings = function(){
    'highlightVolume highlightCPC highlightComp'.split(' ').map(function(key){
      var condId = key + 'Cond';
      var valId = key + 'Value';
      $('#' + key).prop('checked', !!settings[key]);
      if (typeof settings[condId] !== 'undefined') {
        $('#' + condId).val( settings[condId] );
      }
      if (typeof settings[valId] !== 'undefined') {
        $('#' + valId).val( settings[valId] );
      }
    });
    if (settings.highlightColor) $('#highlightColor').val(settings.highlightColor);
  };


  var getSourceInputHTML = function( key, name ){
    var $input = $('<input/>');
    $input
      .attr('type', 'checkbox')
      .attr('data-source', key)
 	  .attr('style', 'height:20px; vertical-align:middle;');
    if (settings.sourceList && settings.sourceList[key]) {
      $input.attr('checked', true);
    }
    name = name.replace('(', '<br>(');
    var html = '<li><label class="container">' + $input[0].outerHTML + '&nbsp;' + name + '<span class="checkmark"></span></label></li>';
    return html;
  };


  var initSourceListClickHandlers = function(){
    $('#sourceList input[type=checkbox]').change(function(e){
      var checked = this.checked;
      var src = this.dataset.source;
      settings.sourceList[src] = checked;
      saveSettings();
    });
  };


  var initMeticsListClickHandlers = function(){
    $('#metricsList input[type=checkbox]').change(function(e){
      var checked = this.checked;
      var metric = this.dataset.metric;
      settings.metricsList[metric] = checked;
      saveSettings();
    });
  };


  var populateCountries = function(){
    chrome.runtime.sendMessage({cmd: 'api.getCountries'}, function(json){
      if (!json || !Object.keys(json).length) {
        status.error('An error has occured');
        return;
      }
      for (var key in json) {
        var $option = $('<option/>')
          .attr('value', key)
          .text(json[key]);
        if (settings.country === key) $option.attr('selected', 'true');
        $option.appendTo($('#country'));
      }
    });
  };


  var populateCurrencies = function(){
    chrome.runtime.sendMessage({cmd: 'api.getCurrencies'}, function(json){
      if (!json || !Object.keys(json).length) {
        status.error('An error has occured');
        return;
      }
      for (var key in json) {
        var $option = $('<option/>')
          .attr('value', key)
          .text(json[key]);
        if (settings.currency === key) $option.attr('selected', 'true');
        $option.appendTo($('#currency'));
      }
    });
  };


  var saveSettings = function(){
    chrome.storage.local.set({settings: settings});
    chrome.runtime.sendMessage({cmd: 'settings.update'});
  };


  return {
    init: init
  };

})().init();
