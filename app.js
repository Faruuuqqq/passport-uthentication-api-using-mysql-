const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcryptjs');

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findByEmail(email);
                if (!user) return done(null, false, { message: 'User not found' });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, { message: 'Incorrect password' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);    
});

passport.deserializeUser(async (id, done) => {
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, user[0]);
    } catch (err) {
        done(err);
    }
});