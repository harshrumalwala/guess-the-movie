const _ = require("lodash");
const {
  getUserId,
  includeNestedRoomAttributes,
} = require('../../../util');
const {
  updateRoomOnNewRound,
  updateRoomOnPlayerExit,
  updateRoomOnGameRestart,
  updateRoomOnPlayerJoin,
  updateRoomOnPlayerRoundComplete,
  updatePlayerNameOrScore
} = require('./util');

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
    args.languages && {
      languages: {
        connect: _.map(args.languages, l => ({
          name: l.name
        }))

      }
    })

  console.log(enrichedData);

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
  const movies = await context.prisma.movie.findMany(_.size(room.languages) > 0 && {
    where: {
      language: {
        name: {
          in: _.map(room.languages, 'name')
        }
      }
    },
  });

  const preEnrichedData = _.assign({},
    updatePlayerNameOrScore(userId, args.score, args.name),
    updateRoomOnPlayerJoin(room, userId),
    updateRoomOnPlayerRoundComplete(room, userId, args.hasCompletedRound),
    updateRoomOnPlayerExit(room, userId, args.hasPlayerLeft),
    updateRoomOnGameRestart(room, movies, args.isGameRestarted)
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
    data: updateRoomOnNewRound(updatedRoomData ? updatedRoomData : room, movies, args.isGameReady),
    include: includeNestedRoomAttributes()
  })

  context.pubsub.publish(args.id, updatedRoomData);

  return updatedRoomData;
}

const deleteRoom = async (parent, args, context) => {
  const deleteRoom = await context.prisma.room.delete({
    where: {
      id: args.id,
    },
    include: includeNestedRoomAttributes()
  });
  return deleteRoom;
}

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom
}