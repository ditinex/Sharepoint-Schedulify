(function(){

  var init = function(){
    initUI()    
  };

  var initUI = function(){
    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      $('#app-status').prop('checked', appStatus);
    });

    $('#app-status').change(function() {
      chrome.runtime.sendMessage({cmd: 'app.toggleStatus'}, function(appStatus){
        $('#app-status').prop('checked', appStatus);
      });
    });
    setupMenu();
  };

  function setupMenu(){
    $('li a').click(function(){
      run($(this).attr('cmd'));
    });
  }

  var run = function(action){
    if (action === 'create') {
      chrome.tabs.create({url: '/html/create.html'});
    }
    else if (action === 'manual') {
      chrome.tabs.create({url: 'https://keywordseverywhere.com/ke/1/manual.php'});
    }
    else if (action === 'favorite') {
      chrome.tabs.create({url: 'https://keywordseverywhere.com/ke/1/favorites.php'});
    }
  };


  var showDisabledWarning = function(){
    $('#disabledWarning').removeClass('hidden');
    setTimeout(function(){
      $('#disabledWarning').addClass('hidden');
    }, 2000);
  };

  var injectIframe = function(params){
    if (!params.apiKey) return;
    var src = 'https://keywordseverywhere.com/ke/popup.php?apiKey=' + params.apiKey + '&t=' + Date.now();
    $('<iframe/>').attr('src', src).appendTo($('#iframe-root'));
  };


  


  var populateCountries = function(settings){
    chrome.runtime.sendMessage({cmd: 'api.getCountries'}, function(json){
      if (!json || !Object.keys(json).length) {
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


  return {
    init: init
  };

})().init();
