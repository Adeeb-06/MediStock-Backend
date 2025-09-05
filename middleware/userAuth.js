export const userAuth = (req, res, next) => {

    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized , No token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id){
            req.body.userId = decoded.id;
        } else {
            return res.status(401).json({ message: 'Unauthorized , Invalid token' });
        }
        next();
    } catch (error) {
        console.log('middleware error', error);
        res.status(500).json({ message: 'Internal server error , Middleware failed' });
    }

}