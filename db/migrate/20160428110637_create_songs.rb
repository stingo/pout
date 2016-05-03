class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :title
      t.text :desc
      t.references :preacher, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :songs, [:preacher_id, :created_at]
  end
end
