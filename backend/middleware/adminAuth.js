const jwt = require('jsonwebtoken')
const db = require('../config/db')

const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization')
    if(!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        const [admin] = await db.query('SELECT * FROM Admin WHERE id = ?', [req.user.id])

        if(admin.length === 0) {
            return res.status(403).json({ message: 'Access denied' })
        }
        next()
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' })
    }
}

module.exports = adminAuth;