# encoding: UTF-8
require 'uri'
require 'json'
require 'erb'
include ERB::Util

namespace :stops do
    desc 'do an request to the api and save to db'
    task :map => :environment do
        stops = Stop.where("id > 6700")

        stops.each do |stop|
            string = CGI::escape(stop.stop_desc)
            url = 'http://bvg-api.herokuapp.com/stations?input=' + string
            data = JSON.parse(HTTParty.get(url))

            if data['stations'].length > 0
                puts stop.stop_id
                ids = ''
                data['stations'].each do | station |
                    ids += station['id'] + ','
                end
                stop.stop_code = ids[0..-2]
                stop.save
            end
        end
    end
end