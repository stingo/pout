class VideosController < ApplicationController

	def new 
        @video = Video.new
    end
    
    def create
        @video = Video.new(video_params)
        @video.preacher_id = current_preacher.id # assign the video to the preacher who created it.
        respond_to do |f|
            if (@video.save) 
                f.html { redirect_to "", notice: "Video created!" }
            else
                f.html { redirect_to "", notice: "Error: Video Not Saved." }
            end
        end
    end


     def show
    	@video = Video.find(params[:id])

     end
    
    
    private
    def video_params # allows certain data to be passed via form.
        params.require(:video).permit(:preacher_id, :videourl)
        
    end

end
