
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

  def set_path path
    if login? 
      redirect "/forms" 
    else 
      erb path
    end  
  end 
end

get "/" do
  set_path :index
end

get "/signup" do
  set_path :signup
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
