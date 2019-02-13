import EventEmitter from 'events';
import { Linking } from 'react-native';

export const Events = {
  SOCIAL_LOGIN_NOT_REGISTERED: 'SOCIAL_LOGIN_NOT_REGISTERED',
  LOGIN_TOKEN: 'LOGIN_TOKEN',
  MAGIC_LINK_LOGIN: 'MAGIC_LINK_LOGIN',
};

export const IncomingLinks = new EventEmitter();
IncomingLinks.emitEvent = (event) => {
  IncomingLinks.emit(event.type, ...event.args);
};

const urlParsers = [];

// Social login parser
urlParsers.push(url => (url.search('social_login_not_registered') !== -1
  ? {
    type: Events.SOCIAL_LOGIN_NOT_REGISTERED,
    args: [],
  }
  : null
));

// Magic link login parser
urlParsers.push((url) => {
  if (url.search('magic_link_login') !== -1) {
    const splitURL = url.split('login?token=');
    const token = splitURL[1];
    if (token) {
      return {
        type: Events.MAGIC_LINK_LOGIN,
        args: [token],
      };
    }
    throw new Error('Magic login link received without token.');
  }
  return null;
});

// Login with token parser (result step of OAuth login)
urlParsers.push((url) => {
  const splitURL = url.split('login?token=');
  const token = splitURL[1];
  if (token) {
    return {
      type: Events.LOGIN_TOKEN,
      args: [token],
    };
  }
  throw new Error('Login url received without token.');
});

export const urlToEvent = (url) => {
  for (const parser of urlParsers) {
    const parserResult = parser(url);
    if (parserResult) {
      return parserResult;
    }
  }
  return null;
};

Linking.addEventListener('url', async ({ url }) => {
  const event = urlToEvent(url);
  if (event) {
    IncomingLinks.emitEvent(event);
  }
});
