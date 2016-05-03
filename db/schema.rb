# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160502084848) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.integer  "trackable_id"
    t.string   "trackable_type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "key"
    t.text     "parameters"
    t.integer  "recipient_id"
    t.string   "recipient_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type", using: :btree
  add_index "activities", ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type", using: :btree
  add_index "activities", ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type", using: :btree

  create_table "audios", force: :cascade do |t|
    t.string   "name"
    t.text     "desc"
    t.string   "category_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "preacher_id"
    t.string   "owner"
    t.text     "genre"
    t.string   "soundcover"
    t.string   "sound"
    t.text     "lyrics"
    t.date     "date_released"
    t.string   "slug"
  end

  add_index "audios", ["preacher_id"], name: "index_audios_on_preacher_id", using: :btree
  add_index "audios", ["slug"], name: "index_audios_on_slug", using: :btree

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.text     "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.integer  "song_id"
    t.text     "body"
    t.integer  "preacher_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "comments", ["preacher_id"], name: "index_comments_on_preacher_id", using: :btree
  add_index "comments", ["song_id"], name: "index_comments_on_song_id", using: :btree

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
  add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
  add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
  add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

  create_table "impressions", force: :cascade do |t|
    t.string   "impressionable_type"
    t.integer  "impressionable_id"
    t.integer  "user_id"
    t.string   "controller_name"
    t.string   "action_name"
    t.string   "view_name"
    t.string   "request_hash"
    t.string   "ip_address"
    t.string   "session_hash"
    t.text     "message"
    t.text     "referrer"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "impressions", ["controller_name", "action_name", "ip_address"], name: "controlleraction_ip_index", using: :btree
  add_index "impressions", ["controller_name", "action_name", "request_hash"], name: "controlleraction_request_index", using: :btree
  add_index "impressions", ["controller_name", "action_name", "session_hash"], name: "controlleraction_session_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "ip_address"], name: "poly_ip_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "request_hash"], name: "poly_request_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "session_hash"], name: "poly_session_index", using: :btree
  add_index "impressions", ["impressionable_type", "message", "impressionable_id"], name: "impressionable_type_message_index", using: :btree
  add_index "impressions", ["user_id"], name: "index_impressions_on_user_id", using: :btree

  create_table "likes", force: :cascade do |t|
    t.integer  "preacher_id"
    t.integer  "song_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "preachers", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "displayname"
    t.string   "firstname"
    t.string   "lastname"
    t.string   "city"
    t.string   "country"
    t.text     "bio"
    t.string   "profilecover"
    t.string   "profilephoto"
    t.string   "slug"
  end

  add_index "preachers", ["email"], name: "index_preachers_on_email", unique: true, using: :btree
  add_index "preachers", ["reset_password_token"], name: "index_preachers_on_reset_password_token", unique: true, using: :btree
  add_index "preachers", ["slug"], name: "index_preachers_on_slug", unique: true, using: :btree

  create_table "preaches", force: :cascade do |t|
    t.text     "content"
    t.integer  "preacher_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "title"
    t.string   "preachcover"
  end

  add_index "preaches", ["preacher_id", "created_at"], name: "index_preaches_on_preacher_id_and_created_at", using: :btree
  add_index "preaches", ["preacher_id"], name: "index_preaches_on_preacher_id", using: :btree
  add_index "preaches", ["title"], name: "index_preaches_on_title", using: :btree

  create_table "songs", force: :cascade do |t|
    t.string   "title"
    t.text     "desc"
    t.integer  "preacher_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "artist"
    t.text     "genre"
    t.string   "soundcover"
    t.string   "sound"
    t.text     "lyrics"
    t.date     "date_released"
    t.string   "slug"
  end

  add_index "songs", ["artist"], name: "index_songs_on_artist", using: :btree
  add_index "songs", ["lyrics"], name: "index_songs_on_lyrics", using: :btree
  add_index "songs", ["preacher_id", "created_at"], name: "index_songs_on_preacher_id_and_created_at", using: :btree
  add_index "songs", ["preacher_id"], name: "index_songs_on_preacher_id", using: :btree
  add_index "songs", ["slug"], name: "index_songs_on_slug", using: :btree

  create_table "videos", force: :cascade do |t|
    t.string   "videourl"
    t.text     "description"
    t.integer  "preacher_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "videos", ["preacher_id", "created_at"], name: "index_videos_on_preacher_id_and_created_at", using: :btree
  add_index "videos", ["preacher_id"], name: "index_videos_on_preacher_id", using: :btree

  add_foreign_key "audios", "preachers"
  add_foreign_key "comments", "preachers"
  add_foreign_key "preaches", "preachers"
  add_foreign_key "songs", "preachers"
  add_foreign_key "videos", "preachers"
end
