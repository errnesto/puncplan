class AddStationToTimeTables < ActiveRecord::Migration
  def change
    add_column :time_tables, :station, :string
  end
end
