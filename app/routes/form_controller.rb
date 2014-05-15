post "/upload" do 
  file_name = Time.now.to_i.to_s + params['file'][:filename]
  File.open('public/demo_app/images/' + file_name, "w") do |f|
    f.write(params['file'][:tempfile].read)
  end
  return ["The image was successfully uploaded!",file_name].to_json
end


# Get all of our routes
get "/forms" do
  if !login?
    redirect "/" 
  else 
    @forms = $forms.find().sort({sId:1})
    erb :"forms/index"
  end
end
 

get "/forms/new" do
  if admin?
    erb :"forms/new"
  else
    flash[:error]="restricted access"
    redirect "/"
  end
end
 
post "/forms" do
  begin
    cnt = 0
    record = $forms.find().sort({"sId" => -1}).limit(1).first()
    
    if(record)
      cnt = record["sId"].to_i + 1
    else
      cnt += 1
    end

    id = $forms.insert({
      :sId => cnt,
      :title => params[:title],
      :form => params[:data]
    })

    return "The form was successfully submitted!"

  rescue
    return "Something went wrong. Please try again."  
  end
end
 
# 
get "/forms/:id" do
  if !login?
    redirect "/" 
  else
    @form = $forms.find_one({:sId => params[:id].to_i})
    erb :"forms/show"
  end
end
 
# 
delete "/forms" do
  response = $forms.remove( {:sId => ((params[:id].empty?)?params[:id]:params[:id].to_i)});
  flash[:success] = "The form was deleted successfully!"
  redirect "/forms"
end
 