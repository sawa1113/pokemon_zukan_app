Rails.application.routes.draw do
  namespace :api do
    resources :pokemons, only: [:index, :show]
  end
end
