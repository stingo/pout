module VideosHelper

	def embed(videourl)
    youtube_id = videourl.split("=").last
    content_tag(:iframe, nil, src: "//www.youtube.com/embed/#{youtube_id}")
  end

end
