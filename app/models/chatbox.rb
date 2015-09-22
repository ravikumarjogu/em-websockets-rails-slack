class Chatbox < ActiveRecord::Base
  belongs_to :user
  #before_save :note_current_groups
  after_save :clear_channels_cache_when_group_added, :clear_channel_cache_when_chat_added
  default_scope -> { order(created_at: :desc)}
  validates :user_id, presence: true
  validates :message, presence: true
  validates :channel, presence: true
  
  attr_accessor :group_added

  def clear_channels_cache_when_group_added
      if !(($redis.get "channels").inlcude? self.channel)

#      if self.group_added != Chatbox.pluck(:channel).uniq.count
        $redis.del "channels"
        feed_group_added
      end
  end

  def clear_channel_cache_when_chat_added
      channel = self.channel
      $redis.del "#{channel}-list"
      counter=Chatbox.where(:channel => channel).count
      (counter+1).times do |i|
        $redis.del "#{channel}:#{i+1}"
      end

  end

#  def note_current_groups
#      self.group_added = Chatbox.pluck(:channel).uniq.count
#  end

  def feed_group_added
      
      data=Hash.new
      user_who_created_it = User.find(self.user_id).username

      data['user_name'] = self.channel

      data['message']   = "channel created by #{user_who_created_it}"
      data['chat_room'] = "notifications"
      data['created_at'] = DateTime.now
    
      #status=$redis_feed.publish ("notifications",data.to_json)
      status=$redis_feed.publish("notifications",data.to_json)
  end

end
