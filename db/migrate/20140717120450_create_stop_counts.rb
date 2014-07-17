class CreateStopCounts < ActiveRecord::Migration
  def change
    create_table :stop_counts do |t|
      t.integer :route_id
      t.integer :number_of_stops

      t.timestamps
    end
  end
end
