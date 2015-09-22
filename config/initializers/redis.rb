#useful to redify(caching) channels & each channel_chat_messages
#reserves 2 connections from redis
$redis = Redis::Namespace.new("site_point", :redis => Redis.new(:host => "pub-redis-12038.us-east-1-2.4.ec2.garantiadata.com", :port => 12038, :password => "SamSung9S"))
#$redis = Redis.new(:host => "pub-redis-12038.us-east-1-2.4.ec2.garantiadata.com", :port => 12038, :password => "SamSung9S")
#useful to broadcast notifications
#$redis_feed = Redis.new
#reserves 1 connection from redis
$redis_feed = Redis.new(:host => "pub-redis-12038.us-east-1-2.4.ec2.garantiadata.com", :port => 12038, :password => "SamSung9S")
