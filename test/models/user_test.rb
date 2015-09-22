require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "username should be unique" do
      @user = User.new(username:  "ravi", email: "ravi@gmail.com", password: "password", password_confirmation: "password")
      @user.save

      @user2 = User.new(username:  "ravi", email: "sdravi@gmail.com", password: "password", password_confirmation: "password")
      assert_not @user2.valid?
  end

  test "email should be unique" do 
      @user = User.new(username:  "ravi", email: "ravi@gmail.com", password: "password", password_confirmation: "password")
      @user.save

      @user2 = User.new(username:  "jravi", email: "ravi@gmail.com", password: "password", password_confirmation: "password")
      assert_not @user2.valid?
  end


end
