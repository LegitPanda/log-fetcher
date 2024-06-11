"use client";
import { useState } from "react";

export default function Home() {
	const [logs, setLogs] = useState([]);
	const [error, setError] = useState("");

	const fetchLogs = async (file: string, lines?: number, search?: string) => {
		const response = await fetch(
			`log/${file}?lines=${lines || 100}&search=${search}`,
		);

		const data = await response.json();
		console.log({ data });
		if (response.ok) {
			setLogs(data);
			setError("");
		} else {
			setError(data?.error?.message ?? "Error");
			setLogs([]);
		}
	};

	console.log({ logs });
	return (
		<main className="container">
			<h1>Log fetcher</h1>
			<b>
				<div>Fetch logs from /var/log</div>
			</b>
			<form
				onSubmit={(e: any) => {
					e.preventDefault();
					fetchLogs(
						e.target?.file?.value,
						e.target?.lines?.value,
						e.target?.search?.value,
					);
				}}
				aria-invalid={error !== ""}
			>
				<fieldset className="grid">
					<label>
						<p>File name</p>
						<input name="file" id="file" />
					</label>
					<label>
						<p>Lines to fetch</p>
						<input name="lines" id="lines" />
					</label>
					<label>
						<p>Must have keyword:</p>
						<input name="search" />
					</label>
					<button type="submit">Search</button>
				</fieldset>
			</form>
			<small>{error}</small>
			{logs.length > 0 && (
				<code>
					{logs.map((log, i) => (
						<div key={`log-${i}`}>{log}</div>
					))}
				</code>
			)}
			{logs.length === 0 && <div>Log is empty!</div>}
		</main>
	);
}
