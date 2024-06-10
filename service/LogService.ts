import fs from "node:fs";
import path from "node:path";

const DEFAULT_CHUNK_SIZE = 16384; // 16 kB
const DEFAULT_BASE_DIR = "/var/log";

type LogServiceOptions = {
	chunkSize: number;
	baseDir: string;
};

export class LogService {
	private readonly options: LogServiceOptions;

	constructor(options?: Partial<LogServiceOptions>) {
		this.options = {
			chunkSize: DEFAULT_CHUNK_SIZE,
			baseDir: DEFAULT_BASE_DIR,
			...options,
		};
	}

	public async getLog(pathname: string, requestedLines: number) {
		const logPath = path.join(
			this.options.baseDir,
			pathname.replace("/log", ""),
		);

		let fsStat: fs.Stats;
		try {
			fsStat = fs.statSync(logPath);
		} catch (error) {
			throw new Error(`Error reading file ${logPath}: ${error?.message!}`);
		}
		// console.log({ logName: logPath, searchParams });
		const contents = [""];

		let start = Math.max(fsStat.size - 1 - this.options.chunkSize, 0);
		let end = fsStat.size - 1;

		const startTime = new Date();

		let done = false;

		// get one extra line than requested, since we need to know where to "end"
		// the extra line in this case is most likely incomplete if the chunk size is small
		while (contents.length <= requestedLines && !done) {
			if (start === 0) {
				done = true;
			}
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
				throw new Error(`Error while reading file stream: ${error?.message!}`);
			}

			start = Math.max(start - this.options.chunkSize - 1, 0); // - 1 because start and end are inclusive
			end = Math.max(end - this.options.chunkSize - 1, 0);
		}

		// get rid of extra lines, we can have multiple extras if chunk is too big
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
