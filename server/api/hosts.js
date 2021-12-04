const router = require('express').Router();
const { models: { Host } } = require('../db');

// require token file -> import to all of routes

// all users sorted by host and guest
router.get('/', async (req, res, next) => {
    try {
        const hosts = await Host.findAll({
            attributes: ['firstName', 'lastName', 'email']
        });
        res.send(hosts);
    } catch (error) {
        next(error);
    }

    router.post('/', async (req, res, next) => {
        try {
            const newHost = await Host.create(req.body);
            res.status(200).json(newHost);
        } catch (error) {
            next(error);
        }
    });

    router.route('/:id')
        .get(async (req, res, next) => {
            try {
                const user = await User.findByPk(req.params.id);
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(400);
                }
            } catch (error) {
                next(error);
            }
        })
        .delete(async (req, res, next) => {
            try {
                const user = await User.findByPk(req.params.id);
                if (user) {
                    await user.destroy();
                    res.sendStatus(202);
                } else {
                    res.sendStatus(400);
                }
            } catch (error) {
                next(error);
            }
        })
        .put(async (req, res, next) => {
            try {
                const { firstName, lastName, email } = req.body
                const update = { firstName, lastName, email }
                const user = await User.findByPk(req.params.id)

                if (user) {
                    await user.update(update)
                    const newUser = await User.findOne({
                        where: { id: req.params.id },
                        attributes: ["id", "firstName", "lastName", "email", "type"]
                    })
                    res.send(newUser)
                } else {
                    res.sendStatus(404)
                }
            } catch (error) {
                next(error)
            }
        });
})
