class Songs::LikesController < ApplicationController
  before_action :authenticate_preacher!
  before_action :set_song

  def create
    @song.likes.where(preacher_id: current_preacher.id).first_or_create

    respond_to do |format|
      format.html {redirect_to @song}
      format.js
    end
  end

    def destroy
      @song.likes.where(preacher_id: current_preacher.id).destroy_all

      respond_to do |format|
      format.html {redirect_to @song}
      format.js
      
    end
    
  end

  private

   def set_song
    #@song = Song.find(params[:song_id])
    @song = Song.friendly.find(params[:song_id])
     
   end
end
