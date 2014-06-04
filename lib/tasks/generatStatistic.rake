# encoding: UTF-8
require 'uri'
require 'json'
namespace :generateStatistic do
    desc ''
    task :generateData => :environment do

    DELAY_RANGE = 10 
	date = Date.yesterday

	Route.find_each do |route|
		average_delay = 0
		number_of_checked_stops = 0

		case route.route_type
		when 700
			vehicle_type = 'Bus'
		when 900
			vehicle_type = 'Tram'

		trips = Trip.where(route_id: route.route_id)
		trips.each do |trip|
			trip_average_delay = 0
			service_today? = true

			#handle exeptions to standart time table
			calender = Calendar.where(service_id: trip.service_id).limit(1)
			if calender.present? 
				#has service this weekday
				weekday = date.strftime('%A').downcase
				service_today? = calender[weekday] 
			end

			#has been added for today
			date_string = date.strftime('%Y%m%d')
            calender_date = CalendarDate.where(service_id: trip.service_id and date: date_string).limit(1)
            if calender_date.present? 
            	service_today? = calender_date.exception_type == 1
            end

            if service_today?
            	stop_times = StopTime.where(trip_id: trip.trip_id)

            	stop_times.each do |stop_time|
            		tempTime = stop_time.departure_time.split(':')
            		stop_departure_time = yesterday.change(:hour=> tempTime[0], :min=> tempTime[1])

            		lower_range = stop_departure_time - DELAY_RANGE.minutes
            		upper_range = stop_departure_time + DELAY_RANGE.minutes

            		tt_departures = TimeTable.where(
            			departure_time:     lower_range..upper_range 
            			and station_id:     stop_time.stop_id 
            			and direction:      trip.trip_headsign 
            			and vehicle_type:   vehicle_type 
            			and vehicle_number: route.route_short_name)

            		#get departues with shortest delay
            		closest_departure = DELAY_RANGE
            		2nd_closest_departure = DELAY_RANGE
            		closest_departure_obj = nil
            		2nd_closest_departure_obj = nil

            		tt_departures.each do |tt_departure|
            			temp_time_dist = (tt_departure.departure_time - stop_departure_time).abs

            			if temp_time_dist < closest_departure
            				2nd_closest_departure = closest_departure
            				2nd_closest_departure_obj = closest_departure_obj

            				closest_departure = temp_time_dist
            				closest_departure_obj = tt_departure
            			end
            		end

            		#prevent against time jumping in time tables
            		if closest_departure_obj.created_at == 2nd_closest_departure_obj.created_at
            			actual_departure = closest_departure
            		else
            			actual_departure = 2nd_closest_departure
            		end

            		average_delay += actual_departure
            		number_of_checked_stops ++
            	end
            end
        end

        average_delay /= number_of_checked_stops

        #write to database
        Statistic.create(date: date, average_delay: average_delay, vehicle_type: vehicle_type, vehicle_number: route.route_short_name)
    end



