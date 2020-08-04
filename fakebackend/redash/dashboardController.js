module.exports = function (app) {
    app.get("/dashboards", function (req, res) {
        res.send({
            data: dashboards
        });
    });
};

const dashboards = [
    {
        name: "inventory-change-tracker",
        uri: "http://40.69.83.250/public/dashboards/OeLpkqJ8fcLgoLq44Ciq59KyohVISWhQhdMfpRW5?org_slug=default",
        description: "This is a dashboard I quickly made so I'd have something to work with"
    }
];
