# encoding: UTF-8
require 'uri'
require 'json'
namespace :crawler do
    desc 'do an request to the api and save to db'
    task :getData => :environment do
        stations = HTTParty.get('http://fahrinfo.vbb.de/bin/query.exe/dny?performLocating=2&tpl=stop2shortjson&look_minx=13080807&look_maxx=13833371&look_miny=52333768&look_maxy=52707285&&look_stopclass=12&look_nv=get_shortjson%7Cyes%7Cget_lines%7Cyes%7Ccombinemode%7C1%7Cdensity%7C26%7C')
        stops = stations["stops"]
        # stops.each do |stop|
            url = URI.escape('http://bvg-api.herokuapp.com/stations?input=' + stops[0][3])
            data = JSON.parse(HTTParty.get(url))

            data['stations'].each do |station|
                station['departures'].each do |departure|
                    vehicle = departure['line'].split(' ')
                    tempTime= departure['time'].split(':')
                    time = Time.now.change(:hour=> tempTime[0], :min=> tempTime[1])
                    TimeTable.create(station_id: station['id'], departure_time: time.to_s(:db), vehicle_type: vehicle[0], vehicle_number: vehicle[1], direction: departure['direction'])
                end
            end
        # end
    end
end