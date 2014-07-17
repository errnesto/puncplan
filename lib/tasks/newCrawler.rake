# encoding: UTF-8
require 'uri'
require 'json'
require 'erb'
include ERB::Util

namespace :delay do
    desc 'get delay at current time'
    task :get => :environment do
    	date      = Date.today 
    	gtfs_date = date.strftime("%Y%m%d")

    	unless date == StopCount.first.updated_at.to_date
    		Rake::Task['delay:getRouteStops'].invoke
    	end

    	now       = (Time.now - 1.minutes).strftime("%H:%M:00")
    	later     = (Time.now + 10.minutes).strftime("%H:%M:00")

      stop_times = StopTime.select(:departure_time).includes(:stop, :trip => :route).joins(:trip).where.not(trips: {service_id: Calendar.select('service_id').where.not(service_id: CalendarDate.select('service_id').where(date: gtfs_date))}).where(arrival_time: now..later).order('trips.route_id')

      avg_delays      = []
      prev_route_id   = -1
      number_of_stops = 0

      stop_times.each do |stop_time|
      	if stop_time.stop && stop_time.trip.route

      		case stop_time.trip.route.route_type
  				when 700
  					vehicle_type = 'Bus'
  				when 900
  					vehicle_type = 'Tram'
  				else
  					next
  				end

      		stop_name      = stop_time.stop.stop_name
      		line           = vehicle_type + ' ' + stop_time.trip.route.route_short_name
      		direction      = stop_time.trip.trip_headsign
      		departure_time = stop_time.departure_time

      		puts '###'
      		puts line
      		#puts direction
      		puts stop_name
      		#puts departure_time
      		puts '###'

      		st = CGI::escape(stop_name)
      		data = JSON.parse(HTTParty.get('http://bvg-api.herokuapp.com/stations?input=' + st))
      		

      		delay = false
      		catch (:done) do
	      		data['stations'].each do |station|
	      			station['departures'].each do |departure|
	      				if departure['line'] == line && departure['direction'] == direction

	      					real_time_values      = departure['time'].split(':')
	      					departure_time_values = departure_time.split(':')

	      					if (departure_time_values[0] == '23' && real_time_values[0] == '00')
	      						real_time_values[0] = 24
	      					elsif (departure_time_values[0] == '00' && real_time_values[0] == '23')
	      						departure_time_values[0] = 24
	      					end

	      					real_time_number      = real_time_values[0].to_i      * 60 + real_time_values[1].to_i
	      					departure_time_number = departure_time_values[0].to_i * 60 + departure_time_values[1].to_i

	      					delay = real_time_number - departure_time_number
	      					throw :done
	      				end
	      			end
	      		end
	      	end

      		unless delay.class == Fixnum
      			delay = 4 #no information set to avg delay
      		end
      		if delay < 0
      			delay = delay/-2 #early arrival is "half delay"
      		end

      		route_id = stop_time.trip.route.route_id
      		# calculate number of stops in route once per route
      		unless route_id == prev_route_id
	      		number_of_stops = StopCount.find_by(route_id: stop_time.trip.route.route_id)
	      	end
	      	puts number_of_stops

      		faktor = 1.0 / number_of_stops
      		puts delay

      		avg_delay = avg_delays[stop_time.trip.route_id] || {vehicle_type: vehicle_type, vehicle_number: stop_time.trip.route.route_short_name, avg: 0.0 }

      		puts avg_delay[:avg]

      		# store fraction of avg delay
      		avg_delay[:avg] = avg_delay[:avg] + delay * faktor
      		avg_delays[stop_time.trip.route_id] = avg_delay

      		prev_route_id = route_id
      	end
      end

      avg_delays.each do |avg_obj|
      	stat = Statistc.find_or_create_by(date: date, vehicle_type: avg_obj[:vehicle_type], vehicle_number: avg_obj[:vehicle_number]).take
      	avg_delay = stat.average_delay + avg_obj[:avg]

      	Statistc.update(date: date, average_delay: avg_delay, vehicle_type: avg_obj[:vehicle_type],vehicle_number: avg_obj[:vehicle_number])
      end
    end
end