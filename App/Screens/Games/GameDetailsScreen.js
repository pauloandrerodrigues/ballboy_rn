import gql from 'graphql-tag';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Image, ScrollView, Share, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components';
import DefaultButton from '../../Components/DefaultButton';
import ErrorBoundary from '../../Components/ErrorBoundary';
import ImageSwiper from '../../Components/ImageSwiper';
import PropertyCircle from '../../Components/PropertyCircle';
import SpotMap from '../../Components/Spots/SpotMap';
import StackBackHeader from '../../Components/StackBackHeader';
import Text from '../../Components/Text';
import UserCircle from '../../Components/UserCircle';
import I18n from '../../I18n/index';
import Colors from '../../Themes/Colors';
import images from '../../Themes/Images';

const SpotOpenImage = () => (
  <Image source={images.spotOpenCircle} style={{ width: 42, height: 42 }} />
);

const mapMax = (maxNum, data, fn, fnElse) => {
  if (maxNum >= data.length) return data.map(fn);

  const returnArr = data.slice(0, maxNum - 1).map(fn);
  returnArr.push(fnElse());
  return returnArr;
};

class GameComponent extends Component {
  static propTypes = {
    game: PropTypes.object,
    style: ViewPropTypes.style,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
    };
  }

  openPlayerList = () => {
    this.props.navigation.navigate('GamePlayerScreen', {
      uuid: this.props.game.uuid,
    });
  };

  onShare = (game) => {
    Share.share(
      {
        message: 'You have been invited',
        url: game.link,
        title: 'Sportyspots',
      },
      {
        dialogTitle: I18n.t('share'),
      },
    );
  };

  render() {
    const game = this.props.game;
    const spot = game.spot;
    const images =
      spot.images.length > 0
        ? spot.images.map(image => image.image)
        : [
          'https://raw.githubusercontent.com/SportySpots/cruijff/graphql/App/Images/spot-placeholder.png',
        ];

    const attendingUsers = game.attendees
      .filter(rsvp => rsvp.status === 'ATTENDING')
      .map(rsvp => rsvp.user);

    const nOpenSpots = Math.max(0, game.capacity - attendingUsers.length);
    return (
      <ScrollView style={this.props.style}>
        <SwiperContainer>
          <ImageSwiper images={images} />
        </SwiperContainer>
        <BlockHeader>
          <HeaderLeft>
            <Text.M>{spot.name}</Text.M>
            <HeaderLeftDetails>
              <Text.SM>{moment(game.start_time).format('D MMM')}</Text.SM>
              <Time>
                <MaterialIcon name="access-time" style={{ paddingRight: 4 }} />
                <Text.SM>
                  {moment(game.start_time).format('HH')} - {moment(game.end_time).format('HH')}
                </Text.SM>
              </Time>
              <Text.SM>{I18n.t(game.sport.category)}</Text.SM>
            </HeaderLeftDetails>
          </HeaderLeft>
          <HeaderRight />
        </BlockHeader>
        <View style={{ margin: 0 }}>
          <ErrorBoundary>
            <SpotMap spot={spot} />
          </ErrorBoundary>
        </View>
        <Block>
          <BlockLabel>{I18n.t('Organizer')}</BlockLabel>
          <TouchableOpacity onPress={this.openPlayerList}>
            <HorizontalView>
              <UserCircle user={game.organizer} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Text.SM>
                  {game.organizer.first_name} {game.organizer.last_name} - {game.description}
                </Text.SM>
              </View>
            </HorizontalView>
          </TouchableOpacity>
        </Block>
        {attendingUsers.length > 0 && (
          <Block>
            <BlockLabel>{I18n.t('Attending')}</BlockLabel>
            <TouchableOpacity onPress={this.openPlayerList}>
              <HorizontalView>
                {mapMax(
                  8,
                  attendingUsers,
                  user => <UserCircle key={user.uuid} user={user} style={{ marginRight: 4 }} />,
                  () => <PropertyCircle key="extra" text={`+${attendingUsers.length - 7}`} />,
                )}
              </HorizontalView>
            </TouchableOpacity>
          </Block>
        )}
        {nOpenSpots > 0 && (
          <Block>
            <BlockLabel>{I18n.t('Open spots')}</BlockLabel>
            <TouchableOpacity onPress={this.openPlayerList}>
              <HorizontalView>
                {mapMax(
                  8,
                  [...Array(nOpenSpots)],
                  (_, i) => <SpotOpenImage key={i} />,
                  () => <PropertyCircle key="extra" text={`+${nOpenSpots - 7}`} />,
                )}
              </HorizontalView>
            </TouchableOpacity>
          </Block>
        )}
        {nOpenSpots > 0 && (
          <Block>
            <HorizontalView style={{ width: '100%' }}>
              <DefaultButton
                style={{ flex: 1, marginLeft: -10 }}
                bgColor={Colors.primaryGreen}
                textColor={Colors.white}
                text={I18n.t("I'm attending")}
              />
              <DefaultButton
                style={{ flex: 1, marginRight: -10 }}
                bgColor={Colors.red}
                textColor={Colors.white}
                text={I18n.t("I'm not attending")}
              />
            </HorizontalView>
          </Block>
        )}
        <Block>
          <BlockLabel>{I18n.t('Share with friends')}</BlockLabel>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.gray,
              height: 48,
              width: 48,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this.onShare(game)}
          >
            <MaterialIcon size={32} color={Colors.white} name="share" />
          </TouchableOpacity>
        </Block>
      </ScrollView>
    );
  }
}

export default class Game extends Component {
  static propTypes = {
    uuid: PropTypes.string,
    style: ViewPropTypes.style,
  };
  static navigationOptions = {
    title: I18n.t('Game details'),
    header: props => <StackBackHeader {...props} title={I18n.t('Game details')} />,
  };

  render() {
    return (
      <Query query={GET_GAME_DETAILS} variables={{ uuid: this.props.navigation.state.params.uuid }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :( {JSON.stringify(error)}</Text>;
          return (
            <GameComponent
              style={this.props.style}
              game={data.game}
              navigation={this.props.navigation}
            />
          );
        }}
      </Query>
    );
  }
}

const GET_GAME_DETAILS = gql`
  query game($uuid: UUID!) {
    game(uuid: $uuid) {
      uuid
      name
      start_time
      end_time
      is_featured
      show_remaining
      capacity
      description
      sport {
        category
      }
      spot {
        uuid
        name
        images {
          image
        }
        amenities {
          sport {
            category
          }
          data
        }
        sports {
          category
        }
        address {
          lat
          lng
        }
      }
      organizer {
        first_name
        last_name
      }
      attendees {
        status
        user {
          uuid
          first_name
          last_name
        }
      }
    }
  }
`;

const HorizontalView = styled.View`
  flex-direction: row;
`;

const SwiperContainer = styled.View`
  height: 150px;
  width: 100%;
`;

const Block = styled.View`
  padding: 16px;
`;

const BlockHeader = styled(Block)`
  flex-direction: row;
`;

const HeaderLeft = styled.View`
  flex: 4;
`;

const HeaderRight = styled.View`
  flex: 3;
`;

const HeaderLeftDetails = styled(HorizontalView)`
  justify-content: space-between;
  margin-top: 16px;
`;

const Time = styled(HorizontalView)`
  align-items: center;
`;

const BlockLabel = styled(Text.M)`
  margin-bottom: 8px;
`;
