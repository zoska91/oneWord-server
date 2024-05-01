import { UserModel } from '../models/user'

export const getUser = async (authorization) => {
  try {
    if (!authorization) {
      return 401
    }

    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      saveLog('warn', 'GET', 'getUser', 'no token', req.headers.authorization)
      return 401
    }

    const { id: userId } = jwt.verify(token, config.secret)
    const user = await UserModel.find({ id: userId })

    return user
  } catch (e) {
    saveLog('error', 'GET', 'getUser', '', e)
  }
}
