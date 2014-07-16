(function(){
	"use strict";

	// document ready
	$(function() {
		$('#request-link').click(function (e) {
			$('#vis').html("");
			e.preventDefault()

			var startTime = $('#starttime').val();
			var endTime   = $('#endtime').val();

			var backendUrl = 'http://mysterious-ridge-1941.herokuapp.com/showStat/';
			var data       = {
				starttime: startTime,
				endtime:   endTime
			}

			$.getJSON(backendUrl,data,function (result) {
				result.sort(function(a,b) { return parseFloat(a.avg) - parseFloat(b.avg) } );
				result.reverse();
				console.log(result);

				var table = "<table>";
				for(var i = 0; i<result.length;i++){
					table+= "<tr>";
					table+= "<td>" + result[i].vehicle_type + "</td>";
					table+= "<td>" + result[i].vehicle_number + "</td>";
					table+= "<td>" + Math.round(result[i].avg) + " min</td>";
					table+= "</tr>";
				}
				table += "</table>";
				$('#vis').html(table);
			});

		});
	});

})();