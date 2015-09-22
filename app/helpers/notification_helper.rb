module NotificationHelper

  def feed_user_joined
      data=Hash.new
      data['user_name'] = current_user.username
      data['message']   = " joined"
      data['chat_room'] = "notifications"
      data['created_at'] = DateTime.now
    
      #status=$redis_feed.publish ("notifications",data.to_json)
      status=$redis_feed.publish("notifications",data.to_json)
  end

  

end
