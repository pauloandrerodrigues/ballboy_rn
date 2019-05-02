import { Text } from 'react-native';
import Config from 'react-native-config';
import './I18n/I18n';


if (typeof global.self === 'undefined') {
  // needed for apollo client
  global.self = global;
}

// Allow/disallow font-scaling in app
// Text.defaultProps.allowFontScaling = true;
Text.allowFontScaling = true;

const settings = {
  seedorfRestUrl: Config.SEEDORF_REST_URL,
  seedorfGraphQLUrl: Config.SEEDORF_GRAPHQL_URL,
  seedorfChatkitUrl: Config.SEEDORF_CHATKIT_URL,
  chatkitInstanceLocator: Config.CHATKIT_INSTANCE_LOCATOR,
  useFixtures: Config.USE_FIXTURES === 'YES', // DISABLED FOR NOW DUE TO BUG
  deeplinkHost: Config.DEEPLINK_HOST,
  testBuild: Config.TEST_BUILD === 'YES',
  testHostUrl: Config.TEST_HOST_URL,
  logRoute: false,
  logGraphQLQueries: false,
};

if (settings.testBuild) {
  console.disableYellowBox = true;
}

export const log = [];

if (__DEV__) {
  // If ReactNative's yellow box warnings are too much, it is possible to turn
  // it off, but the healthier approach is to fix the warnings.  =)
  // console.disableYellowBox = false;
}

const bootTime = new Date();
const oldConsoleLog = console.log;
console.log = (...args) => {
  oldConsoleLog(...args);
  log.push({ logTime: (new Date() - bootTime) / 1000, ...args });
};


if (Config.ENVIRONMENT === 'TOM') {
  /* Fast overrides for Tom :) */

  settings.seedorfRestUrl = 'https://api.sportyspots.com/api';
  // settings.seedorfRestUrl = 'https://tom-dev.ngrok.io/api';
  settings.seedorfGraphQLUrl = 'https://api.sportyspots.com/graphql';
  // settings.seedorfGraphQLUrl = 'https://tom-dev.ngrok.io/graphql';
  // settings.seedorfRestUrl = 'https://training.sportyspots.com/api';
  // settings.seedorfGraphQLUrl = 'https://training.sportyspots.com/graphql';
  // settings.seedorfRestUrl = 'http://10.0.2.2:8000/api';
  // settings.seedorfGraphQLUrl = 'http://10.0.2.2:8000/graphql';
  // settings.testHostUrl = 'ws://10.0.2.2:8020';

  // settings.seedorfRestUrl = 'http://localhost:8000/api';
  // settings.seedorfGraphQLUrl = 'http://localhost:8000/graphql';
  // settings.testHostUrl = 'ws://localhost:8020';
  // settings.logRoute = true;
  // settings.logGraphQLQueries = true;
  settings.testBuild = false;
}

console.log('settings', settings);

export default settings;
