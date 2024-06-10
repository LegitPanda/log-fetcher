import { open } from "node:fs/promises";

export const readLinesReversed = async (
	path: string,
	requestedLines?: number,
) => {
	const startTime = new Date();
	const file = await open(path);
	let lines = [];
	for await (const line of file.readLines()) {
		lines.push(line);
	}
	const endTime = new Date();

	lines = lines.reverse();

	if (requestedLines) {
		lines.length = Math.min(lines.length, requestedLines);
	}
	console.log(
		`[NAIVE] Finished reading ${requestedLines} lines for ${path} in ${endTime.getTime() - startTime.getTime()} ms`,
	);
	return lines;
};
