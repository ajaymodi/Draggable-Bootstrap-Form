# Image upload controller
post "/upload" do 
  file_name = Time.now.to_i.to_s + params['file'][:filename]
  File.open('public/demo_app/images/' + file_name, "w") do |f|
    f.write(params['file'][:tempfile].read)
  end
  return ["The image was successfully uploaded!",file_name].to_json
end

# get the list of forms available
get "/forms" do
  if !login?
    redirect "/" 
  else 
    @forms = $forms.find().sort({sId:1})
    erb :"forms/index"
  end
end
 
#new form setup
get "/forms/new" do
  if admin?
    erb :"forms/new"
  else
    flash[:error]="restricted access"
    redirect "/"
  end
end
 
#form submit handling
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
 
# get a particular form
get "/forms/:id" do
  if !login?
    redirect "/" 
  else
    @form = $forms.find_one({:sId => params[:id].to_i})
    erb :"forms/show"
  end
end
 
# delete form 
delete "/forms" do
  response = $forms.remove( {:sId => ((params[:id].empty?)?params[:id]:params[:id].to_i)});
  flash[:success] = "The form was deleted successfully!"
  redirect "/forms"
end
 