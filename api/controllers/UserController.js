/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var users = new Array();

module.exports = {
	create: function(req, res){

		var user = {
          name: req.param('name'),
		  email: req.param('email'),
		  password : req.param('password')
		};
		User.create(user).exec(function(err, user){
			if(err){
				return res.serverError(err);
			} else {
				//res.redirect('/getUsers');
				//console.log("returned user " + JSON.stringify(user));
				//sails.sockets.broadcast("room-name", "create", user, req);
				sails.sockets.broadcast("user", "create", user);
				res.json(user);
			}

		});
	},

	getUsers: function(req, res){

		User.find().exec(function(err, users) {
			res.view('register-success', {layout: null, users: users});
		});
	},

	edit: function(req, res){
		var id = req.param('user_id');
		User.findOne(id).exec(function(err, user){
			
			res.view('edit',{user: user});
		});
	},

	editSave: function(req, res){
		User.findOne(req.param('user_id')).exec(function(error,user){
			if(error){
				return res.serverError(err);
			}
			user.name = req.param('name');
			user.email = req.param('email');
			user.save(function(error){
				if(error){

				}else {
					res.redirect('/getUsers');
				}
			});
		});
	},

	deleteUser: function(req, res){

		User.destroy(req.param('user_id')).exec(function(error){
			if(error){
				return res.serverError(err);
			}else {
				res.redirect('/getUsers');
			}
		});
	},

	joinSocket: function(req, res) {
		console.log("join socket!");
		sails.sockets.join(req, "user");
	},

	getLoginUsers: function(){
		var loginUsers =users;
		return loginUsers;
	},

	loginUser: function(req, res){
		var name = req.param('name');
		var password = req.param('password');
		User.findOne({name : name}).exec(function(err, user){
			if(err){
				return res.serverError(err);
			}
			if(user.password === password){
				req.session.user = user;
				users[users.length] = user;
				sails.sockets.broadcast("usermessages", "getloginUsers", req.session.user.name);
				res.redirect('/getMessages')
			}else {
				res.redirect('/login');
			}
		});
	}
	
};

