import React from 'react';
import { propType } from 'graphql-anywhere';
import { showLocation } from 'react-native-map-link';
import I18n from '../../../I18n';
import spotFragment from '../../../GraphQL/Spots/Fragments/spot';
import Colors from '../../../Themes/Colors';
import Text from '../../Common/Text';
import Spacer from '../../Common/Spacer';
import Block from '../../Common/Block';
import getSpotLocation from './utils';

// -----------------------------------------------------------------------------
// AUX FUNCTIONS:
// -----------------------------------------------------------------------------
const handleLocationBtnPress = ({ latLng, title = '' }) => {
  showLocation({
    ...latLng,
    title,
    // force GoogleMaps to use the latLng from the query instead of the title
    googleForceLatLon: true,
  });
};
// -----------------------------------------------------------------------------
// COMPONENT:
// -----------------------------------------------------------------------------
/**
 * @summary Renders link to spot's location in case map crashes.
 */
const SpotLink = ({ spot }) => {
  // Get sport location
  const latLng = getSpotLocation(spot);

  if (!latLng.latitude || !latLng.longitude) {
    return null;
  }

  const link = (
    <Text
      style={{ color: Colors.actionBlue }}
      onPress={() => {
        handleLocationBtnPress({ latLng, title: spot.name });
      }}
    >
      {I18n.t('here')}
    </Text>
  );

  return (
    <Block>
      <Text.M>{I18n.t("Oops! The map couldn't be loaded :(")}</Text.M>
      <Spacer orientation="column" size="M" />
      <Text>
        {I18n.t('Click')} {link}{' '}
        {I18n.t("to see the spot's location on Google Maps")}
      </Text>
    </Block>
  );
};

SpotLink.propTypes = {
  spot: propType(spotFragment).isRequired,
};

export default SpotLink;
