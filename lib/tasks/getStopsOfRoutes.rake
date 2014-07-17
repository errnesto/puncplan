# encoding: UTF-8
require 'uri'
require 'json'
require 'erb'
include ERB::Util

namespace :delay do
    desc 'get the number of stops each roue has today'
    task :getRouteStops => :environment do
        puts 'hallo'
        date      = Date.today 
        gtfs_date = date.strftime("%Y%m%d")

        routes = Route.all
        routes.each do |route|
            number_of_stops = StopTime.select(:id).joins(:trip).where.not(trips: {service_id: Calendar.select('service_id').where.not(service_id: CalendarDate.select('service_id').where(date: gtfs_date))}).where(trips: {route_id: route.route_id}).count

            puts route.route_short_name
            puts number_of_stops

            stpCount = StopCount.find_or_create_by(route_id: route.route_id)
            stpCount.update(number_of_stops: number_of_stops)
        end
    end
end