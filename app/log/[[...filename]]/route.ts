import { LogService } from "@/service/LogService";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, pathname } = new URL(request.url);

	const linesParam = searchParams.get("lines") ?? 100;
	const lines = Number(linesParam);
	if (Number.isNaN(lines)) {
		return Response.json(
			{
				error: {
					message: `query parameter lines '${linesParam}' is not a number`,
				},
			},
			{ status: 400 },
		);
	}

	const search = searchParams.get("search") ?? undefined;

	try {
		const contents = await new LogService().getLog(pathname, lines, search);
		return Response.json(contents);
	} catch (error: any) {
		console.log({ error });
		return Response.json(
			{ error: { message: error?.message, stack: error?.stack } },
			{ status: 400 },
		);
	}
}
