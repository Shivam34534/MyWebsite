export const validateRequest = (schema) => (req, res, next) => {
    try {
        // Parse the request body using Zod
        schema.parse(req.body);
        next();
    } catch (error) {
        // Map the Zod error format into a clean array of readable error messages
        const errors = error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
        }));

        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }
};
