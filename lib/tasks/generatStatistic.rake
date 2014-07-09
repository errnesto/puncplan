# encoding: UTF-8
namespace :generateStatistic do
    desc ''
    task :generateData => :environment do

        DELAY_RANGE = 10 
    	date = DateTime.new(2014,5,1)

        #initialzie variables
        vehicle_type = false
        average_delay = 0
        number_of_checked_stops = 0

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
                #puts vehicle_type
                #puts route.route_short_name
        		trips = Trip.where(route_id: route.route_id)
        		trips.each do |trip|
        			trip_average_delay = 0
        			has_service_today = true

        			#handle exeptions to standart time table
        			calender = Calendar.exists?(service_id: trip.service_id)

        			if calender 
        				#if there is a entry in calender its always false
        				has_service_today = false 

                        #there are only exeptions so we only need to check this 
                        #if we have no service
                        date_string = date.strftime('%Y%m%d')
                        calender_date = CalendarDate.where(service_id: trip.service_id, date: date_string).take
                        if calender_date.present? 
                            has_service_today = calender_date.exception_type == 1
                        end
        			end

                    if has_service_today
                    	stop_times = StopTime.where(trip_id: trip.trip_id)
                        puts 'rote:'
                        puts vehicle_type
                        puts route.route_short_name
                        puts trip.trip_headsign

                    	stop_times.each do |stop_time|
                    		tempTime = stop_time.departure_time.split(':')
                    		stop_departure_time = date.change(hour: tempTime[0].to_i, min: tempTime[1].to_i)

                    		lower_range = stop_departure_time - DELAY_RANGE.minutes
                    		upper_range = stop_departure_time + DELAY_RANGE.minutes

                            stop = Stop.where(stop_id: stop_time.stop_id).take
                            station_ids = stop.stop_code.split(',')

                            puts 'stop'
                            puts number_of_checked_stops
                            puts station_ids
                            puts stop_departure_time                            

                    		tt_departures = TimeTable.where(
                    			departure_time: lower_range..upper_range, 
                    			station_id:     station_ids, 
                    			direction:      trip.trip_headsign, 
                    			vehicle_type:   vehicle_type, 
                    			vehicle_number: route.route_short_name)
 
                            unless tt_departures.empty?
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
                                average_delay += DELAY_RANGE * 2 #no departure at all or a very big delay
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
