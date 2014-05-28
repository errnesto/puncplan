class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.integer :service_id
      t.boolean :monday
      t.boolean :tuesday
      t.boolean :wednesday
      t.boolean :thursday
      t.boolean :friday
      t.boolean :saturday
      t.boolean :sunday
      t.string :start_date
      t.string :end_date

      t.timestamps
    end
  end
end
