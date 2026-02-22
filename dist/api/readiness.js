export function handlerReadiness(req, res) {
    return res.status(200).type("text/plain; charset=utf-8").send("OK");
}
