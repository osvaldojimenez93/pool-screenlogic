export function escapeHtml(value: string | number | boolean | undefined): string {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export function metric(label: string, value: string, detail = ""): string {
	return `
		<div class="metric">
			<span>${escapeHtml(label)}</span>
			<strong>${escapeHtml(value)}</strong>
			${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
		</div>
	`;
}

export function formatTemperature(value: number | undefined, degC: boolean | undefined): string {
	return typeof value === "number" ? `${value}${degC ? "C" : "F"}` : "--";
}

export function fileResponse(path: string, contentType: string): Response {
	return new Response(Bun.file(path), {
		headers: { "content-type": contentType },
	});
}

export function htmlResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
}
