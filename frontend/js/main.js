(function(){
	"use strict";

	// document ready
	$(function() {
		$('#request-link').click(function (e) {
			//$('#vis').html("");
			e.preventDefault()

			var startTime = $('#starttime').val();
			var endTime   = $('#endtime').val();

			var backendUrl = 'http://mysterious-ridge-1941.herokuapp.com/showStat/';
			var data       = {
				starttime: startTime,
				endtime:   endTime
			}

			function createTableFromResult() {
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
			}

			function createDivsFromResult(result) {
				var div = $('<div/>');
				for(var i = 0; i<result.length;i++){
					var el = $('<div/>', {
						style: "width: " + result[i].avg * 10 + "px; height: " + result[i].avg * 10 + "px; background-color: " + getColor(result[i].avg)+";",
						id: result[i].vehicle_type + result[i].vehicle_number
					}).addClass('bubbles');
					var p = $('<p/>', {
						text : result[i].vehicle_type + " " + result[i].vehicle_number
					});
					el.append(p);
					div.append(el);
				}
				$('#vis').html(div);
			}

			function getColor(avg){
				if(avg <= 2){
					return "green";
				}else if(avg <= 6){
					return "orange";
				}else{
					return "red";
				}
			}

			$.getJSON(backendUrl,data,function (result) {
				result.sort(function(a,b) { return parseFloat(a.avg) - parseFloat(b.avg) } );
				result.reverse();
				// createTableFromResult(result);
				createDivsFromResult(result);

			});

		});
	});

})();