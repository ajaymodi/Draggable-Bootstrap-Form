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
    @forms = Form.find_all
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
    record = Form.find_max
    
    if(record)
      cnt = record["sId"].to_i + 1
    else
      cnt += 1
    end

    id = Form.form_insert(cnt,params[:title],params[:data])
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
    @form = Form.find_record params[:id]
    erb :"forms/show"
  end
end
 
# delete form 
delete "/forms" do
  response = Form.form_delete params[:id]
  flash[:success] = "The form was deleted successfully!"
  redirect "/forms"
end
 