import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import sportFragment from '../../../GraphQL/Sports/Fragments/sport';
import spotFragment from '../../../GraphQL/Spots/Fragments/spot';
import Spacer from '../../Common/Spacer';
import SpotsList from '../../Spots/SpotsList';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// TODO: get userCoords and maxDistance from context
const SpotForm = ({ sport, spot, onChange }) => [
  <Spacer key="spacer" size="XL" />,
  <SpotsList
    key="spots"
    cardComponent="SpotListCardSmall"
    sportsIds={sport && sport.id ? [sport.id] : []} // empty array will return all spots
    // userCoords={userCoords}
    // maxDistance={maxDistance} // km
    selectedSpot={spot}
    onCardPress={(value) => { onChange({ fieldName: 'spot', value }); }}
  />,
];

SpotForm.propTypes = {
  sport: propType(sportFragment),
  spot: propType(spotFragment),
  onChange: PropTypes.func,
};

SpotForm.defaultProps = {
  sport: null,
  spot: null,
  onChange: () => {},
};

export default SpotForm;
