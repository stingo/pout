class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.integer :preacher_id
      t.integer :song_id

      t.timestamps null: false
    end
  end
end
