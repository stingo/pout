class AddSlugToPreachers < ActiveRecord::Migration
  def change
    add_column :preachers, :slug, :string
    add_index :preachers, :slug, unique: true
  end
end
