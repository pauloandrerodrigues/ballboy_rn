import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorHandling from 'error-handling-utils';
import isEmail from 'validator/lib/isEmail';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import I18n from '../../../I18n';
import Colors from '../../../Themes/Colors';
import Block from '../../Common/Block';
import Text from '../../Common/Text';
import LinkOpenURL from '../../Common/LinkOpenURL';
import TextField from '../../Common/TextField';
import RaisedButton from '../../Common/RaisedButton';

//------------------------------------------------------------------------------
// CONSTANTS:
//------------------------------------------------------------------------------
const MAX_CHARS = 120;

const INIT_STATE = {
  firstName: '',
  lastName: '',
  email: '',
};

const INIT_ERRORS = {
  firstName: [],
  lastName: [],
  email: [],
};
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class SignupEmailForm extends React.PureComponent {
  state = {
    ...cloneDeep(INIT_STATE),
    errors: cloneDeep(INIT_ERRORS),
    // Keep track of field position in order to 'scroll to' on error
    offsetY: Object.keys(INIT_ERRORS).reduce((output, key) => (
      Object.assign({}, output, { [key]: 0 })
    ), {}),
  }

  componentWillReceiveProps({ errors }) {
    // Display (server side) errors coming from parent component
    if (errors) {
      this.setState({
        errors: {
          ...cloneDeep(INIT_ERRORS),
          ...errors,
        },
      });
    }
  }

  clearErrors = () => {
    this.setState({ errors: cloneDeep(INIT_ERRORS) });
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

  validateFields = ({ firstName, lastName, email }) => {
    // Initialize errors
    const errors = cloneDeep(INIT_ERRORS);

    // Sanitize input
    const _firstName = firstName && firstName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_firstName) {
      errors.firstName.push('signupEmailForm.fields.firstName.errors.required');
    } else if (_firstName.length > MAX_CHARS) {
      errors.firstName.push('signupEmailForm.fields.firstName.errors.tooLong');
    }

    // Sanitize input
    const _lastName = lastName && lastName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_lastName) {
      errors.lastName.push('signupEmailForm.fields.lastName.errors.required');
    } else if (_lastName.length > MAX_CHARS) {
      errors.lastName.push('signupEmailForm.fields.lastName.errors.tooLong');
    }

    // Sanitize input
    const _email = email && email.trim(); // eslint-disable-line no-underscore-dangle

    if (!_email) {
      errors.email.push('signupEmailForm.fields.email.errors.required');
    } else if (!isEmail(_email)) {
      errors.email.push('signupEmailForm.fields.email.errors.invalid');
    } else if (_email.length > MAX_CHARS) {
      errors.email.push('signupEmailForm.fields.email.errors.tooLong');
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

    // Clear previous errors if any
    this.clearErrors();

    // Validate fields
    const errors = this.validateFields(this.state);

    // In case of errors, display on UI and return handler to parent component
    if (ErrorHandling.hasErrors(errors)) {
      this.setState({ errors });
      // Scroll to first error field
      const { offsetY } = this.state;
      const firstErrorKey = ErrorHandling.getFirstError(errors).key; // 'firstName', 'lastName', ...
      const y = parseInt(offsetY[firstErrorKey], 10);
      if (this.scroller) {
        this.scroller.scrollTo({ x: 0, y });
      }
      // Pass event up to parent component. onClientErrorHook will set 'disabled'
      // value back to 'false' so that the user can re-submit the form
      onClientErrorHook();
      return;
    }

    // Pass event up to parent component
    onSuccessHook(pick(this.state, Object.keys(INIT_STATE)));
  }

  render() {
    const { disabled } = this.props;
    const {
      firstName,
      lastName,
      email,
      errors,
    } = this.state;

    // Apply translation and concatenate field errors (string)
    const firstNameErrors = ErrorHandling.getFieldErrors(errors, 'firstName', I18n.t);
    const lastNameErrors = ErrorHandling.getFieldErrors(errors, 'lastName', I18n.t);
    const emailErrors = ErrorHandling.getFieldErrors(errors, 'email', I18n.t);

    return (
      <KeyboardAwareScrollView
        extraHeight={70}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          ref={(scroller) => { this.scroller = scroller; }}
          testID="signupScrollView"
          keyboardShouldPersistTaps="handled"
        >
          <Block
            midHeight
            onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'firstName', nativeEvent }); }}
          >
            <TextField
              testID="signupFieldFirstName"
              label={I18n.t('signupEmailForm.fields.firstName.label')}
              placeholder={I18n.t('signupEmailForm.fields.firstName.placeholder')}
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
              label={I18n.t('signupEmailForm.fields.lastName.label')}
              placeholder={I18n.t('signupEmailForm.fields.lastName.placeholder')}
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
              label={I18n.t('signupEmailForm.fields.email.label')}
              placeholder={I18n.t('signupEmailForm.fields.email.placeholder')}
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
          <Block>
            <Text.M style={{ color: Colors.black }}>
              {I18n.t('signupEmailForm.terms.prefix')}
            </Text.M>
            <LinkOpenURL
              text={I18n.t('signupEmailForm.terms.link')}
              href="https://www.sportyspots.com/terms.html"
              color={Colors.actionYellow}
              underline
            />
          </Block>
          <Block>
            <RaisedButton
              testID="signupButtonSubmit"
              variant="info"
              label={I18n.t('signupEmailForm.btnLabel')}
              disabled={disabled}
              onPress={this.handleSubmit}
            />
          </Block>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

SignupEmailForm.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object, // eslint-disable-line
  onBeforeHook: PropTypes.func,
  onClientCancelHook: PropTypes.func,
  onClientErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
};

SignupEmailForm.defaultProps = {
  disabled: false,
  errors: null,
  onBeforeHook: () => {},
  onClientCancelHook: () => {},
  onClientErrorHook: () => {},
  onSuccessHook: () => {},
};

export default SignupEmailForm;
