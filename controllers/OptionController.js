import mongoose from 'mongoose'
import Form from '../models/Form.js'

class OptionController 
{
    async store(req, res) 
    {
        try {
            if(!req.params.id) {
                throw {
                    code: 400,
                    message: "Required Form Id"
                }
            }

            if(!req.params.questionId) {
                throw {
                    code: 400,
                    message: 'Required Questions Id'
                }
            }

            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw {
                    code: 400,
                    message: "Invalid Id"
                }
            }

            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
                throw {
                    code: 400,
                    message: "Invalid Id"
                }
            }

            if(!req.body.option) {
                throw {
                    code: 400,
                    message: "Required Option"
                }
            }

            const option = {
                id: new mongoose.Types.ObjectId(),
                option: req.body.option
            }



            const form = await Form.findOneAndUpdate({
                _id: req.params.id, userId: req.jwt.id
                },{
                    $push: {
                                "questions.$[indexQuestion].options": option
                            }
                }, {
                        arrayFilters: [{
                            "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId)
                        }],
                        new: true
                    })

            if (!form) {
                    throw {
                        code: 400,
                        message:"Add option failed"
                    }
                }

            res.status(200)
                .json({
                    status: true,
                    message: "Add option success",
                    option
                })

        } catch (error) {
             res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }
}

export default new OptionController()