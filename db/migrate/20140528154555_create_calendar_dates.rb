class CreateCalendarDates < ActiveRecord::Migration
  def change
    create_table :calendar_dates do |t|
      t.integer :service_id
      t.string :date
      t.integer :exception_type

      t.timestamps
    end
  end
end
