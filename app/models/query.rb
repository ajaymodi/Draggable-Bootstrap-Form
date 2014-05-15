class Query
  
  def self.find_user email
    $users.find_one({:_id => email})
  end

  def self.insert_user email,salt,phash
    $users.insert({
      :_id => email,
      :salt => salt,
      :passwordhash => phash 
    })
  end

end
