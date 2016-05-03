json.array!(@songs) do |song|
  json.extract! song, :id, :title, :desc, :soundcover, :sound, :date_released, :genre, :lyrics, :artist
  json.url song_url(song, format: :json)
end
