class ChangeTimeTables < ActiveRecord::Migration
  def change
    add_column :time_tables, :station_id, :integer
    add_column :time_tables, :departure_time, :time
    add_column :time_tables, :vehicle_type, :string
    add_column :time_tables, :vehicle_number, :string
  end
end
