class RecommenderController < ApplicationController
  # Disable AuthenticityToken check to avoid "ActionController::InvalidAuthenticityToken" error message
  #skip_before_filter :verify_authenticity_token
  
  def index
  end
  
end