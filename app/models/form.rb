class Form

  def self.find_all
    $forms.find().sort({sId:1})
  end

  def self.find_max
    $forms.find().sort({"sId" => -1}).limit(1).first()
  end 
  
  def self.form_insert counter,title,data
    $forms.insert({
      :sId => counter,
      :title => title,
      :form => data
    })
  end

  def self.find_record id
    $forms.find_one({:sId => id.to_i})
  end    

  def self.form_delete id
    $forms.remove( {:sId => ((id.empty?)? id :(id).to_i)});
  end  
end
 