class Song < ActiveRecord::Base
  belongs_to :preacher

  is_impressionable

  #carrierWave uploader
    mount_uploader :soundcover, SoundcoverUploader
    mount_uploader :sound, SoundUploader

  validates :preacher_id, presence: true

  has_many :likes, dependent: :destroy # remove a preacher's videos if his account is deleted.
  has_many :comments, dependent: :destroy # remove a preacher's videos if his account is deleted.
  


   extend FriendlyId
  friendly_id :displayname, use: :slugged



end
