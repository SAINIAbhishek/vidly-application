require('../../../ApiModels');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const AuthsController = require('../../../modules/auth/AuthsController');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { 
      _id: mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };

    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token)
    };

    const res = {};
    const next = jest.fn();
    AuthsController.isAuthorized(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
