$(function() {
	// Initialize variables
	var $window = $(window);
	var $messages = $('.tae-status'); // Messages area
	var $inputMessage = $('.tae-input'); // Input message input box
	
	// first call
	request = $.ajax({
		type: 'POST',
		url : 'adv.php',
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		data : {data: ''},
		datatype: "html",
		success: function(data) {
			obj = jQuery.parseJSON(data);
			addAdvMessage(obj);
		}
	});

	// Sends a chat message
	const sendMessage = () => {
	  var message = $inputMessage.val();
	  // Prevent markup from being injected into the message
	  message = cleanInput(message);
	  // if there is a non-empty message and a socket connection
	  if (message) {
		$inputMessage.val('');
		addChatMessage(message);
		var s = message.replace(/\s+/g, ' ').toLowerCase().trim();
		if (s.length == 0) return false;
		request = $.ajax({
			type: 'POST',
			url : 'adv.php',
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data : {data: s},
			datatype: "html",
			success: function(data) {
				obj = jQuery.parseJSON(data);
				addAdvMessage(obj);
			}
		});
	
	  }
	}

	const addDivMessage = (cls, val) => {
		var $messageBodyDiv = $('<span class="' + cls + '"/>').append(val);
		return $('<li class="message"/>').append($messageBodyDiv);
	}



	const addChatMessage = (message, options) => {
		var $messageBodyDiv = $('<span class="tae-msgBodyUser">').text(message);
		var $messageDiv = $('<li class="message"/>').append($messageBodyDiv);
		$messages.append($messageDiv);
		$messageBodyDiv = $('<span class="tae-msgBodyUser">').append('&nbsp;');
		$messageDiv = $('<li class="message"/>').append($messageBodyDiv);
		$messages.append($messageDiv);
		$messages[0].scrollTop = $messages[0].scrollHeight;
	}

	const addAdvMessage = (msg, options) => {
		var $messageBodyDiv = '';
		var $messageDiv = '';
		console.log(msg);
		if (msg.message.length>0) {
			msg.message.forEach(function(currmsg) {
				var fields = currmsg.split('\n');
				fields.forEach(function(entry) {
					$messageBodyDiv = $('<span class="tae-msgBodyMsg"/>').append(entry.trim());
					$messageDiv = $('<li class="message"/>').append($messageBodyDiv);
					$messages.append($messageDiv);
				});
			});
			$messageBodyDiv = $('<span class="tae-msgBodyMsg"/>').append('&nbsp;');
			$messageDiv = $('<li class="message"/>').append($messageBodyDiv);
			$messages.append($messageDiv);	
		}
		msg.status.forEach(function(currstatus) {
			var fields = currstatus.split('\n');
			fields.forEach(function(entry) {
				$messageBodyDiv = $('<span class="tae-msgBodyStatus"/>').append(entry.trim());
				$messageDiv = $('<li class="message"/>').append($messageBodyDiv);
				$messages.append($messageDiv);
			});
		});
		$messages[0].scrollTop = $messages[0].scrollHeight;
	}

	// Prevents input from having injected markup
	const cleanInput = (input) => {
		return $('<div/>').text(input).html();
	}

	// Keyboard events
	$window.keydown(event => {
	  if (!(event.ctrlKey || event.metaKey || event.altKey)) { // Auto-focus the current input when a key is typed
		$inputMessage.focus();
	  }
	  if (event.which === 13) { // When the client hits ENTER on their keyboard
		sendMessage();
	  }
	});
  
/*	$inputMessage.on('input', () => {
	});
  */
	// Click events
	$inputMessage.click(() => { // Focus input when clicking on the message input's border
	  $inputMessage.focus();
	});
  
});