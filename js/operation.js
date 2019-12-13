(function(){

  var clientData = {}

  var clientLink = 'https://portal.cirrushosting.com/admin/index.php?cmd=clients&action=show&id=';

  var init = function(){
    $("#create").click(function(e){
    	e.preventDefault();
    	var formdata = $("#create_form").serializeArray();
    	chrome.runtime.sendMessage({cmd: 'api.create', data: formdata}, function(data){
    		if(data)
    			showlistUI(data);
    	});
    	$("#create_form").find("input[type=text], textarea").val("");
    	alert('Client added/updated');

    });
    $("#delete").click(function(e){
    	e.preventDefault();
    	let client = $('#client').val();
    	chrome.runtime.sendMessage({cmd: 'api.delete', data: client}, function(d){
    		if(d)
    			showlistUI(d);
    	});
    	$("#create_form").find("input[type=text], textarea").val("");
    	alert('Client deleted !');

    });
    $('ol').on('click', 'a', function(){
    	$("ol a").removeClass('active');
    	$(this).addClass('active');
    	let item = $(this).attr('client');
    	let client = clientData[item];
    	Object.keys(client).forEach(function(key) {
    		$('#client').val(item);
  			$('#'+key).val(client[key]);
  		});
      $('#gotoclient').html('<a href="'+clientLink+client['client_id']+'">>> </a>')
    });
    chrome.runtime.sendMessage({cmd: 'api.get'}, function(response){
    	showlistUI(response);
    });

  };

  function showlistUI(response){
  	clientData = response;
  	ui = '';

  	Object.keys(response).forEach(function(item) {
  		ui = ui+'<li><a href="#" class="pure-menu-item" client="'+item+'">'+item+'</a></li>';
  	});

  	$('.pure-menu-list').html(ui);
  }

  return {
    init: init
  };

})().init();
