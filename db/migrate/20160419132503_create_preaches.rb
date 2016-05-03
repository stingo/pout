class CreatePreaches < ActiveRecord::Migration
  def change
    create_table :preaches do |t|
      t.text :content
      t.references :preacher, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :preaches, [:preacher_id, :created_at]
  end
end

