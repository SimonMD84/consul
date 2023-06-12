module ProjektPhaseActions
  extend ActiveSupport::Concern
  include Translatable
  include MapLocationAttributes

  included do
    alias_method :namespace_mappable_path, :namespace_projekt_phase_path

    before_action :set_projekt_phase
    helper_method :namespace_projekt_phase_path, :namespace_mappable_path
  end

  def update
    if @projekt_phase.update(projekt_phase_params)
      redirect_to namespace_projekt_phase_path(action: params[:action_name] || "duration"),
        notice: t("admin.settings.index.map.flash.update")
    end
  end

  def toggle_active_status
    status_value = params[:projekt][:phase_attributes][:active]
    @projekt_phase.update!(active: status_value)
  end

  def duration; end

  def naming; end

  def restrictions
    @registered_address_groupings = RegisteredAddress::Grouping.all
    @individual_groups = IndividualGroup.visible
  end

  def settings
    @projekt_phase_settings = @projekt_phase.settings
  end

  def map
    @projekt_phase.create_map_location unless @projekt_phase.map_location.present?
    @map_location = @projekt_phase.map_location
  end

  def update_map
    map_location = MapLocation.find_by(projekt_phase_id: params[:id])

    if should_authorize_projekt_manager?
      authorize!(:update_map, map_location)
    end

    map_location.update!(map_location_params)

    redirect_to namespace_projekt_phase_path(action: "map"),
      notice: t("admin.settings.index.map.flash.update")
  end

  private

    def projekt_phase_params
      if params[:projekt_phase][:registered_address_grouping_restrictions]
        filter_empty_registered_address_grouping_restrictions
      end

      params.require(:projekt_phase).permit(
        translation_params(ProjektPhase),
        :active, :start_date, :end_date,
        :verification_restricted, :age_restriction_id,
        :geozone_restricted, :registered_address_grouping_restriction,
        geozone_restriction_ids: [], registered_address_street_ids: [],
        individual_group_value_ids: [],
        registered_address_grouping_restrictions: registered_address_grouping_restrictions_params_to_permit)
    end

    def map_location_params
      if params[:map_location]
        params.require(:map_location).permit(map_location_attributes)
      else
        params.permit(map_location_attributes)
      end
    end

    def set_projekt_phase
      @projekt_phase = ProjektPhase.find(params[:id])
    end

    def registered_address_grouping_restrictions_params_to_permit
      keys_hash = RegisteredAddress::Grouping.all
        .pluck(:key).each_with_object({}) do |key, hash|
          hash[key.to_sym] = []
        end
      keys_hash
    end

    def filter_empty_registered_address_grouping_restrictions
      grouping_restrictions = params[:projekt_phase][:registered_address_grouping_restrictions]
      return if grouping_restrictions.blank?

      filtered_grouping_restrictions = grouping_restrictions
        .reject { |_, v| v == [""] }
        .as_json
        .each { |_, v| v.reject!(&:blank?) }

      params[:projekt_phase][:registered_address_grouping_restrictions] = filtered_grouping_restrictions
    end

    # path helpers

    def namespace_projekt_phase_path(action: "update")
      url_for(controller: params[:controller], action: action, only_path: true)
    end
end
