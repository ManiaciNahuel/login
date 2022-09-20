const getRandom = (cant) => {
	let maxNums = 100000000;
	const resultObj = {};
	const cantNum = cant || maxNums;
	for (let i = 0; i < cantNum; i++) {
		const new_random = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
		const repetido = Object.keys(resultObj).includes(`${new_random}`);
		if (repetido) {
			resultObj[`${new_random}`] ++;
		} else {
			resultObj[`${new_random}`] = 1;
		}
	}
	return resultObj;
};


process.on("message", (msg) => {
	if (msg.msg === "start") {
		process.send(getRandom(msg.cant));
		process.exit();
	} else {
		process.send({ msg: "No se ha iniciado el calculo" });
		process.exit();
	}
});

module.exports = getRandom;
