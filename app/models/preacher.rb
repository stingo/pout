class Preacher < ActiveRecord::Base

  is_impressionable

	validates_presence_of :displayname

	mount_uploader :profilephoto, ProfilephotoUploader
  mount_uploader :profilecover, ProfilecoverUploader
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         has_many :preaches, dependent: :destroy # remove a preacher's preches if his account is deleted.
         has_many :videos, dependent: :destroy # remove a preacher's videos if his account is deleted.
         has_many :songs, dependent: :destroy # remove a preacher's videos if his account is deleted.
         

         has_many :likes, dependent: :destroy

         def likes?(song)
         song.likes.where(preacher_id: id).any?
         end


         extend FriendlyId
         friendly_id :displayname

end
