# encoding: UTF-8
require 'uri'
require 'json'
require 'erb'
include ERB::Util
#54

namespace :delay do
    desc 'get delay at current time'
    task :get => :environment do
    	date      = Date.today 
    	gtfs_date = date.strftime("%Y%m%d")

    	unless date == StopCount.first.updated_at.to_date
    		Rake::Task['delay:getRouteStops'].invoke
    	end

    	now       = (Time.now + 10.minutes).strftime("%H:%M:00")
    	later     = (Time.now + 20.minutes).strftime("%H:%M:00")

      stop_times = StopTime.select(:departure_time).includes(:stop, :trip => :route).joins(:trip).where.not(trips: {service_id: Calendar.select('service_id').where.not(service_id: CalendarDate.select('service_id').where(date: gtfs_date))}).where(trips: {route_id: Route.select(:route_id).where('route_short_name like ?','M%')}, arrival_time: now..later).order('trips.route_id')

    	stop_data       = []
      avg_delays      = []
      prev_route_id   = -1
      prev_delay      = 0
      number_of_stops = 0
      counter         = 0

      stop_times.each do |stop_time|
      	counter = counter +1
      	# only get third second stop
      	if stop_time.stop && stop_time.trip.route && counter %10 == 0

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

      		#get data for stop only once
      		unless stop_data[stop_time.stop_id]
      			st                           = CGI::escape(stop_name)
      			json                         = HTTParty.get('http://bvg-api.herokuapp.com/stations?input=' + st)
      			stop_data[stop_time.stop_id] = json
      		end
      		data = JSON.parse(stop_data[stop_time.stop_id])
      		

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
	      					if delay >= 0 
	      						throw :done
	      					end
	      				end
	      			end
	      		end
	      	end

      		unless delay.class == Fixnum
      			delay = prev_delay #no information set to prev delay
      			puts  = '~'
      		end
      		if delay < 0
      			delay = delay * -1 #early arrival is "half delay"
      			puts 'neg'
      		end
      		prev_delay = delay

      		route_id = stop_time.trip.route.route_id
      		# calculate number of stops in route once per route
      		unless route_id == prev_route_id
      			prev_delay      = 0 #new route restore prev delay to avg value
	      		number_of_stops = StopCount.find_by(route_id: stop_time.trip.route.route_id).number_of_stops
	      	end

      		faktor = 10.0 / number_of_stops
      		puts delay
      		puts '-----------'

      		avg_delay = avg_delays[stop_time.trip.route_id] || {vehicle_type: vehicle_type, vehicle_number: stop_time.trip.route.route_short_name, avg: 0.0 }

      		# store fraction of avg delay
      		avg_delay[:avg] = avg_delay[:avg] + delay * faktor
      		avg_delays[stop_time.trip.route_id] = avg_delay

      		prev_route_id = route_id
      	end
      end

      avg_delays.compact!
      avg_delays.each do |avg_obj|
      	stat = Statistic.where(date: date, vehicle_type: avg_obj[:vehicle_type], vehicle_number: avg_obj[:vehicle_number]).first_or_create
      	stat.average_delay = stat.average_delay + avg_obj[:avg]
      	stat.save
      end
    end
end