class ChangeAgencyIdToString < ActiveRecord::Migration
  def change
    change_column :routes, :agency_id, :string
  end
end
