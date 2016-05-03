class Preach < ActiveRecord::Base
  belongs_to :preacher
  validates :preacher_id, presence: true
  validates :content, presence: true, length: { maximum: 540 } # tweets are capped at 140 chars.\
  default_scope -> { order(created_at: :desc) } # newest tweets / posts first
end
