# encoding: UTF-8
require 'uri'
require 'json'
namespace :crawler do
    desc 'do an request to the api and save to db'
    task :getData => :environment do
        stations = HTTParty.get('http://fahrinfo.vbb.de/bin/query.exe/dny?performLocating=2&tpl=stop2shortjson&look_minx=13080807&look_maxx=13833371&look_miny=52333768&look_maxy=52707285&&look_stopclass=12&look_nv=get_shortjson%7Cyes%7Cget_lines%7Cyes%7Ccombinemode%7C1%7Cdensity%7C26%7C')
        stops = stations["stops"]
        # ? put data as a string to th db 
        stops.each do |stop|
            url = URI.escape('http://bvg-api.herokuapp.com/stations?input=' + stop[3])
            TimeTable.create(station: stop, data: HTTParty.get(url))
        end
        puts "success"
    end
end