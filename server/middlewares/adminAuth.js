export const adminGuard = async (req, res, next) => {
    try {
        const { role } = await req.auth();

        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden. Admin Clearance Required.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
