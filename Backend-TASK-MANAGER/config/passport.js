const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {}
const UserModel = require('./database')
const passport = require('passport')

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'vikasisduniyakapapahe';

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {


    UserModel.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            console.log("error finding user : ", err)
            return done(err, false);
        } if (user) {
            console.log("user find : ", err)
            return done(null, user);
        } else {
            console.log("No user found for this payload : ", err)
            return done(null, false);
            //or you could create a new account
        }
    });
}));