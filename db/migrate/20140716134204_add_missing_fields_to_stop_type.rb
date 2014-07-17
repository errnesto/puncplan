class AddMissingFieldsToStopType < ActiveRecord::Migration
  def change
  	add_column :stop_times, :stop_headsign, :string
  	add_column :stop_times, :shape_dist_traveled, :string
  end
end