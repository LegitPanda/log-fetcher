import "./globals.css";
export const metadata = {
	title: "Log fetcher",
	description: "Fetch your logs easily and quickly.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
