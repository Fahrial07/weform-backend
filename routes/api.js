import express from 'express'
import AuthController from '../controllers/AuthController.js'
import FormController from '../controllers/FormController.js'
import QuestionController from '../controllers/QuestionController.js'
import OptionController from '../controllers/OptionController.js'
import jwtAuth from '../middlewares/jwtAuth.js'

const router = express.Router();

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh-token', jwtAuth(), AuthController.refreshToken)

//form
router.get('/forms', jwtAuth(), FormController.index)
router.post('/forms', jwtAuth(), FormController.store)
router.get('/forms/:id', jwtAuth(), FormController.show)
router.put('/forms/:id', jwtAuth(), FormController.update)
router.delete('/forms/:id', jwtAuth(), FormController.destroy)

//questions
router.get('/forms/:id/questions', jwtAuth(), QuestionController.index)
router.post('/forms/:id/questions', jwtAuth(), QuestionController.store)
router.put('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.update)
router.delete('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.destroy)

//options
// router.get('/forms/:id/questions', jwtAuth(), FormController.index)
router.post('/forms/:id/questions/:questionId/options', jwtAuth(), OptionController.store)
// router.put('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.update)
// router.delete('/forms/:id', jwtAuth(), FormController.destroy)

export default router;