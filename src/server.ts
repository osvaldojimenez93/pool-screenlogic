import { fileResponse, htmlResponse } from "./views/helpers";
import { renderError, renderStatus, renderUnits } from "./views/partials";

const port = Number(Bun.env.PORT ?? 3000);
const hostname = Bun.env.HOST ?? "127.0.0.1";

Bun.serve({
	port,
	hostname,
	async fetch(request) {
		const url = new URL(request.url);

		try {
			if (request.method === "GET" && url.pathname === "/") {
				return fileResponse("public/index.html", "text/html; charset=utf-8");
			}

			if (request.method === "GET" && url.pathname === "/htmx.min.js") {
				return fileResponse("public/htmx.min.js", "text/javascript; charset=utf-8");
			}

			if (request.method === "GET" && url.pathname === "/partials/units") {
				return htmlResponse(await renderUnits());
			}

			if (request.method === "GET" && url.pathname === "/partials/status") {
				return htmlResponse(await renderStatus());
			}

			return new Response("Not found", { status: 404 });
		} catch (error) {
			return htmlResponse(renderError(error));
		}
	},
});

console.log(`Pool control running at http://${hostname}:${port}`);
