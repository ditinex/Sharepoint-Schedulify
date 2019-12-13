(function(){

  var valid = true;

  var init = function(){
    initUI()    
  };

  var initUI = function(){
    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      $('#app-status').prop('checked', appStatus);
    });
    chrome.runtime.sendMessage({cmd: 'app.getKey'}, function(response){
      if(!response)
        valid=false;
      setupMenu();
    });

    $('#app-status').change(function() {
      chrome.runtime.sendMessage({cmd: 'app.toggleStatus'}, function(appStatus){
        $('#app-status').prop('checked', appStatus);
      });
    });
    $('#validate').click(function() {
      name = $('#name').val()
      key = $('#key').val()
      chrome.runtime.sendMessage({cmd: 'api.validate', data: {name: name, key: key}}, function(response){
        valid = response
        setupMenu();
      });
    });
  };

  function setupMenu(){
    if(!valid){
      $('.validator').removeClass('hidden');
    }
    else{
      $('.validator').addClass('hidden');
      $('li a').click(function(){
        run($(this).attr('cmd'));
      });
    }
  }

  var run = function(action){
    if (action === 'create') {
      chrome.tabs.create({url: '/html/create.html'});
    }
    else if (action === 'newsfeed') {
      chrome.tabs.create({url: '/html/newsfeed.html'});
    }
  };


  return {
    init: init
  };

})().init();
