(function(){

  var currentUrl = window.location.href;
  var template = '';
  var cc = '';
  var subject = '';

  var init = function(){

    chrome.runtime.sendMessage({cmd: 'app.getStatus'}, function(appStatus){
      if(appStatus == false)
        return;

      chrome.runtime.sendMessage({cmd: 'app.getTemplate'}, function(data){

        if(data[0] == currentUrl){
          template = data[1];
          cc = data[2];
          subject = data[3];
          $('#replyarea').val(template);
          $(".form-group input[name='subject']").val(subject);
          if(cc)
            showCC();
        }
      });

    });
  };

  function showCC(){
    var body = $('body');
    ui = '<div id="dialog" title="Dont forget to add CC"><textarea style="background-color:rgb(247, 191, 168); width: 100%;height: 100%;color:#000;">'+cc+'</textarea></div>';
    body.prepend(ui);
    $("body #dialog").dialog({
      position: { my: "center", at: "right bottom", of: window },
    });
  }

  return {
    init: init
  };

})().init();
