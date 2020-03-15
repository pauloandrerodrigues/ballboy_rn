import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import I18n from '../../../I18n';
import notificationFragment from '../../../GraphQL/NotificationsList/Fragments/notification';
import Row from '../../Common/Row';
import Spacer from '../../Common/Spacer';
import DotSpacer from '../../Common/DotSpacer';
import Text from '../../Common/Text';
import Icon from '../../Common/Icon';
import { getNotificationIcon, getNotificationTypeText } from './utils';

//------------------------------------------------------------------------------
// CONSTANTS:
//------------------------------------------------------------------------------
const CARD_HEIGHT = 80;
const IMG_WIDTH = 75;
const IMG_PADDING = 16;
//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const RowContainer = styled(Row)`
  height: ${CARD_HEIGHT}px;
  background-color: ${({ theme, highlight }) => theme.colors[highlight ? 'silver' : 'white']};
`;
//------------------------------------------------------------------------------
const Left = styled.View`
  height: ${CARD_HEIGHT}px;
  width: ${IMG_WIDTH}px;
  padding: ${IMG_PADDING}px;
`;
//------------------------------------------------------------------------------
const Right = styled.View`
  flex: 1;
  padding: 8px 0 8px 0;
  overflow: hidden;
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const NotificationCard = ({ notification, onCardPress }) => {
  const {
    createdAt, notificationType, sender, payload, didRead,
  } = notification;

  const { activityTitle } = JSON.parse(payload);

  const iconName = getNotificationIcon(notificationType);
  const [eventType, eventDescription] = getNotificationTypeText(notificationType);

  return (
    <TouchableOpacity
      onPress={onCardPress}
      activeOpacity={1}
    >
      <RowContainer highlight={!didRead}>
        <Left>
          <Image
            source={{ uri: sender.avatarURL }}
            style={{
              height: CARD_HEIGHT - 2 * IMG_PADDING,
              width: IMG_WIDTH - 2 * IMG_PADDING,
            }}
          />
        </Left>
        <Right>
          <Row alignItems="center">
            <Icon
              iconSet="MaterialCommunityIcons"
              iconName={iconName}
              size={18}
              color="link"
            />
            <Spacer row size="ML" />
            <Text size="S" color="dusk">
              {I18n.t(eventType)}
            </Text>
            <DotSpacer row size="M" />
            <Text size="S" color="dusk">
              {moment(createdAt).fromNow()}
            </Text>
          </Row>
          <Spacer size="S" />
          <Row alignItems="center">
            <Text size="SSM" semibold>
              {sender.name}
            </Text>
            <Spacer row size="S" />
            <Text size="SSM">
              {I18n.t(eventDescription)}
            </Text>
            <Spacer row size="S" />
            <Text size="SSM" semibold>
              {activityTitle || ''}
            </Text>
          </Row>
        </Right>
      </RowContainer>
    </TouchableOpacity>
  );
};

NotificationCard.propTypes = {
  notification: propType(notificationFragment).isRequired,
  onCardPress: PropTypes.func,
};

NotificationCard.defaultProps = {
  onCardPress: () => {},
};

export default NotificationCard;
