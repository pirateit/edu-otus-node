import Route from './models/route.js';

export default (io, socket) => {
  const newRoute = async (location) => {
    const userRoute = await Route.findOne({ userSocketId: socket.id });

    if (userRoute) {
      console.log('Socket ID duplicate found');
    } else {
      await Route.create({ userSocketId: socket.id, routePoints: [{ locationData: location }] });
    }
  };
  const routeMove = async (location) => {
    const userRoute = await Route.findOne({ userSocketId: socket.id });

    userRoute.routePoints.push({ locationData: location });

    await userRoute.save();
  };
  const getLastRoute = async () => {
    const userRoute = await Route.findOne({ userSocketId: socket.id });

    socket.emit('route:my', userRoute);
  };

  socket.on('route:start', newRoute);
  socket.on('route:move', routeMove);
  socket.on('route:get', getLastRoute);
}
