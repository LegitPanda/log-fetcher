# Log fetcher
Made with NextJs, this is a simple web server utility to check logs under `/var/log` 
Written with efficiency in mind, this simple tool can quickly access the most recent lines of large logs with little latency by streaming only the parts requested.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 
To view logs, go to http://localhost:3000/log/[log-name]

for example, if the log is located at `/var/log/auth.log` then the address is `http://localhost:3000/log/auth.log`

The output is ordered by most recent/last line appended:

```json
[
    "Jun 10 00:00:02 Event 2",
    "Jun 10 00:00:01 Event 1"
]
```