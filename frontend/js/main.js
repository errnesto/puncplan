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
				// createDivsFromResult(result);
				var ctx = $("#myChart").get(0).getContext("2d");
				var data = transformData(result);
				var options = getOptions();
				var myBarChart = new Chart(ctx).Bar(data, options);
				$('canvas').click(function(evt){
				    var activeBars = myBarChart.getBarsAtEvent(evt);
				    console.log(activeBars[0].label);
				});

			});

			function getOptions(){
				var o = {
				    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
				    scaleBeginAtZero : true,

				    //Boolean - Whether grid lines are shown across the chart
				    scaleShowGridLines : true,

				    //String - Colour of the grid lines
				    scaleGridLineColor : "rgba(0,0,0,.05)",

				    //Number - Width of the grid lines
				    scaleGridLineWidth : 1,

				    //Boolean - If there is a stroke on each bar
				    barShowStroke : true,

				    //Number - Pixel width of the bar stroke
				    barStrokeWidth : 2,

				    //Number - Spacing between each of the X value sets
				    barValueSpacing : 5,

				    //Number - Spacing between data sets within X values
				    barDatasetSpacing : 1,

				    //String - A legend template
				    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

				};

				return o;
			}

			function transformData(result){
				var avgs = [];
				var labels = [];
				for(var i = 0; i< result.length;i++){
					avgs.push(result[i].avg);
					labels.push(result[i].vehicle_type + " " + result[i].vehicle_number);
				}
				var data = {
						    labels: labels,
						    datasets: [
						        {
						            label: "My First dataset",
						            fillColor: "rgba(220,220,220,0.5)",
						            strokeColor: "rgba(220,220,220,0.8)",
						            highlightFill: "rgba(220,220,220,0.75)",
						            highlightStroke: "rgba(220,220,220,1)",
						            data: avgs
						        }
						       ]
						    };
				return data;
			}

		});
	});

})();