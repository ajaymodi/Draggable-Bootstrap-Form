class Response
  def self.response_find id
    $responses.find({:fId => id})
  end

  def self.response_insert hash
    $responses.insert(hash)
  end
end
