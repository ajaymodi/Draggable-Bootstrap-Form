post "/upload" do 
  file_name = Time.now.to_i.to_s + params['file'][:filename]
  File.open('public/demo_app/images/' + file_name, "w") do |f|
    f.write(params['file'][:tempfile].read)
  end
  return ["The image was successfully uploaded!",file_name].to_json
end


# Get all of our routes
get "/forms" do
  @forms = $forms.find().sort({sId:1})
  erb :"forms/index"
end
 

get "/forms/new" do
  redirect "/"
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
  @form = $forms.find_one({:sId => params[:id].to_i})
  erb :"forms/show"
end
 
# 
delete "/forms" do
  response = $forms.remove( {:sId => ((params[:id].empty?)?params[:id]:params[:id].to_i)});
  redirect "/forms"
end
 