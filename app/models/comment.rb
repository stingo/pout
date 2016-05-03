class Comment < ActiveRecord::Base
  belongs_to :preacher
  belongs_to :song
end
