class AddAttributesToPreachers < ActiveRecord::Migration
  def change
    add_column :preachers, :displayname, :string
    add_column :preachers, :firstname, :string
    add_column :preachers, :lastname, :string
    add_column :preachers, :city, :string
    add_column :preachers, :country, :string
    add_column :preachers, :bio, :text
  end
end
