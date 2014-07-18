class SetAvgDefaultToCeroForStatistic < ActiveRecord::Migration
  def change
  	change_column :statistics, :average_delay, :float, :default => 0.0
  end
end
