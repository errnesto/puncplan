class AddDirectionToTimeTables < ActiveRecord::Migration
  def change
    add_column :time_tables, :direction, :string
  end
end
