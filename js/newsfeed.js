(function(){

  var clientData = {}
  var name = ''

  var init = function(){
    $("#create").click(function(e){
    	e.preventDefault();
    	var formdata = $("#create_form").serializeArray();
    	chrome.runtime.sendMessage({cmd: 'api.addnewsfeed', data: formdata}, function(data){
    		if(data)
    			showlistUI(data);
    	});
    	$("#create_form").find("input[type=text], textarea").val("");
    	alert('Newsfeed Updated!');

    });
    
    chrome.runtime.sendMessage({cmd: 'api.getnewfeed'}, function(response){
    	if(response){
        showlistUI(response);
      }
    });

  };

  function showlistUI(response){
  	clientData = response;
  	ui = '';

  	response.forEach(function(item) {
      ui = ui+'<div class="card">'+
                '<div class="card-body">'+
                  '<h6 class="card-subtitle mb-2 text-muted">'+item.date+'</h6>'+
                  '<blockquote class="blockquote mb-0">'+
                    '<p>'+item.message+'</p>'+
                    '<footer class="blockquote-footer">'+item.name+'</footer>'+
                  '</blockquote>'+
                '</div>'+
              '</div>';
  	});

  	$('#newsfeeds').html(ui);
  }

  return {
    init: init
  };

})().init();
