class StopTime < ActiveRecord::Base
	belongs_to :trip, primary_key: "trip_id"
	has_one :stop, primary_key: "stop_id", foreign_key: "stop_id"
end
