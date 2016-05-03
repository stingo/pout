class PagesController < ApplicationController
  def index
    @songs = Song.all
    @preaches = Preach.all
    @videos = Video.all.order('created_at DESC')

  end

  def home
  	@newPreach = Preach.new
  	@newVideo = Video.new
    @newSong = Song.new
   
  end

  def profile
    @preacher = Preacher.friendly.find(params[:id])
  end

  def explore
  	@preaches = Preach.all
    @newPreach = Preach.new
    
    @videos = Video.all
    @newVideo = Video.new

    @songs = Song.all
    @newSong = Song.new

    
  end
end
