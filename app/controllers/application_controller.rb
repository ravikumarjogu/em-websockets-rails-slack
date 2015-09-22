class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :configure_permitted_parameters, if: :devise_controller?

  include ChatroomHelper
  include NotificationHelper

  protect_from_forgery with: :exception
  protected
  
  def configure_permitted_parameters

      devise_parameter_sanitizer.for(:sign_in) { |u| u.permit(:email, :password,:username) }

      devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:email, :password, :password_confirmation,:username) }

      devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:email, :password, :password_confirmation,:username) }

  end


  
end
