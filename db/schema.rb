# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140717120450) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "calendar_dates", force: true do |t|
    t.integer  "service_id"
    t.string   "date"
    t.integer  "exception_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "calendars", force: true do |t|
    t.integer  "service_id"
    t.boolean  "monday"
    t.boolean  "tuesday"
    t.boolean  "wednesday"
    t.boolean  "thursday"
    t.boolean  "friday"
    t.boolean  "saturday"
    t.boolean  "sunday"
    t.string   "start_date"
    t.string   "end_date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "routes", force: true do |t|
    t.integer  "route_id"
    t.string   "agency_id"
    t.string   "route_short_name"
    t.string   "route_long_name"
    t.string   "route_desc"
    t.integer  "route_type"
    t.string   "route_url"
    t.string   "route_color"
    t.string   "route_text_color"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statistics", force: true do |t|
    t.date     "date"
    t.float    "average_delay"
    t.string   "vehicle_type"
    t.string   "vehicle_number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stop_counts", force: true do |t|
    t.integer  "route_id"
    t.integer  "number_of_stops"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stop_times", force: true do |t|
    t.integer  "trip_id"
    t.string   "arrival_time"
    t.string   "departure_time"
    t.integer  "stop_id"
    t.integer  "stop_sequence"
    t.integer  "pickup_type"
    t.integer  "drop_off_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "stop_headsign"
    t.string   "shape_dist_traveled"
  end

  create_table "stops", force: true do |t|
    t.integer  "stop_id"
    t.string   "stop_code"
    t.string   "stop_desc"
    t.string   "stop_name"
    t.float    "stop_lat"
    t.float    "stop_lon"
    t.integer  "zone_id"
    t.string   "stop_url"
    t.string   "location_type"
    t.integer  "parent_station"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "time_tables", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "data"
    t.string   "station"
    t.integer  "station_id"
    t.time     "departure_time"
    t.string   "vehicle_type"
    t.string   "vehicle_number"
    t.string   "direction"
  end

  create_table "trips", force: true do |t|
    t.integer  "route_id"
    t.integer  "service_id"
    t.integer  "trip_id"
    t.string   "trip_headsign"
    t.string   "trip_short_name"
    t.integer  "direction_id"
    t.integer  "block_id"
    t.integer  "shape_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
