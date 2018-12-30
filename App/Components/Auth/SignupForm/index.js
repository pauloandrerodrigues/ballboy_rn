import React from 'react';
import PropTypes from 'prop-types';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorHandling from 'error-handling-utils';
import isEmail from 'validator/lib/isEmail';
import styled from 'styled-components';
import pick from 'lodash/pick';
import I18n from '../../../I18n';
import Colors from '../../../Themes/Colors';
import Block from '../../Common/Block';
// import Spacer from '../../Common/Spacer';
import Text from '../../Common/Text';
import Link from '../../Common/Link';
import TextField from '../../Common/TextField';
import RaisedButton from '../../Common/RaisedButton';

//------------------------------------------------------------------------------
// CONSTANTS:
//------------------------------------------------------------------------------
const MAX_CHARS = 120;
const FIELDS = ['firstName', 'lastName', 'email', 'password'];
//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const FlexOne = styled.ScrollView`
  flex: 1; /* full height */
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// TODO: use KeyboardAwareScrollView
class SignupForm extends React.PureComponent {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    errors: {
      firstName: [],
      lastName: [],
      email: [],
      password: [],
    },
    // Keep track of field position in order to 'scroll to' on error
    offsetY: {
      firstName: 0,
      lastName: 0,
      email: 0,
      password: 0,
    },
  }

  componentWillReceiveProps({ errors }) {
    // Display server side errors coming from the outside
    if (errors) {
      this.setState({
        errors: {
          firstName: [],
          lastName: [],
          email: [],
          password: [],
          ...errors,
        },
      });
    }
  }

  clearErrors = () => {
    this.setState({
      errors: {
        firstName: [],
        lastName: [],
        email: [],
        password: [],
      },
    });
  };

  handleLayout = ({ fieldName, nativeEvent }) => {
    const { offsetY } = this.state;

    this.setState({
      offsetY: {
        ...offsetY,
        [fieldName]: nativeEvent.layout.y,
      },
    });
  }

  handleChange = ({ fieldName, value }) => {
    const { errors } = this.state;

    // Update value and clear errors for the given field
    this.setState({
      [fieldName]: value,
      errors: ErrorHandling.clearErrors(errors, fieldName),
    });
  }

  validateFields = ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    // Initialize errors
    const errors = {
      firstName: [],
      lastName: [],
      email: [],
      password: [],
    };

    // Sanitize input
    const _firstName = firstName && firstName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_firstName) {
      errors.firstName.push('signupForm.fields.firstName.errors.required');
    } else if (_firstName.length > MAX_CHARS) {
      errors.firstName.push('signupForm.fields.firstName.errors.tooLong');
    }

    // Sanitize input
    const _lastName = lastName && lastName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_lastName) {
      errors.lastName.push('signupForm.fields.lastName.errors.required');
    } else if (_lastName.length > MAX_CHARS) {
      errors.lastName.push('signupForm.fields.lastName.errors.tooLong');
    }

    // Sanitize input
    const _email = email && email.trim(); // eslint-disable-line no-underscore-dangle

    if (!_email) {
      errors.email.push('signupForm.fields.email.errors.required');
    } else if (!isEmail(_email)) {
      errors.email.push('signupForm.fields.email.errors.invalid');
    } else if (_email.length > MAX_CHARS) {
      errors.email.push('signupForm.fields.email.errors.tooLong');
    }

    // Don't sanitize password
    if (!password || password.length === 0) {
      errors.password.push('signupForm.fields.password.errors.required');
    } else if (password.length > MAX_CHARS) {
      errors.password.push('signupForm.fields.password.errors.tooLong');
    }

    return errors;
  };

  handleSubmit = () => {
    const {
      onBeforeHook,
      onClientCancelHook,
      onClientErrorHook,
      onSuccessHook,
    } = this.props;

    // Run before logic if provided and return on error. onBeforeHook will set the 'disabled'
    // value to 'true' so that the user cannot re-submit the form
    try {
      onBeforeHook();
    } catch (exc) {
      onClientCancelHook();
      return; // return silently
    }

    // Get field values
    const fields = pick(this.state, FIELDS);

    // Clear previous errors if any
    this.clearErrors();

    // Validate fields
    const errors = this.validateFields(fields);

    // In case of errors, display on UI and return handler to parent component
    if (ErrorHandling.hasErrors(errors)) {
      this.setState({ errors });
      // Scroll to first error field
      const { offsetY } = this.state;
      const firstErrorKey = ErrorHandling.getFirstError(errors).key; // 'name', 'attendees', 'description'
      const y = parseInt(offsetY[firstErrorKey], 10);
      this.scroller.scrollTo({ x: 0, y });
      // Pass event up to parent component. onClientErrorHook will set 'disabled'
      // value back to 'false' so that the user can re-submit the form
      onClientErrorHook();
      return;
    }

    // Pass event up to parent component
    onSuccessHook(fields);
  }

  render() {
    const { disabled } = this.props;
    const {
      firstName,
      lastName,
      email,
      password,
      errors,
    } = this.state;

    // Apply translation and concatenate field errors (string)
    const firstNameErrors = ErrorHandling.getFieldErrors(errors, 'firstName', I18n.t);
    const lastNameErrors = ErrorHandling.getFieldErrors(errors, 'lastName', I18n.t);
    const emailErrors = ErrorHandling.getFieldErrors(errors, 'email', I18n.t);
    const passwordErrors = ErrorHandling.getFieldErrors(errors, 'password', I18n.t);

    return [
      <FlexOne
        key="top"
        ref={(scroller) => { this.scroller = scroller; }}
        testID="signupScrollView"
      >
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'firstName', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldFirstName"
            label={I18n.t('signupForm.fields.firstName.label')}
            value={firstName}
            error={firstNameErrors}
            size="ML"
            disabled={disabled}
            autoFocus
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'firstName', value });
            }}
          />
        </Block>
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'lastName', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldLastName"
            label={I18n.t('signupForm.fields.lastName.label')}
            value={lastName}
            error={lastNameErrors}
            size="ML"
            disabled={disabled}
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'lastName', value });
            }}
          />
        </Block>
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'email', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldEmail"
            label={I18n.t('signupForm.fields.email.label')}
            value={email}
            error={emailErrors}
            size="ML"
            disabled={disabled}
            keyboardType="email-address"
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'email', value });
            }}
          />
        </Block>
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'password', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldPassword"
            label={I18n.t('signupForm.fields.password.label')}
            value={password}
            error={passwordErrors}
            size="ML"
            disabled={disabled}
            secureTextEntry
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'password', value });
            }}
          />
        </Block>
        <Block>
          <Text.M style={{ color: Colors.black }}>
            {I18n.t('signupForm.terms.prefix')}
          </Text.M>
          <Link
            text={I18n.t('signupForm.terms.link')}
            href="https://www.sportyspots.com/terms.html"
            color={Colors.actionYellow}
            underline
          />
        </Block>
      </FlexOne>,
      <Block key="bottom">
        <RaisedButton
          testID="signupButtonSubmit"
          variant="default"
          label={I18n.t('signupForm.btnLabel')}
          disabled={disabled}
          onPress={this.handleSubmit}
        />
      </Block>,
    ];
  }
}

SignupForm.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object, // eslint-disable-line
  onBeforeHook: PropTypes.func,
  onClientCancelHook: PropTypes.func,
  onClientErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
};

SignupForm.defaultProps = {
  disabled: false,
  errors: null,
  onBeforeHook: () => {},
  onClientCancelHook: () => {},
  onClientErrorHook: () => {},
  onSuccessHook: () => {},
};

export default SignupForm;
