resources :projekts, only: [:index, :show] do
  resources :projekt_questions, only: [:index, :show]
  resources :projekt_question_answers, only: [:create, :update]

  collection do
    get :comment_phase_footer_tab
    get :debate_phase_footer_tab
    get :proposal_phase_footer_tab
    get :voting_phase_footer_tab
  end

  member do
    get :json_data
    get :map_html
  end
end

post "update_selected_parent_projekt", to: "projekts#update_selected_parent_projekt"

get :events, to: "projekt_events#index", as: :projekt_events

resources :projekt_livestreams, only: [:show] do
  member do
    post :new_questions
  end
end

get   "/projekt_phases/:id/selector_hint_html",    to: "projekt_phases#selector_hint_html"
get   "/projekt_phases/:id/form_heading_text",     to: "projekt_phases#form_heading_text"
post  "/projekt_phases/:id/toggle_subscription",   to: "projekt_phases#toggle_subscription", as: :toggle_subscription_projekt_phase
patch "/projekt_subscriptions/:id/toggle_subscription", to: "projekt_subscriptions#toggle_subscription", as: :toggle_subscription_projekt_subscription
