const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'
const _ = require('lodash')

const getUserId = (context) => {
  const authorization = context.request.get('Authorization');
  if (authorization && !_.isEmpty(retrieveUserToken(authorization))) {
    const token = retrieveUserToken(authorization);
    const {
      userId
    } = jwt.verify(token, APP_SECRET);
    return userId;
  }
  throw new Error('User is not authenticated');
}

const retrieveUserToken = (authorization) =>
  _.chain(authorization).replace('Bearer', '').trim().value();

module.exports = {
  getUserId,
  APP_SECRET
}