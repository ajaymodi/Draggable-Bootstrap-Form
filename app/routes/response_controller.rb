#fetch response for the form
get "/responses/:id" do
  if admin?
    begin
      @responses = Response.response_find params[:id]
      h = {}
      @responses.each_with_index do |p,i|
        key = "<br/>"+i.to_s
        h[key] = p
      end
      if(h.empty?)
        return "No responses.".to_json  
      else
        return h.to_json
      end
    rescue
      return "Something went wrong. Please try again.".to_json  
    end  
  else
    flash[:error]="restricted access"
    redirect "/"
  end
end

#save the response
post "/responses" do
  h = {:fId => params[:form_id],:uId => session[:user]}
  params.delete("form_id")
  params.each do |k,v|
    h[k]=v
  end
  begin
    Response.response_insert h
    flash[:success] = "The response was successfully submitted!"
    redirect '/forms'
  rescue
    return "Something went wrong. Please try again."  
  end
end