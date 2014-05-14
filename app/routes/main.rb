
enable :sessions

db = $conn.db('demo_db')
users = db.collection('users')
forms = db.collection('forms')
responses = db.collection('responses')

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

end

def admin?
  if(session[:user]=="admin@anupshinde.com")
    session[:admin]= true
  else
    session[:admin]= false
  end
end

get "/" do
  erb :index
end

post "/form_submit" do
  erb :blank
end

post "/form_save" do
  p params.length
end

get "/signup" do
  erb :signup
end

post "/signup" do
  password_salt = BCrypt::Engine.generate_salt
  password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
    # save into mongodb
  begin
    id = users.insert({
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
  if user = users.find_one({:_id => params[:email]})
    hash = BCrypt::Engine.hash_secret(params[:password], user["salt"])
    if user["passwordhash"] == hash
      session[:user] = params[:email]
      admin?
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
  return "The file was successfully uploaded!"
end
