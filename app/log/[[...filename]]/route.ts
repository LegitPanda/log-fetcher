import { LogService } from "@/service/LogService";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, pathname } = new URL(request.url);

	try {
		const contents = await new LogService().getLog(pathname, 100);
		return Response.json(contents);
	} catch (error) {
		console.log({ error });
		return Response.json(
			{ error: { message: error?.message, stack: error?.stack } },
			{ status: 400 },
		);
	}
}
