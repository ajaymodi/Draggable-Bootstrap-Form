
get "/responses/:id" do
  begin
    @responses = $responses.find({:fId => params[:id]})
    h = {}
    @responses.each_with_index do |p,i|
      h[i] = p.to_s+"<br/>"
    end
    if(h.empty?)
      return "No responses.".to_json  
    else
      return h.to_json
    end
  rescue
    return "Something went wrong. Please try again.".to_json  
  end
end

post "/responses" do
  h = {:fId => params[:form_id]}
  params.delete("form_id")
  params.each do |k,v|
    h[k]=v
  end
  begin
    $responses.insert(h)
    flash[:success] = "The response was successfully submitted!"
    redirect '/forms'
  rescue
    return "Something went wrong. Please try again."  
  end
end