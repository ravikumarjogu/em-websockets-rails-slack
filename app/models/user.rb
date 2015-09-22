class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :chatboxes

  validates :username, uniqueness: true
  
  after_create :feed_user_created

  #after_save :feed_user_joined




  def feed_user_created
      data=Hash.new
      data['user_name'] = self.username
      data['message']   = " Registered"
      data['chat_room'] = "notifications"
    
      #status=$redis_feed.publish ("notifications",data.to_json)
      status=$redis_feed.publish("notifications",data.to_json)


  end




end
