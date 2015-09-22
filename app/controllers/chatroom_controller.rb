class ChatroomController < ApplicationController
  require 'json'
  before_action :active_user, only: [:chat_room, :conversation]
  respond_to :json, :html
  protect_from_forgery except: :add
  def chat_room
    @channels = fetch_channels
    #@channels=get_all_channels
    #@get_username=User.find(current_user.id).username
    feed_user_joined
  end

  def conversation
    #data = Chatbox.all
    channel = params['chat_room']
    data=fetch_conversation(channel)
    #data = fetch_conversation(@channel)
    #data = { :status => :ok, :chat_room => "not specified"}
    respond_to do |format|
      format.json { render :json => data.to_json}
      format.html { redirect_to root}
      format.js { render :text => :success}
  end

  end

  def add
    
    #debugger

    data = JSON.parse(params[:data])
    add_message_to_chatbox(data)

    res={:status => 'success'}

    respond_to do |format|
      format.json { render :text => res.to_json}
      format.html { redirect_to root}
      format.js { render :text => :success}
    end


  end


  private
    def active_user
      redirect_to new_user_session_path unless user_signed_in?
    end

end
