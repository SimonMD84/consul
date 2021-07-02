(function() {
  "use strict";
  App.Projekts = {

    // Functions for selectors in form

    toggleChildProjekts: function($label) {
      var projektId = $label.data()['projektId']
      var dataParentIdentifierString = "[data-parent=\"" + projektId + "\"]"
      var $childrenProjektsGroup = $( dataParentIdentifierString )

      if ( $childrenProjektsGroup.is(":hidden") ) {
        App.Projekts.hideCurrentlyVisibleChildProjekts($label);
        $childrenProjektsGroup.show()
      } else {
        App.Projekts.hideCurrentlyVisibleChildProjekts($label);
      }
    },

    highlightLabel: function($label) {
      $label.closest('.projekt-tags-column').find('label').each( function() {
        $(this).removeClass('highlighted')
      })


      $label.closest('.projekt-tags-column').nextAll('.projekt-tags-column').each( function() {
        $(this).find('label').each(function() {
          $(this).removeClass('highlighted')
        })
      })


      $label.addClass('highlighted')
    },

    hideCurrentlyVisibleChildProjekts: function($label) {
      var $currentProjektGroup = $label.parent();
      var $currentColumn = $label.parent().parent()

      $currentColumn.nextAll().each(function() {
        $(this).find(".projekt-group").each( function() {
          $(this).hide();
        })
      })
    },

    // Functions for selectors in sidebar

    toggleChildrenInSidebar: function($label) {
      $label.attr('aria-expanded', function (i, attr) {
        return attr == 'true' ? 'false' : 'true'
      });
    },

    formNewFilterProjektsRequest: function($checkbox) {

      var url = new URL(window.location.href);
      var selectedProjektIds;
      var $label = $checkbox.parent()
      var $filterArrow = $label.siblings('.projekt-arrow').first()

      if (url.searchParams.get('projekts')) {
        selectedProjektIds = url.searchParams.get('projekts').split(',');
      } else {
        selectedProjektIds = [];
      }

      if ( $checkbox.is(':checked') ) {
        selectedProjektIds.push($checkbox.val());
        $label.css('color', '#06408E')
        $filterArrow.css('border-color', '#06408E')

      } else {
        var index = selectedProjektIds.indexOf($checkbox.val());
        if (index > -1) {
          selectedProjektIds.splice(index, 1);
        }
        $label.css('color', '#878787')
        $filterArrow.css('border-color', '#C6C6C6')
      }

      var uniqueProjektIds = selectedProjektIds.filter( function(v, i, a) { return  a.indexOf(v) === i } );

      if ( uniqueProjektIds.length > 0) {
        url.searchParams.set('projekts', uniqueProjektIds.join(','))
      }  else {
        url.searchParams.delete('projekts')
      }

      window.history.pushState('', '', url)
    },

    // Functions for filtering by combination of projects, categories, and user tags

    modifyFilterParams: function(clickedLink) {
      var currentPageUrl = new URL(window.location.href);
      var currentProjektIds;
      var currentGeoZoneRestriction;
      var currentRestrictedGeoZoneIds;
      var currentGeoZoneAffiliation;
      var currentAffiliatedGeoZoneIds;
      var currentTags;

      if (currentPageUrl.searchParams.get('projekts')) {
        currentProjektIds = currentPageUrl.searchParams.get('projekts').split(',');
      } else {
        currentProjektIds = [];
      }

      if (currentPageUrl.searchParams.get('geozone_restriction')) {
        currentGeoZoneRestriction = currentPageUrl.searchParams.get('geozone_restriction');
      } else {
        currentGeoZoneRestriction = '';
      }

      if (currentPageUrl.searchParams.get('restricted_geozones')) {
        currentRestrictedGeoZoneIds = currentPageUrl.searchParams.get('restricted_geozones').split(',');
      } else {
        currentRestrictedGeoZoneIds = [];
      }

      if (currentPageUrl.searchParams.get('geozone_affiliation')) {
        currentGeoZoneAffiliation = currentPageUrl.searchParams.get('geozone_affiliation');
      } else {
        currentGeoZoneAffiliation = '';
      }

      if (currentPageUrl.searchParams.get('affiliated_geozones')) {
        currentAffiliatedGeoZoneIds = currentPageUrl.searchParams.get('affiliated_geozones').split(',');
      } else {
        currentAffiliatedGeoZoneIds = [];
      }

      if (currentPageUrl.searchParams.get('tags')) {
        currentTags = currentPageUrl.searchParams.get('tags').split(',');
      } else {
        currentTags = [];
      }

      if (currentPageUrl.searchParams.get('page')) {
        currentPageUrl.searchParams.delete('page');
      }

      var clickedUrl = new URL(clickedLink);
      var newProjektId;
      var newGeoZoneRestriction;
      var newRestrictedGeoZoneId;
      var newGeoZoneAffiliation;
      var newAffiliatedGeoZoneId;
      var newTag;

      if (clickedUrl.searchParams.get('projekts')) {
        newProjektId = clickedUrl.searchParams.get('projekts').split(',')[0];

        if (currentProjektIds.includes(newProjektId)) {
          var index = currentProjektIds.indexOf(newProjektId);
          if (index > -1) {
            currentProjektIds.splice(index, 1);
          }
          currentPageUrl.searchParams.set('projekts', currentProjektIds.join(','))
        } else {
          currentProjektIds.push(newProjektId)
          currentProjektIds = currentProjektIds.filter( function(element) { return element !== '' } )
          currentPageUrl.searchParams.set('projekts', currentProjektIds.join(','))
        }
      }

      if (clickedUrl.searchParams.get('geozone_restriction')) {
        newGeoZoneRestriction = clickedUrl.searchParams.get('geozone_restriction');

        if (currentGeoZoneRestriction == newGeoZoneRestriction) {
          currentPageUrl.searchParams.set('geozone_restriction', '')
        } else {
          currentPageUrl.searchParams.set('geozone_restriction', newGeoZoneRestriction)
        }
      }

      if (clickedUrl.searchParams.get('restricted_geozones')) {
        newRestrictedGeoZoneId = clickedUrl.searchParams.get('restricted_geozones').split(',')[0];

        if (currentRestrictedGeoZoneIds.includes(newRestrictedGeoZoneId)) {
          var index = currentRestrictedGeoZoneIds.indexOf(newRestrictedGeoZoneId);
          if (index > -1) {
            currentRestrictedGeoZoneIds.splice(index, 1);
          }
          currentPageUrl.searchParams.set('restricted_geozones', currentRestrictedGeoZoneIds.join(','))
          currentPageUrl.searchParams.set('geozone_restriction', 'only_geozones')
        } else {
          currentRestrictedGeoZoneIds.push(newRestrictedGeoZoneId)
          currentRestrictedGeoZoneIds = currentRestrictedGeoZoneIds.filter( function(element) { return element !== '' } )
          currentPageUrl.searchParams.set('restricted_geozones', currentRestrictedGeoZoneIds.join(','))
          currentPageUrl.searchParams.set('geozone_restriction', 'only_geozones')
        }
      }

      if (clickedUrl.searchParams.get('geozone_affiliation')) {
        newGeoZoneAffiliation = clickedUrl.searchParams.get('geozone_affiliation');

        if (currentGeoZoneAffiliation == newGeoZoneAffiliation) {
          currentPageUrl.searchParams.set('geozone_affiliation', '')
        } else {
          currentPageUrl.searchParams.set('geozone_affiliation', newGeoZoneAffiliation)
        }
      }
      if (clickedUrl.searchParams.get('affiliated_geozones')) {
        newAffiliatedGeoZoneId = clickedUrl.searchParams.get('affiliated_geozones').split(',')[0];

        if (currentAffiliatedGeoZoneIds.includes(newAffiliatedGeoZoneId)) {
          var index = currentAffiliatedGeoZoneIds.indexOf(newAffiliatedGeoZoneId);
          if (index > -1) {
            currentAffiliatedGeoZoneIds.splice(index, 1);
          }
          currentPageUrl.searchParams.set('affiliated_geozones', currentAffiliatedGeoZoneIds.join(','))
          currentPageUrl.searchParams.set('geozone_affiliation', 'only_geozones')
        } else {
          currentAffiliatedGeoZoneIds.push(newAffiliatedGeoZoneId)
          currentAffiliatedGeoZoneIds = currentAffiliatedGeoZoneIds.filter( function(element) { return element !== '' } )
          currentPageUrl.searchParams.set('affiliated_geozones', currentAffiliatedGeoZoneIds.join(','))
          currentPageUrl.searchParams.set('geozone_affiliation', 'only_geozones')
        }
      }

      if (clickedUrl.searchParams.get('tags')) {
        newTag = clickedUrl.searchParams.get('tags').split(',')[0];

        if (currentTags.includes(newTag)) {
          var index = currentTags.indexOf(newTag);
          if (index > -1) {
            currentTags.splice(index, 1);
          }
          currentPageUrl.searchParams.set('tags', currentTags.join(','))
        } else {
          currentTags.push(newTag)
          currentPageUrl.searchParams.set('tags', currentTags.join(','))
        }
      }


      window.history.pushState('', '', currentPageUrl)
      window.location.href = currentPageUrl.href;

    },

    replaceProjektMapOnProposalCreation: function($label, $radioButton) {

      var defaultLat = $("#projekt-tags-selector").attr('data-default-map-latitude')
      var defaultLng = $("#projekt-tags-selector").attr('data-default-map-longitude')
      var defaultZoom = $("#projekt-tags-selector").attr('data-default-map-zoom')

      if ($radioButton.is(':checked')) {
        if ($label.hasClass('hide-map')) {
          $('#map-for-new-proposal').addClass('hide')
        } else {
          $('#map-for-new-proposal').removeClass('hide')
          App.Map.maps[0].setView([$label.attr('data-latitude'), $label.attr('data-longitude')], $label.attr('data-zoom')).invalidateSize()
        }
      } else {
        $('#map-for-new-proposal').removeClass('hide')
        App.Map.maps[0].setView([defaultLat, defaultLng], defaultZoom).invalidateSize()
      }

    },


    // Initializer
 
    initialize: function() {
      $("body").on("click", ".js-show-children-projekts", function(event) {
        event.preventDefault();

        if ( event.target.tagName == 'LABEL' ) {
          var $label = $(this)
        } else {
          var $label = $(this).parent()
        }

        App.Projekts.toggleChildProjekts($label);
        App.Projekts.highlightLabel($label);
        return false;
      });

      $("body").on("click", ".js-select-projekt", function() {
        var $label = $(this).closest('label')

        if ( $label.hasClass('projekt-phase-disabled')) {
          return false;
        }

        var $radioButton = $label.find(":radio").first()

        $radioButton.prop( "checked", !$radioButton.prop( "checked") );

        $label.toggleClass('selected')
        App.Projekts.highlightLabel($label);

        App.Projekts.replaceProjektMapOnProposalCreation($label, $radioButton)
      });

      $("body").on("click", ".js-filter-projekt", function() {
        var $checkbox = $(this);
        App.Projekts.formNewFilterProjektsRequest($checkbox);

        var $parentProjekt = $(this).closest('li');

        if ( $parentProjekt.next().prop("tagName")  === 'UL') {
          var $childrentCheckboxes = $parentProjekt.siblings().find('.js-filter-projekt');

          if ( $checkbox.is(':checked') ) {
            $childrentCheckboxes.each( function() {
              $(this).prop( "checked", true )
              App.Projekts.formNewFilterProjektsRequest($(this));
            });
          } else {
            $childrentCheckboxes.each( function() {
              $(this).prop( "checked", false)
              App.Projekts.formNewFilterProjektsRequest($(this));
            });
          }
        }
      });

      $("body").on("click", ".js-apply-projekts-filter", function(event) {
        event.preventDefault();
        var url = new URL(window.location.href);

        if (url.searchParams.get('page')) {
          url.searchParams.delete('page');
        }

        window.location.href = url;
      });

      $("body").on("click", ".js-reset-projekts-filter", function(event) {
        $('#filter-projekts-all input').each(
          function() {
            $(this).prop('checked', false)
          }
        )

        var url = new URL(window.location.href);
        url.searchParams.delete('projekts')
        window.history.pushState('', '', url)

      });

      $("body").on("click", ".js-projekt-tag-filter-link", function(event) {
        event.preventDefault()
        var clickedLink = this.href
        App.Projekts.modifyFilterParams(clickedLink);
      });


      $("body").on("click", ".js-icon-toggle-child-projekts", function(event) {
        var $label = $(this).parent();
        App.Projekts.toggleChildrenInSidebar($label);
      });

      $("body").on("click", ".js-toggle-edit-projekt-info", function(event) {
        var $row = $(this).closest('tr');
        App.Projekts.toggleChildrenInSidebar($row);

      })

    }
  };
}).call(this);
