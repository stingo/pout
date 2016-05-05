class SongsController < ApplicationController
  impressionist :actions=>[:show,:index]

  before_action :set_song, only: [:show, :edit, :update, :destroy]



  # GET /audios
  # GET /audios.json
  def index
    @songs = Song.all.order('created_at DESC')
    @newPreach = Preach.new
    @newVideo = Video.new
    @newSong = Song.new
  end

  # GET /audios/1
  # GET /audios/1.json
  def show
  	impressionist(@song)
    @newPreach = Preach.new
    @newVideo = Video.new
    @newSong = Song.new

  	
    @song = Song.friendly.find(params[:id])
  if request.path != song_path(@song)
    redirect_to @song, status: :moved_permanently
  else
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @song }
    end
  end
end


  # GET /audios/new
  def new
    
    @song = Song.new 
    
  end

  # GET /audios/1/edit
  def edit
    
  end

  # POST /audios
  # POST /audios.json
  def create
    @song = Song.new(_params)
    
    
     @song.preacher_id = current_preacher.id # assign the video to the preacher who created it.

    respond_to do |format|
      if @song.save
        format.html { redirect_to @song, notice: 'Audio was successfully created.' }
        format.json { render :show, status: :created, location: @song }
      else
        format.html { render :new }
        format.json { render json: @song.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /audios/1
  # PATCH/PUT /audios/1.json
  def update
    
    respond_to do |format|
      if @song.update(song_params)
        format.html { redirect_to @song, notice: 'Audio was successfully updated.' }
        format.json { render :show, status: :ok, location: @song }
      else
        format.html { render :edit }
        format.json { render json: @song.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /audios/1
  # DELETE /audios/1.json
  def destroy
    @song.destroy
    respond_to do |format|
      format.html { redirect_to audios_url, notice: 'Audio was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_song
      @song = Song.friendly.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def song_params
      params.require(:song).permit(:title, :desc, :preacher_id, :sound, :soundcover, :artist, :date_released, :genre, :lyrics)
    end


end
