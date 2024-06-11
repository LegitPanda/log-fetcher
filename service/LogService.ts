import fs from "node:fs";
import path from "node:path";

const DEFAULT_CHUNK_SIZE = 16384; // 16 kB
const DEFAULT_BASE_DIR = "/var/log";
const DEFAULT_LINE_BREAK = "\n";

type LogServiceOptions = {
	chunkSize: number;
	baseDir: string;
	lineBreak: string;
};

export class LogService {
	private readonly options: LogServiceOptions;

	constructor(options?: Partial<LogServiceOptions>) {
		this.options = {
			chunkSize: DEFAULT_CHUNK_SIZE,
			baseDir: DEFAULT_BASE_DIR,
			lineBreak: DEFAULT_LINE_BREAK,
			...options,
		};
	}

	public async getLog(
		pathname: string,
		requestedLines: number,
		searchText?: string,
	) {
		const logPath = path.join(
			this.options.baseDir,
			pathname.replace("/log", ""),
		);

		let fsStat: fs.Stats;
		try {
			fsStat = fs.statSync(logPath);
		} catch (error: any) {
			throw new Error(`Error reading file ${logPath}: ${error?.message}`);
		}

		const contents = [];

		let start = Math.max(fsStat.size - 1 - this.options.chunkSize, 0);
		let end = Math.max(fsStat.size - 1, 0);

		const startTime = new Date();

		let done = false;

		// the staging area for partially read lines
		let incompleteLine = "";

		// get one extra line than requested, since we need to know where to "end"
		// the extra line in this case is most likely incomplete if the chunk size is small
		while (contents.length <= requestedLines && !done) {
			if (start === 0) {
				done = true;
			}
			let readLines = [];
			try {
				const fileStream = fs.createReadStream(logPath, { start, end });

				for await (const chunk of fileStream) {
					readLines.push(chunk.toString());
				}
			} catch (error: any) {
				throw new Error(`Error while reading file stream: ${error?.message}`);
			}

			readLines = readLines.join("").split(this.options.lineBreak);

			// append the previous partial line to the end of our lines we just read
			readLines[readLines.length - 1] =
				`${readLines[readLines.length - 1]}${incompleteLine}`;

			// the beginning of each new chunk is where our partial line is going to be
			incompleteLine = readLines[0];

			// add the lines read in reverse order, skipping the first one which is the incomplete line
			for (let i = readLines.length - 1; i > 0; i--) {
				// skip first empty line
				if (contents.length === 0 && readLines[i] === "") {
					continue;
				}

				if (searchText && readLines[i].includes(searchText)) {
					contents.push(readLines[i]);
				} else if (!searchText) {
					contents.push(readLines[i]);
				}
			}

			start = Math.max(start - this.options.chunkSize - 1, 0); // - 1 because start and end are inclusive
			end = Math.max(end - this.options.chunkSize - 1, 0);
		}

		// if there's not enough results then we must have finished reading through the entire file
		// and should add the last chunk back into the results
		if (contents.length < requestedLines) {
			if (searchText && incompleteLine.includes(searchText) && incompleteLine) {
				contents.push(incompleteLine);
			} else if (!searchText && incompleteLine) {
				contents.push(incompleteLine);
			}
		}

		// get rid of extra lines, we can have multiple extras if chunk is too big
		// also do one more check for searchText, since it is finalized here
		while (contents.length > requestedLines) {
			contents.pop();
		}

		const endTime = new Date();

		console.log(
			`Finished reading ${requestedLines} lines for ${pathname} with chunk size ${this.options.chunkSize} in ${endTime.getTime() - startTime.getTime()} ms`,
		);
		return contents;
	}
}
