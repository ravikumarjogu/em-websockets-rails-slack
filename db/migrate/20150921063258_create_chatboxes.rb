class CreateChatboxes < ActiveRecord::Migration
  def change
    create_table :chatboxes do |t|
      t.string :message
      t.string :channel
      t.references :user, index: true

      t.timestamps null: false
    end
    add_foreign_key :chatboxes, :users
  end
end
