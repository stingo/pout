class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :videourl
      t.text :description
      t.references :preacher, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :videos, [:preacher_id, :created_at]
  end
end
