const _ = require("lodash");
const jwt = require('jsonwebtoken');
const {
  APP_SECRET,
  getUserId,
  includeNestedUserAttributes
} = require('../../../util');

const login = async (parent, args, context) => {
  const user = await context.prisma.user.create({
    data: {
      ...args,
      score: 0
    }
  })
  const token = jwt.sign({
    userId: user.id
  }, APP_SECRET)

  return {
    token,
    user,
  }
}

const updateUser = async (parent, args, context) => {
  const enrichedData = _.assign({}, args.name && {
    name: args.name
  }, args.score && {
    score: args.score
  });
  return await context.prisma.user.update({
    where: {
      id: getUserId(context),
    },
    data: enrichedData,
    include: includeNestedUserAttributes()
  });
}

const deleteUser = async (parent, args, context) => {
  const deletedUser = await context.prisma.user.delete({
    where: {
      id: args.id,
    },
    include: includeNestedUserAttributes()
  });
  return deletedUser;
}

module.exports = {
  login,
  updateUser,
  deleteUser
}