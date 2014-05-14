# encoding: UTF-8
require 'uri'
require 'json'
namespace :copy do
    desc 'copy old crawled Data to new Schema'
    task :copyData => :environment do

        TimeTable.where(station_id: nil).limit(10).each do |record|
            data = record.data

            data['stations'].each do |station|
                station['departures'].each do |departure|
                    vehicle = departure['line'].split(' ')
                    tempTime= departure['time'].split(':')
                    time = Time.now.change(:hour=> tempTime[0], :min=> tempTime[1])
                    TimeTable.create(station_id: station['id'], departure_time: time.to_s(:db), vehicle_type: vehicle[0], vehicle_number: vehicle[1], direction: departure['direction'])
                end
            end
            record.delete()
        end
    end
end