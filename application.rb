require 'bundler'
require 'yaml'
require 'bcrypt'
require 'sinatra/flash'

module Demo

  class Application
    def self.root(path = nil)
      @_root ||= File.expand_path(File.dirname(__FILE__))
      path ? File.join(@_root, path.to_s) : @_root
    end

    def self.env
      @_env ||= ENV['RACK_ENV'] || 'development'
    end

    # Initialize the application
    def self.initialize!
    end

  end
end

Bundler.require(:default, Demo::Application.env)

config = YAML.load(File.read(File.join(Demo::Application.root, "config", "database.yml")))[Demo::Application.env]
$conn = Mongo::MongoClient.new(config["mongo"]["host"], config["mongo"]["port"], :pool_size => 25, :pool_timeout => 18000)

db = $conn.db(config["mongo"]["database"])
$users = db.collection('users')
$forms = db.collection('forms')
$responses = db.collection('responses')
# Preload application classes
Dir['./app/**/*.rb'].each {|f| require f}
set :views, settings.root + '/app/views'
set :models, settings.root + '/app/models'
$ver_number = Time.now.to_i

