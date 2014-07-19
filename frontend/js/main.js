(function(){
	"use strict";

	// document ready
	$(function() {
		var s= 0;
		function getDataForLineAndPieChart(data){
			var newJsonFileUrl = 'https://puncplan.canopus.uberspace.de/fcgi-bin/punctualityplan/allLines';
			$.getJSON(newJsonFileUrl,function (result) {
				var ctx = $("#lineChart").get(0).getContext("2d");
				var data = transformDataForLineChart(result);
				var options = getOptionsForLineChart();
				var myLineChart = new Chart(ctx).Line(data, options);
				
				var pieElement = $("#pieChart").get(0).getContext("2d");
				var pieData = transformDataForPieChart(result);
				var pieOptions = getPieChartOptions();
				var myPieChart = new Chart(pieElement).Pie(pieData,pieOptions);
				s.stop();
			}).fail(function(error){
				console.log(error);
			});
		}

		function getDataForBarChart(backendUrl, data){
			$.getJSON(backendUrl,data,function (result) {
				result.sort(function(a,b) { return parseFloat(a.avg) - parseFloat(b.avg) } );
				result.reverse();
				createDropdown(result);
				var ctx = $("#barChart").get(0).getContext("2d");
				var data = transformDataForBarChart(result);
				var options = getOptionsForBarChart();
				var myBarChart = new Chart(ctx).Bar(data, options);

				s.stop();
				$('canvas').click(function(evt){
				    var activeBars = myBarChart.getBarsAtEvent(evt);
				    $('#barChart').fadeOut("slow", function(){
				    	createSpinner();
				    	var a = activeBars[0].label.split(" ");
						var data = {
							type : a[0],
							num : a[1]
						};
				    	getDataForLineAndPieChart(data);
				    });
				});
			});
		}

		function createDropdown(result){
			var selectBus = $('<select/>',{id: "bus"});
			var selectTram = $('<select/>',{id: "tram"});
			for(var i=0;i<result.length;i++){
				var o = $('<option/>', {
					text: result[i].vehicle_number
				});
				if(result[i].vehicle_type == "Bus"){
					selectBus.append(o);
				}else{
					selectTram.append(o);
				}
			}

			var bus = $('<label/>',{
				for: "bus",
				text: "Busse"
			}).append(selectBus);

			var tram = $('<label/>',{
				for: "tram",
				text: "Trams"
			}).append(selectTram);

			$('#bus')
						.html(bus)
						.change(function(){
							var data = {
								type : "Bus",
								num : this.value
							};
							$('#barChart').fadeOut("slow", function(){
								getDataForLineAndPieChart(data);
							});
			});

			$('#tram')
						.html(tram)
						.change(function(){
							var data = {
								type : "Tram",
								num : this.value
							};
							 $('#barChart').fadeOut("slow", function(){
								getDataForLineAndPieChart(data);
							});
			});
		}

		$('#request-link').click(function (e) {
			//$('#vis').html("");
			e.preventDefault();
			createSpinner();
			var startTime = $('#from').val();
			var endTime   = $('#to').val();

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

		function createSpinner(){
			var opts = {
				  lines: 13, // The number of lines to draw
				  length: 20, // The length of each line
				  width: 10, // The line thickness
				  radius: 30, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: '#000', // #rgb or #rrggbb or array of colors
				  speed: 1, // Rounds per second
				  trail: 60, // Afterglow percentage
				  shadow: false, // Whether to render a shadow
				  hwaccel: false, // Whether to use hardware acceleration
				  className: 'spinner', // The CSS class to assign to the spinner
				  zIndex: 2e9, // The z-index (defaults to 2000000000)
				  top: '50%', // Top position relative to parent
				  left: '50%' // Left position relative to parent
				};
			s= new Spinner(opts).spin($('#sp')[0]);
		}

		$( "#from" ).datepicker({
	      defaultDate: "-1w",
	      changeMonth: true,
	      numberOfMonths: 1,
	      maxDate: 0,
	      dateFormat: "yymmdd",
	      onClose: function( selectedDate ) {
	        $( "#to" ).datepicker( "option", "minDate", selectedDate );
	      },
	      onChange: function(){
	      	console.log(this);
	      }
	    });
	    $( "#to" ).datepicker({
	      defaultDate: "-7D",
	      changeMonth: true,
	      numberOfMonths: 1,
	      maxDate: 0,
	      dateFormat: "yymmdd",
	      onClose: function( selectedDate ) {
	        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
	      }
	    });
});

})();