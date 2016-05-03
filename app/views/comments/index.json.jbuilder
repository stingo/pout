json.array!(@comments) do |comment|
  json.extract! comment, :id, :song_id, :body, :preacher_id
  json.url comment_url(comment, format: :json)
end
