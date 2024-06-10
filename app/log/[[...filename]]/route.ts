import { LogService } from "@/service/LogService";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, pathname } = new URL(request.url);

	const linesParam = searchParams.get("lines") ?? 10;
	let lines: number;
	try {
		//@ts-expect-error default value does not need to be parsed as string
		lines = Number.parseInt(linesParam || 100);
	} catch {
		throw new Error(`query parameter lines '${linesParam}' is not a number`);
	}

	const search = searchParams.get("search") ?? undefined;

	try {
		const contents = await new LogService().getLog(pathname, lines, search);
		return Response.json(contents);
	} catch (error) {
		console.log({ error });
		return Response.json(
			{ error: { message: error?.message, stack: error?.stack } },
			{ status: 400 },
		);
	}
}
