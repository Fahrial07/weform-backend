import mongoose from 'mongoose'
import Form from '../models/Form.js'


class FormController {
    async index(req, res) { 
        try {

            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1

            const form = await Form.paginate({ userId: req.jwt.id }, 
                                                { limit: limit, page: page })

            if (!form) { 
                throw {
                    status: 404,
                    message: 'Forms not found'
                }
            }

            res.status(200)
                .json({
                    status: true,
                    message: 'Forms found',
                    total: form.length,
                    form
            })

        } catch (error) {
            res.status(error.status || 500)
                .json({ status: false, message: error.message })
        }
    }

    async store(req, res) { 
        try {
            const form = await Form.create({
                userId: req.jwt.id,
                title: 'Untitled Form',
                description: null,
                public: true
            });

            if (!form) {
                throw {
                    status: 500,
                    message: 'Error creating form'
                }
            }

            res.status(200)
                .json({
                    status: true,
                    message: 'Form created successfully',
                    form
                })

        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }

    async show(req, res) { 
        try {
            if (!req.params.id) {
                throw {
                    code: 404,
                    message: 'Required user id'
                }
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {
                status: 400,
                message: 'Invalid form id'
                }
            }
                
            const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id })

            if (!form) { 
                throw {
                    status: 404,
                    message: 'Form not found'
                }
            }

            res.status(200)
                .json({
                    status: true,
                    message: 'Form found',
                    form
            })

        } catch (error) {
            res.status(error.status || 500)
                .json({ status: false, message: error.message })
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
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {
                status: 400,
                message: 'Invalid id'
                }
            }
                
            const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, req.body, {
                new: true
            })

            if (!form) { 
                throw {
                    status: 404,
                    message: 'Form  update failed'
                }
            }

            res.status(200)
                .json({
                    status: true,
                    message: 'Form updated successfully !',
                    form
            })

        } catch (error) {
            res.status(error.status || 500)
                .json({ status: false, message: error.message })
        }
    }

    async destroy(req, res) { 
        try {
            if (!req.params.id) {
                throw {
                    code: 404,
                    message: 'Required form id'
                }
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw {
                status: 400,
                message: 'Invalid id'
                }
            }
                
            const form = await Form.findOneAndDelete({ _id: req.params.id, userId: req.jwt.id })

            if (!form) { 
                throw {
                    status: 404,
                    message: 'Form  delete failed'
                }
            }

            res.status(200)
                .json({
                    status: true,
                    message: 'Form delete successfully !',
                    form
            })

        } catch (error) {
            res.status(error.status || 500)
                .json({ status: false, message: error.message })
        }
    }

    


}

export default new FormController()

