const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user || !req.session.user.role) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const userRole = req.session.user.role;

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden. You do not have access to this resource.' });
        }

        next();
    };
};

const allowRegistration = (req, res, next) => {
    return next(); 
};

module.exports = { checkRole, allowRegistration };
