(function(){

  var init = function(){

    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      if(appStatus == false)
        return;

      var body = $('body');
      chrome.runtime.sendMessage({cmd: 'app.getPage'}, function(data){
        body.prepend(data);
      });

    });
  };

  function saveOptions(e) {
  	
  }

  function restoreOptions() {
  	
  }

  return {
    init: init
  };

})().init();
