class CreateStops < ActiveRecord::Migration
  def change
    create_table :stops do |t|
      t.integer :stop_id
      t.integer :stop_code
      t.string :stop_desc 
      t.string :stop_name
      t.float :stop_lat
      t.float :stop_lon
      t.integer :zone_id
      t.string :stop_url
      t.string :location_type
      t.integer :parent_station

      t.timestamps
    end
  end
end
