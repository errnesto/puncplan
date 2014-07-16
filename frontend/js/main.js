(function(){
	"use strict";

	// document ready
	$(function() {
		function getDataForLineChart(name){
			var a = name.split(" ");
			var data = {
				type : a[0],
				num : a[1]
			};
			// var newJsonFileUrl = './data/sample.json';
			var newJsonFileUrl = 'C:/Users/anna/Documents/Uni/5.%20Semester/Open%20Data/punctualityplan/frontend/data/sample.json';
			$.getJSON(newJsonFileUrl,function (result) {
					result.sort(function(a,b) { return parseFloat(a.day) - parseFloat(b.day) } );
					result.reverse();
					var ctx = $("#myChart").get(0).getContext("2d");
					var data = transformDataForLineChart(result);
					var options = getOptionsForLineChart();
					var myLineChart = new Chart(ctx).Line(data, options);
				}).fail(function(error){
					console.log(error);
				});
		}

		function getDataForBarChart(backendUrl, data){
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
				    myBarChart.removeData();
				    getDataForLineChart(activeBars[0].label);
				});
			});
		}

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

			getDataForBarChart(backendUrl, data);

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

		function getOptionsForLineChart(){
			var o = {
			    ///Boolean - Whether grid lines are shown across the chart
			    scaleShowGridLines : true,

			    //String - Colour of the grid lines
			    scaleGridLineColor : "rgba(0,0,0,.05)",

			    //Number - Width of the grid lines
			    scaleGridLineWidth : 1,

			    //Boolean - Whether the line is curved between points
			    bezierCurve : true,

			    //Number - Tension of the bezier curve between points
			    bezierCurveTension : 0.4,

			    //Boolean - Whether to show a dot for each point
			    pointDot : true,

			    //Number - Radius of each point dot in pixels
			    pointDotRadius : 4,

			    //Number - Pixel width of point dot stroke
			    pointDotStrokeWidth : 1,

			    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			    pointHitDetectionRadius : 20,

			    //Boolean - Whether to show a stroke for datasets
			    datasetStroke : true,

			    //Number - Pixel width of dataset stroke
			    datasetStrokeWidth : 2,

			    //Boolean - Whether to fill the dataset with a colour
			    datasetFill : true,

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

		function transformDataForLineChart(result){
			var avgs = [];
			var days = [];
			for(var i = 0; i< result.length;i++){
				avgs.push(result[i].avg);
				days.push(result[i].day);
			}
			var data = {
				labels: days,
				datasets: [
				{
					label: "My First dataset",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: avgs
				}
				]
			};
			return data;
		};


});

})();