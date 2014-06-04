class CreateStatistics < ActiveRecord::Migration
  def change
    create_table :statistics do |t|
      t.date :date
      t.float :average_delay
      t.string :vehicle_type
      t.string :vehicle_number

      t.timestamps
    end
  end
end
