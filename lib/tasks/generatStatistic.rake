# encoding: UTF-8
namespace :generateStatistic do
    desc ''
    task :generateData => :environment do

        DELAY_RANGE = 10 
    	date = Date.new(2014,5,1)

    	Route.find_each do |route|
    		average_delay = 0
    		number_of_checked_stops = 0

    		case route.route_type
    		when 700
    			vehicle_type = 'Bus'
    		when 900
    			vehicle_type = 'Tram'
            else
                vehicle_type = false
            end

            if vehicle_type
                puts vehicle_type
                puts route.route_short_name
        		trips = Trip.where(route_id: route.route_id)
        		trips.each do |trip|
        			trip_average_delay = 0
        			has_service_today = true

        			#handle exeptions to standart time table
        			calender = Calendar.where(service_id: trip.service_id).take

        			if calender.present? 
        				#has service this weekday
        				weekday = date.strftime('%A').downcase
        				has_service_today = calender[weekday] 
        			end

        			#has been added for today
        			date_string = date.strftime('%Y%m%d')
                    calender_date = CalendarDate.where(service_id: trip.service_id, date: date_string).take
                    if calender_date.present? 
                    	has_service_today = calender_date.exception_type == 1
                    end

                    puts has_service_today

                    if has_service_today
                        t1 = Time.now
                    	stop_times = StopTime.where(trip_id: trip.trip_id)
                        puts 'get from StopTime'
                        puts (Time.now - t1) * 1000
                    	stop_times.each do |stop_time|
                    		tempTime = stop_time.departure_time.split(':')
                    		stop_departure_time = date.change(:hour=> tempTime[0], :min=> tempTime[1])

                    		lower_range = stop_departure_time - DELAY_RANGE.minutes
                    		upper_range = stop_departure_time + DELAY_RANGE.minutes

                            t1 = Time.now
                    		tt_departures = TimeTable.where(
                    			departure_time:     lower_range..upper_range, 
                    			station_id:     stop_time.stop_id, 
                    			direction:      trip.trip_headsign, 
                    			vehicle_type:   vehicle_type, 
                    			vehicle_number: route.route_short_name)

                            puts 'get from TimeTable'
                            puts (Time.now - t1) * 1000

                            if (tt_departures.length > 0)
                        		#get departues with shortest delay
                        		closest_departure = DELAY_RANGE
                        		nd_closest_departure = DELAY_RANGE
                        		closest_departure_obj = nil
                        		nd_closest_departure_obj = nil

                        		tt_departures.each do |tt_departure|
                        			temp_time_dist = (tt_departure.departure_time - stop_departure_time).abs

                        			if temp_time_dist < closest_departure
                        				nd_closest_departure = closest_departure
                        				nd_closest_departure_obj = closest_departure_obj

                        				closest_departure = temp_time_dist
                        				closest_departure_obj = tt_departure
                        			end
                        		end

                        		#prevent against time jumping in time tables
                        		if closest_departure_obj.created_at == nd_closest_departure_obj.created_at
                        			actual_departure = closest_departure
                        		else
                        			actual_departure = nd_closest_departure
                        		end

                        		average_delay += actual_departure
                            else
                                average_delay += DELAY_RANGE * 2 #no departure at all or a very big one
                            end
                    		number_of_checked_stops = number_of_checked_stops + 1 
                        end
                    end
                end
            end
            if (number_of_checked_stops > 0)
                average_delay /= number_of_checked_stops
                #write to database
                Statistic.create(date: date, average_delay: average_delay, vehicle_type: vehicle_type, vehicle_number: route.route_short_name)
            end
        end
    end
end
