const _ = require("lodash");
const {
  getUserId,
  isPlayerNew,
  hasPlayerCompletedRound,
  updateRoomOnNewRound,
  updateRoomOnPlayerExit,
  includeNestedRoomAttributes,
} = require('../../../util');

const createRoom = async (parent, args, context) => {
  const userId = getUserId(context);
  const enrichedData = _.assign({}, {
      round: 0,
      roundLimit: args.roundLimit,
      host: {
        connect: {
          id: userId
        }
      },
      players: {
        connect: {
          id: userId
        }
      }
    },
    args.language && {
      language: {
        connect: {
          name: args.language.name
        }
      }
    })

  return await context.prisma.room.create({
    data: enrichedData,
    include: includeNestedRoomAttributes()
  });
}


const updateRoom = async (parent, args, context) => {
  const userId = getUserId(context);
  const room = await context.prisma.room.findOne({
    where: {
      id: args.id
    },
    include: includeNestedRoomAttributes()
  });
  const movies = await context.prisma.movie.findMany(room.languageId && {
    where: {
      languageId: room.languageId,
    },
  });

  const preEnrichedData = _.assign({},
    isPlayerNew(userId, room) && {
      players: {
        connect: {
          id: userId
        }
      }
    },
    hasPlayerCompletedRound(args.hasCompletedRound, userId, room) && {
      roundCompleted: {
        connect: {
          id: userId
        }
      }
    },
    updateRoomOnPlayerExit(room, userId, args.hasPlayerLeft)
  )

  let updatedRoomData;

  if (!_.isEmpty(preEnrichedData))
    updatedRoomData = await context.prisma.room.update({
      where: {
        id: args.id,
      },
      data: preEnrichedData,
      include: includeNestedRoomAttributes()
    })

  updatedRoomData = await context.prisma.room.update({
    where: {
      id: args.id,
    },
    data: updateRoomOnNewRound(updatedRoomData ?? room, movies, args.isGameReady),
    include: includeNestedRoomAttributes()
  })

  return updatedRoomData;
}

module.exports = {
  createRoom,
  updateRoom
}