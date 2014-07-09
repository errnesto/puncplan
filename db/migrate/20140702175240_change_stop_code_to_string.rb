class ChangeStopCodeToString < ActiveRecord::Migration
  def change
  	change_column :stops, :stop_code, :string
  end
end
