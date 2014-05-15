
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

#default root
get "/" do
  set_path :index
end

#signup action
get "/signup" do
  set_path :signup
end

#handling signup data after submitting
post "/signup" do
  password_salt = BCrypt::Engine.generate_salt
  password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
    # save into mongodb
  begin
    id = Query.insert_user(params[:email],password_salt,password_hash)
    session[:user] = params[:email]
    redirect "/"
  rescue
    flash[:error] = "Something went wrong. Please try again."
    redirect "/signup"  
  end
end

#handling login after submitting
post "/login" do
  if user = Query.find_user(params[:email])
    hash = BCrypt::Engine.hash_secret(params[:password], user["salt"])
    if user["passwordhash"] == hash
      session[:user] = params[:email]
      redirect "/"
    end
  end
  
  flash[:error] = "Invalid Email and password combination."
  redirect '/'
end

#logout action
get "/logout" do
  session[:user] = nil
  redirect "/"
end
