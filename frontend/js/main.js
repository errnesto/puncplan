(function(){
	"use strict";

	// document ready
	$(function() {
		function getDataForLineAndPieChart(name){
			var a = name.split(" ");
			var data = {
				type : a[0],
				num : a[1]
			};
			var newJsonFileUrl = './data/sample.json';
			$.getJSON(newJsonFileUrl,function (result) {
				var ctx = $("#lineChart").get(0).getContext("2d");
				var data = transformDataForLineChart(result);
				var options = getOptionsForLineChart();
				var myLineChart = new Chart(ctx).Line(data, options);
				
				var pieElement = $("#pieChart").get(0).getContext("2d");
				var pieData = transformDataForPieChart(result);
				var pieOptions = getPieChartOptions();
				console.log(pieData);
				console.log(pieOptions);
				var myPieChart = new Chart(pieElement).Pie(pieData,pieOptions);
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
				var ctx = $("#barChart").get(0).getContext("2d");
				var data = transformDataForBarChart(result);
				var options = getOptionsForBarChart();
				var myBarChart = new Chart(ctx).Bar(data, options);
				$('canvas').click(function(evt){
				    var activeBars = myBarChart.getBarsAtEvent(evt);
				    $('#barChart').fadeOut("slow", function(){
				    	getDataForLineAndPieChart(activeBars[0].label);
				    });
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

		function getOptionsForBarChart(){
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

		function transformDataForBarChart(result){
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
		}

		function transformDataForPieChart(result){
			var colors = ["#F7464A", "#46BFBD", "#FDB45C",  "#2A0A29", "#A9F5F2", "#243B0B", "#FF8000",];
			var highlights = ["#F77274", "#6CCDCB", "#FFC883", "#724171", "#D4F8F7", "#5E7742", "#FFB366"];
			var data = [];
			for(var i = 0; i< result.length;i++){
				var entry = {
					value : result[i].avg,
					label: result[i].day,
					color : colors[i],
					highlight : highlights[i]
				};
				data.push(entry);
			}

			return data;
		}

		function getPieChartOptions(){
				var o = {
			    //Boolean - Whether we should show a stroke on each segment
			    segmentShowStroke : true,

			    //String - The colour of each segment stroke
			    segmentStrokeColor : "#fff",

			    //Number - The width of each segment stroke
			    segmentStrokeWidth : 2,

			    //Number - The percentage of the chart that we cut out of the middle
			    percentageInnerCutout : 50, // This is 0 for Pie charts

			    //Number - Amount of animation steps
			    animationSteps : 100,

			    //String - Animation easing effect
			    animationEasing : "easeOutBounce",

			    //Boolean - Whether we animate the rotation of the Doughnut
			    animateRotate : true,

			    //Boolean - Whether we animate scaling the Doughnut from the centre
			    animateScale : false,

			    //String - A legend template
			    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

			};

			return o;
		}


});

})();