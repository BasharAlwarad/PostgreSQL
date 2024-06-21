import {Router} from 'express'
import {login} from '../../controllers/authControllers/authControllers.js'

const authRouter = Router()

authRouter.route(`/`).get(login)

export default authRouter