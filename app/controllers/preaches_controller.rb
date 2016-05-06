class PreachesController < ApplicationController

    impressionist :actions=>[:index,:show]


def index 
        @preaches = Preach.all.order('created_at DESC')
        @newVideo = Video.new
        @newPreach = Preach.new
        @newSong = Song.new
        



    end


    def new 
        @preach = Preach.new
    end
    
    def create
        @preach = Preach.new(preach_params)
        @preach.preacher_id = current_preacher.id # assign the preach to the user who created it.
        respond_to do |f|
            if (@preach.save) 
                f.html { redirect_to preaches_path, notice: "Preach created!" }
            else
                f.html { redirect_to preaches_path, notice: "Error: Preach Not Saved." }
            end
        end
    end

    def show
    	@preach = Preach.find(params[:id])
        impressionist(@preach)

    end

    def destroy
    @preach.destroy
    respond_to do |format|
      format.html { redirect_to "", notice: 'Song was successfully destroyed.' }
      format.json { head :no_content }
    end
     end

def edit

    @preach = Preach.find(params[:id])
    


  end

   def update
    @preach = Preach.find(params[:id])
    if @preach.update_attributes(preach_params)
        flash[:notice] = "You updated your profile!"
        redirect_to preaches_path
      # Handle a successful update.
    else
      render :action => :edit
    end
  end
    
    
    private

    def content_or_preachcover
  if content.blank? && preachcover.blank?
    errors[:base] << "Specify Time, Money or Both."
  end
end

    def preach_params # allows certain data to be passed via form.
        params.require(:preach).permit(:preacher_id, :content, :title, :preachcover)
        
    end


end
