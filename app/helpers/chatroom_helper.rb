module ChatroomHelper

  def fetch_channels
    @channels = $redis.get("channels")
    if @channels.nil?
      @channels = Chatbox.pluck(:channel).uniq.to_json
      $redis.set("channels",@channels)
      $redis.expire("channels", 30)
    end
    @channels = JSON.load @channels
  end

  def fetch_conversation(channel)
    #@data = $redis.get(channel)
    @data = fetch_from_redis(channel)

    if @data.empty?
      @data = User.joins(:chatboxes).select("users.username as user_name ,chatboxes.channel as chat_room,chatboxes.message as message,chatboxes.created_at as created_at, chatboxes.id as chatbox_id").where("chatboxes.channel" => channel)
      #@data = @data.as_json
      #$redis.set(channel, @data)
      push_to_redis(channel, @data)
      @data=fetch_from_redis(channel)
    end
    @data = @data
  end

  def fetch_from_redis(channel)
    @redis_data=[]
    count=$redis.scard "#{channel}-list"
    count.times do |i|
      @redis_data.push($redis.hgetall "#{channel}:#{i+1}")
    end
    @redis_data
  end

  def push_to_redis(channel, sqlite_data )
      @redis_data=[]
      counter = 1
      sqlite_data.each do | data |
        $redis.hmset("#{channel}:#{counter}", "message", "#{data.message}", "user_name", "#{data.user_name}", "chat_room", "#{data.chat_room}", "created_at", "#{data.created_at}", "chatbox_id", "#{data.chatbox_id}")
        $redis.sadd("#{channel}-list", counter)
        counter=counter+1
      end

  end
#User.joins(:lunches).where("lunches.user_id"  => "58").select("users.*, lunches.* ,lunches.name AS company, lunches.id AS lunch_id").first.
  def get_all_channels
      user_id = current_user.id
      user_channels=Chatbox.uniq.where(:user_id => user_id).pluck(:channel)
      return user_channels  
  end



  def add_message_to_chatbox(data)
      #redirect_to data['user_name'].nil?
      user = User.find_by(:username => data['user_name'])
      datetime = DateTime.parse(data['created_at'])
      user.chatboxes.create(message: data['message'], channel: data['chat_room'], created_at: datetime )
      #$redis.del data['chat_room']
  end


end
