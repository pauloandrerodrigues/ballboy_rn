import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Text from './Text';
import Colors from '../Themes/Colors';

const ButtonContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.bgColor};
  margin: 16px;
  height: 56px;
  border-radius: 4px;
`;

const ButtonLabel = styled(Text.M)`
  font-weight: 500;
  color: ${props => props.textColor};
`;

const DefaultButton = ({
  bgColor,
  textColor,
  text,
  disabled,
  ...props
}) => {
  const RootComponent = disabled ? View : TouchableOpacity;
  return (
    <RootComponent {...props}>
      <ButtonContainer bgColor={bgColor}>
        <ButtonLabel textColor={textColor}>{text}</ButtonLabel>
      </ButtonContainer>
    </RootComponent>
  );
};

DefaultButton.propTypes = {
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
};

DefaultButton.defaultProps = {
  bgColor: Colors.actionYellow,
  textColor: '#fff',
  text: '',
  disabled: false,
};

export default DefaultButton;
