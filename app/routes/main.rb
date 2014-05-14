
enable :sessions

helpers do
  def login?
    if session[:user].nil?
      return false
    else
      return true
    end
  end

  def username
    return session[:user]
  end

  def admin?
    if(session[:user]=="abc@gmail.com")
      return true
    else
      return false
    end
  end
end



get "/" do
  erb :index
end

post "/form_submit" do
  erb :blank
end

get "/signup" do
  erb :signup
end

post "/signup" do
  password_salt = BCrypt::Engine.generate_salt
  password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
    # save into mongodb
  begin
    id = $users.insert({
      :_id => params[:email],
      :salt => password_salt,
      :passwordhash => password_hash 
    })

    session[:user] = params[:email]
    redirect "/"
  rescue
    flash[:error] = "Something went wrong. Please try again."
    redirect "/signup"  
  end
end

post "/login" do
  if user = $users.find_one({:_id => params[:email]})
    hash = BCrypt::Engine.hash_secret(params[:password], user["salt"])
    if user["passwordhash"] == hash
      session[:user] = params[:email]
      redirect "/"
    end
  end
  
  flash[:error] = "Invalid Email and password combination."
  redirect '/'
end

get "/logout" do
  session[:user] = nil
  redirect "/"
end

post "/upload" do 
  File.open('public/demo_app/images/' + params['file'][:filename], "w") do |f|
    f.write(params['file'][:tempfile].read)
  end
  return ["The image was successfully uploaded!",params['file'][:filename]].to_json
end


# Get all of our routes
get "/forms" do
  @forms = $forms.find()
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
delete "/forms/:id" do
  response = $forms.remove( {:sId => params[:id].to_i});
  redirect "/forms"
end
 

