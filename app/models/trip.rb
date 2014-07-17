class Trip < ActiveRecord::Base
	belongs_to :route, primary_key: "route_id"
	has_many :stop_times

	has_one :calender, primary_key: "service_id", foreign_key: "service_id"
end
