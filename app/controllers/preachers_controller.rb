class PreachersController < ApplicationController

  impressionist :actions=>[:show,:index]

		before_action :authenticate_preacher!, :except => [:index, :show]
		before_action :set_preacher, only: [:show, :edit, :update]
  

  def index
  	@preachers = Preacher.all
  end

  def show
    impressionist(@preacher)
   

     @preacher = Preacher.friendly.find(params[:id])
    @preacher_songs = @preacher.songs
    if request.path != preacher_path(@preacher)
    redirect_to @preacher, status: :moved_permanently
     else
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @preacher }
    end
  end


  end

  def edit

    @preacher = Preacher.friendly.find(params[:id])
    


  end

   def update
    @preacher = Preacher.friendly.find(params[:id])
    if @preacher.update_attributes(preacher_params)
    	flash[:notice] = "You updated your profile!"
    	redirect_to preacher_path
      # Handle a successful update.
    else
      render :action => :edit
    end
  end



private

def set_preacher
       @preacher = Preacher.friendly.find(params[:id])
    end
   

    # Never trust parameters from the scary internet, only allow the white list through.
    def preacher_params
      params.require(:preacher).permit(:profilephoto, :profilecover, :bio, :country, :firstname, :lastname, :city, :displayname)
    end
  



end
