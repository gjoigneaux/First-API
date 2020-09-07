const sauce = require('../models/sauces');
const fs = require('fs');

exports.viewSauce = (req, res, next) => {
    sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.viewOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauces = new sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: "",
        usersDisliked: ""
    });
    sauces.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauces => {
            const filename = sauces.imageUrl.split('/images/')[1];
            fs.unlink(`public/images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    if (like == 1) {  
        sauce.update({ _id: sauceId },
            {
                $inc: { likes: 1 }, 
                $push: { usersLiked: userId } 
            })
            .then(() => res.status(200).json({ message: 'L\' utilisateur aime la sauce' }))
            .catch(error => res.status(404).json({ error }));
    }
    else if (like == -1) { 
        sauce.update({ _id: sauceId },
            {
                $inc: { dislikes: 1 }, 
                $push: { usersDisliked: userId } 
            })
            .then(() => res.status(200).json({ message: 'L\' utilisateur n\' aime pas la sauce' }))
            .catch(error => res.status(404).json({ error }));
    }
    else { 
        sauce.findOne({ _id: req.params.id })
            .then((sauces) => {
                if (sauces.usersDisliked.find(userId => userId === req.body.userId)) {
                    sauce.update({ _id: sauceId },
                        {
                            $inc: { dislikes: -1 }, 
                            $pull: { usersDisliked: userId } // 
                        })
                        .then(() => { res.status(200).json({ message: 'L\' utilisateur n\' aimais pas la sauce et il a changer d\' avis' }); })
                        .catch(error => res.status(404).json({ error }));
                }
                else {
                    sauce.update({ _id: sauceId },
                        {
                            $inc: { likes: -1 }, 
                            $pull: { usersLiked: userId } 
                        })
                        .then(() => res.status(200).json({ message: 'L\' utilisateur aimais la sauce et il a changer d\' avis' }))
                        .catch(error => res.status(404).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    };
};