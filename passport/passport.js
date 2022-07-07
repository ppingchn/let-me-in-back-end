const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID:"732724610253-uh51lphhkvujfovqcnad8msjip31mnig.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"http://localhost:4000/auth/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));
