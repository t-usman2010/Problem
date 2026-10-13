const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join:city', (city) => {
      if (city && typeof city === 'string') {
        const room = city.toLowerCase().trim()
        socket.join(room)
      }
    })

    socket.on('leave:city', (city) => {
      if (city && typeof city === 'string') {
        const room = city.toLowerCase().trim()
        socket.leave(room)
      }
    })

    socket.on('disconnect', () => {})
  })
}

const emitIssueEvent = (io, event, payload, city = 'islamabad') => {
  if (!io) return
  if (city) {
    io.to(city.toLowerCase().trim()).emit(event, payload)
  }
  io.emit(event, payload)
}

module.exports = setupSocket
module.exports.emitIssueEvent = emitIssueEvent
