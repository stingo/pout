class DropSongsTable < ActiveRecord::Migration
  def up
    drop_table :songs
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
