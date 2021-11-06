
exports.validateTemperature = async (req, res) => {
    try {
        if (req.body.hasOwnProperty('temp')) {
            if (req.body.temp < 100) {
                res.status(200).send("Temperature OK");
            } else {
                res.status(200).send("Too hot");
            }
        } else {
            res.status(200).send("Temp missing!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};