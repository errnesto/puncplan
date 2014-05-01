class ChangeDataTypeInTimeTables < ActiveRecord::Migration
  def change
    change_column :time_tables, :data, :text
  end
end
