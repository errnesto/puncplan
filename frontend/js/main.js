(function(){
	"use strict";

	// document ready
	$(function() {
		$('#request-link').click(function (e) {
			e.preventDefault()

			var startTime = $('#starttime').val();
			var endTime   = $('#endtime').val();

			var backendUrl = 'http://mysterious-ridge-1941.herokuapp.com/showStat/';
			var data       = {
				starttime: startTime,
				endtime:   endTime
			}

			$.getJSON(backendUrl,data,function (result) {
				console.log(result);
			});
		});
	});

})();