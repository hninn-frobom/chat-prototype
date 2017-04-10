/**
 * UsermessagesController
 *
 * @description :: Server-side logic for managing usermessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	createMessage: function(req, res){
		var message = {
          name: req.session.userName,
		  message: req.param('message')
		};
		Usermessages.create(message).exec(function(err, usermessages){
			if(err){
				return res.serverError(err);
			} else {
				sails.sockets.broadcast("usermessages", "createMessage", usermessages);
				res.json(usermessages);
			}
		});
	},

	getMessages: function(req, res){
		Usermessages.find().exec(function(err, usermessages) {
			res.view('chat', {layout: null, usermessages: usermessages});
		});
	},

	joinSocket: function(req, res) {
		sails.sockets.join(req, "usermessages");
	},

	deleteMessage: function(req, res){
		Usermessages.findOne(req.param('usermessage_id')).exec(function(error,usermessages){
			if(error){
				return res.serverError(err);
			}
			if(usermessages.name === req.session.userName){
				Usermessages.destroy(usermessages.id).exec(function(error){
				if(error){
					return res.serverError(err);
				}else {
					res.redirect('/getMessages');
					}
				});
			} else {
				res.redirect('/login');
			}
		});
	}
}