// Lines inserted with the jelly cli, edit freely
const Session = require('./app/models/sessionModel')
const User = require('./app/models/userModel')
const auth = jelly.auth
const sessionController = jelly.sessionController(User, Session)
const userController = jelly.userController(User)
