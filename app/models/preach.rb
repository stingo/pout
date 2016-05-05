class Preach < ActiveRecord::Base
	is_impressionable
	 mount_uploader :preachcover, PreachcoverUploader

  belongs_to :preacher
  validates :preacher_id, presence: true






  
  default_scope -> { order(created_at: :desc) } # newest tweets / posts first
end
