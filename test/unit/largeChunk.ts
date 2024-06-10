import { LogService } from "@/service/LogService";
import assert from "node:assert";
import { readLinesReversed } from "../readLinesReversed";

const logService = new LogService({
	baseDir: `${__dirname}/../resources`,
	chunkSize: 1000000,
});

(async () => {
	console.log(`Running test: ${__filename}...`);

	assert.deepEqual(
		await logService.getLog("small.log", 100),
		await readLinesReversed(`${__dirname}/../resources/small.log`),
	);

	assert.deepEqual(
		await logService.getLog("large.log", 1),
		await readLinesReversed(`${__dirname}/../resources/large.log`, 1),
	);

    assert.deepEqual(
		await logService.getLog("veryLarge.log", 1),
		await readLinesReversed(`${__dirname}/../resources/veryLarge.log`, 1),
	);
})();
