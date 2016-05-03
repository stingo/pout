class AddAttributesToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :artist, :string
    add_column :songs, :genre, :text
    add_column :songs, :soundcover, :string
    add_column :songs, :sound, :string
    add_column :songs, :lyrics, :text
    add_column :songs, :date_released, :date

    add_index :songs, :lyrics
    add_index :songs, :artist
  end
end
