(function(){
	"use strict";

	// document ready
	$(function() {

		var firstPossibleDate = new Date(2014,6,19);

		Chart.defaults.global.scaleFontFamily  = "'pt Mono', sans-serif";
		Chart.defaults.global.scaleOverride    = true;
		Chart.defaults.global.scaleSteps       = 5;
		Chart.defaults.global.scaleStepWidth   = 1;
		Chart.defaults.global.scaleStartValue  = 0;

		//helpers
		var formatDate = function (dateObj) {
			var year  = dateObj.getFullYear();
			var month = dateObj.getMonth() +1; // month is 0 based
			var day   = dateObj.getDate();

			return year+'-'+month+'-'+day;
		};

		var getDay = function (date){
			var day = new Date(date);
			var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			return weekday[day.getDay()];
		}

		var transformDataForBarChart = function (result){
			result.sort(function(a,b) { return parseFloat(a.avg) - parseFloat(b.avg) } );
			result.reverse();

			var avgs = [];
			var labels = [];
			for(var i = 0; i< result.length;i++){
				var label = result[i].avg
				avgs.push(label);
				labels.push(result[i].vehicle_type + " " + result[i].vehicle_number);
			}
			var data = {
				labels: labels,
				datasets: [
				{
					label: "Delays",
					fillColor: "#000",
					highlightStroke: "#a40800",
					data: avgs
				}
				]
			};
			return data;
		};
		var transformDataForLineChart = function (result){
			result.sort(function(a,b) { 
				var a_num = a.date.replace(/-/g,'');
				var b_num = b.date.replace(/-/g,'');
				return a_num - b_num } 
			);

			var avgs = [];
			var days = [];
			for(var i = 0; i< result.length;i++){
				avgs.push(Math.round(result[i].avg*100)/100);
				var day = getDay(result[i].date);
				days.push(day);
			}
			var data = {
				labels: days,
				datasets: [
				{
					fillColor: "rgba(0,0,0,0)",
					strokeColor: "#a40800",
					pointColor: "#000",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "#000",
					data: avgs
				}
				]
			};
			return data;
		}


		var setupBarChart = function (result) {

			var options = {
				scaleLabel: " <%=value%> min",
				scaleFontSize: 14,
				barShowStroke: false,
				scaleShowGridLines: false,
				tooltipEvents: []
			};

			var data       = transformDataForBarChart(result);
			var $barCanvas = $("#barChart");
			var ctx        = $barCanvas.get(0).getContext("2d");
			var barChart   = new Chart(ctx).Bar(data,options);

			//get detail info for most delayed bus
			var vehicle_type_and_numer = data.labels[0].split(' ');

			barChart.datasets[0].bars[0].fillColor = '#a40800';
			barChart.update();
			$('#oneLineTitle').text(data.labels[0]);

			getDelays($from.val(),$to.val(),'oneLine',vehicle_type_and_numer[0],vehicle_type_and_numer[1]);

			$barCanvas.click(function(evt){
			    var activeBars = barChart.getBarsAtEvent(evt);

			    var vehicle_type_and_numer = activeBars[0].label.split(" ");
			    getDelays($from.val(),$to.val(),'oneLine',vehicle_type_and_numer[0],vehicle_type_and_numer[1]);

			    //mark bar as selected
			    var bars = barChart.datasets[0].bars
			    var currentBar = 0;
			    for (var i = 0; i < bars.length; i++) {
			    	if (bars[i] == activeBars[0]) {
			    		bars[i].fillColor = '#a40800';
			    	} else {
			    		bars[i].fillColor = '#000';
			    	}
			    };
			    barChart.update();

			    //set details title
			    $('#oneLineTitle').text(activeBars[0].label);
			});

		};

		var setupLineChart = function (result) {
			result.sort(function(a,b) { return parseFloat(a.avg) - parseFloat(b.avg) } );
			result.reverse();

			var options = {
				scaleLabel: " <%=value%> min",
				scaleFontSize: 14,
				scaleShowGridLines: false
			};

			var data   = transformDataForLineChart(result);
			var ctx = $("#lineChart").get(0).getContext("2d");
			var barChart = new Chart(ctx).Line(data,options);
		};

		var getDelays = function (from, to, endpoint, vehicle_type, vehicle_number){
			var from = from || formatDate(firstPossibleDate);
			var to   = to || formatDate(new Date());

			var data       = {
				starttime:      from,
				endtime:        to,
				vehicle_type:   vehicle_type,
				vehicle_number: vehicle_number
			}
			var backendUrl = 'https://puncplan.canopus.uberspace.de/fcgi-bin/punctualityplan/' + endpoint;

			$.getJSON(backendUrl,data,function (result) {

				if (endpoint == 'allLines') {
					setupBarChart(result);
				} else {
					setupLineChart(result);
				}
			});
		};

		//datepicker
		var datepicker_options = {
			min: firstPossibleDate,
			max: true,
			format: 'yyyy-mm-dd'
		}

		var $from = $( "#from" );
		var $to = $( "#to" );
		$from.pickadate(datepicker_options);
		$to.pickadate(datepicker_options);

		//get delays
		$('#submit-btn').click(function () {
			$('#bus').addClass('drive');
			$('#content').fadeOut(1500);

			getDelays($from.val(),$to.val(),'allLines');	
		});
	});

})();