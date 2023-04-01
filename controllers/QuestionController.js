import mongoose from 'mongoose'
import Form from '../models/Form.js'

const allowedTypes = ['Text', 'Radio', 'Checkbox', 'Dropdown', 'Email'];

class QuestionController {

    async store(req, res) { 
        try {
            if (!req.params.id) {
                throw {
                    code: 404,
                    message: 'Required form id'
                }
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw {
                    status: 400,
                    message: 'Invalid form id'
                }
            } 

            const newQuestion = {
                id: new mongoose.Types.ObjectId(),
                question: null,
                type: 'Text',
                required: false,
                options: [],
            }

            //update form
            const form = await Form.findOneAndUpdate({
                    _id: req.params.id,
                    userId: req.jwt.id
                }, {
                    $push: { questions: newQuestion }
                }, {
                    new: true
            })
            if (!form) {
                throw {
                    status: 400,
                    message: 'Form failed update'
                }
            }
            res.status(200)
                .json({
                    status: true,
                    message: 'Add question successfully',
                    question: newQuestion
                })

        } catch (error) {
            res.status(error.code || 500).json({
                status: false,
                message: error.message
            })
        }
    }

    async update(req, res) {
        try {
             if (!req.params.id) {
                throw {
                    code: 404,
                    message: 'Required form id'
                }
            }
             if (!req.params.questionId) {
                throw {
                    code: 404,
                    message: 'Required question id'
                }
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw {
                    status: 400,
                    message: 'Invalid id'
                }
            } 
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
                throw {
                    status: 400,
                    message: 'Invalid id'
                }
            } 

            let field = {}
            if (req.body.hasOwnProperty('question')) { 
                field['questions.$[indexQuestion].question'] = req.body.question
            } else if (req.body.hasOwnProperty('required')) {
                field['questions.$[indexQuestion].required'] = req.body.required
            } else if (req.body.hasOwnProperty('type')) {

                if (!allowedTypes.includes(req.body.type)) { 
                    throw {
                        status: 400,
                        message: 'Invalid question type'
                    }
                }
                field['questions.$[indexQuestion].type'] = req.body.type
            }

            const question = await Form.findOneAndUpdate(
                                    {
                                        _id: req.params.id, userId: req.jwt.id
                                    },
                                    {
                                        $set: field
                                    },
                                    {
                                        arrayFilters: [{
                                            'indexQuestion.id': new mongoose.Types.ObjectId(req.params.questionId)
                                        }], new: true
                                    }
            )

            if (!question) { 
                throw {
                    status: 404,
                    message: 'Question update failed'
                }
            }

            res.status(200).json({
                status: true,
                message: 'Question updated successfully !',
                question
            })
                            
        } catch (error) {
            res.status(error.code || 500).json({
                status: false,
                message: error.message
            })
        }
     }

}

export default new QuestionController()