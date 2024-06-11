# Log fetcher
Made with NextJs, this is a simple web server utility to check logs under `/var/log` 
Written with efficiency in mind, this simple tool can quickly access the most recent lines of large logs with little latency by streaming only the parts requested.

## Getting Started
First, run `npm i` to install all dependencies

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## UI
The default UI is hosted at http://localhost:3000

## Using the api
Everything uses GET by default

To view a log, the request is `GET /log/[log-name]`


for example, if the log is located at `/var/log/auth.log` then the address is GET `http://localhost:3000/log/auth.log`

The output is ordered by most recent/last line appended:

```json
[
    "Jun 10 00:00:02 Event 2",
    "Jun 10 00:00:01 Event 1"
]
```
## Query parameters
The route also accepts `lines` and `search` query parameters, where `lines` is the maximum number of results to return, and `search` is the specifier to filter out results without it:


```
// event.log:
the cat ate the bat
bat
cat1
```

`http://localhost:3000/log/event.log?lines=5&search=cat`

```json
[
    "cat1",
    "the cat ate the bat"
]
```

## Nesting 
Logs are not always directly under `/var/log`, so the route supports logs in deeper directories:

`http://localhost:3000/log/1/2/3/secret.log`

## Tests
Currently there is no testing framework so the text appears out of order. However, this command will run all unit tests:

`npm run test` 