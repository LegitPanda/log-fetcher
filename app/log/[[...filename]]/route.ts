import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

const CHUNK_SIZE = 100;
const REQUESTED_LINES = 100;
const BASE_DIR = "/var/log";

export async function GET(request: NextRequest) {
	const { searchParams, pathname } = new URL(request.url);

	const logPath = path.join(BASE_DIR, pathname.replace("/log", ""));
	const fsStat = fs.statSync(logPath);

	// console.log({ logName: logPath, searchParams });
	const contents = [""];

	let start = fsStat.size - 1 - CHUNK_SIZE;
	let end = fsStat.size - 1;

	const startTime = new Date();
	// get one extra line than requested, explained later
	while (contents.length <= REQUESTED_LINES && start >= 0) {
		try {
			const fileStream = fs.createReadStream(logPath, { start, end });

			let readLines = [];

			for await (const chunk of fileStream) {
				readLines.push(chunk.toString());
			}

			readLines = readLines.join("").split("\n");

			// append contents last line with last line read
			contents[contents.length - 1] =
				`${readLines[readLines.length - 1]}${contents[contents.length - 1]}`;

			// add the lines read in reverse order, skipping the one we just appended
			for (let i = readLines.length - 2; i >= 0; i--) {
				contents.push(readLines[i]);
			}
		} catch (error) {
			return Response.json(error);
		}
		start -= CHUNK_SIZE + 1; // + 1 because start and end are inclusive
		end -= CHUNK_SIZE + 1;
	}

	// if we have one too many lines, we toss it because it's incomplete
	if (contents.length > REQUESTED_LINES) {
		contents.pop();
	}

	const endTime = new Date();

	console.log(`Finished reading file in ${endTime.getTime() - startTime.getTime()} ms`)

	return Response.json(contents);
}
