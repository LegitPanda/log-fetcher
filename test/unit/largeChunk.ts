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

	assert.deepEqual(
		await logService.getLog("large.log", 5, "0000000000000000"),
		[
			"Jun 10 01:17:25 DESKTOP-QEHGMK8 kernel: [ 3730.149264] FS:  00007f423fdc6880 GS:  0000000000000000",
			"Jun 10 01:17:25 DESKTOP-QEHGMK8 kernel: [ 3730.149260] R10: 00000000ffffffff R11: 0000000000000293 R12: 0000000000000000",
			"Jun 10 01:17:25 DESKTOP-QEHGMK8 kernel: [ 3730.149258] RBP: 00007fff0655aa20 R08: 0000000000000000 R09: 0000000000000008",
			"Jun 10 01:17:25 DESKTOP-QEHGMK8 kernel: [ 3730.149256] FS:  00007f6e4d0b8740 GS:  0000000000000000",
			"Jun 10 01:17:25 DESKTOP-QEHGMK8 kernel: [ 3730.149251] RAX: fffffffffffffffc RBX: 0000000000000000 RCX: 00007f423fef0b68",
		],
	);

	assert.deepEqual(
		await logService.getLog("spaces.log", 5),
		await readLinesReversed(`${__dirname}/../resources/spaces.log`, 5),
	);

	assert.deepEqual(
		await logService.getLog("spaces.log", 100),
		await readLinesReversed(`${__dirname}/../resources/spaces.log`, 8),
	);

	assert.deepEqual(await logService.getLog("empty.log", 100), []);
})();
