# encoding: UTF-8
require 'uri'
require 'json'
require 'erb'
include ERB::Util

namespace :test do
    desc 'do an request to the api and save to db'
    task :test => :environment do
        puts 'works'
    end
end