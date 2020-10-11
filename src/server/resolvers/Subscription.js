const roomSubscribe = (parent, args, context, info) => {
  return context.pubsub.asyncIterator(args.id)
}

const watchRoom = {
  subscribe: roomSubscribe,
  resolve: payload => payload
}

module.exports = {
  watchRoom
}