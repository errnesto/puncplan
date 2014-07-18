class AddMissingFieldsToStopType < ActiveRecord::Migration
  def change
  	add_column :stop_times, :stop_headsign, :string
  end
end