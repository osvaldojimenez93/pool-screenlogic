import type { HeaterConfig } from "../screenlogic";

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

export function formatHeatStatus(value: number | undefined): string {
	switch (value) {
		case 0:
			return "Off";
		case 1:
			return "Heater";
		case 2:
			return "Cooling";
		case 3:
			return "Solar";
		case 4:
			return "Heat Pump";
		case 5:
			return "Dual";
		default:
			return typeof value === "number" ? `Status ${value}` : "--";
	}
}

export function formatHeatMode(
	value: number | undefined,
	bodyIndex: number,
	heaterConfig: HeaterConfig | undefined,
): string {
	const hasSolar =
		bodyIndex === 0 ? heaterConfig?.body1SolarPresent : heaterConfig?.body2SolarPresent;
	const hasHeatPump =
		bodyIndex === 0 ? heaterConfig?.solarHeatPumpPresent : heaterConfig?.thermaFloPresent;

	switch (value) {
		case 0:
			return "Off";
		case 1:
			return hasHeatPump && !hasSolar ? "Heat Pump" : "Heater";
		case 2:
			if (hasSolar) {
				return "Solar Preferred";
			}
			if (hasHeatPump) {
				return "Heat Pump Preferred";
			}
			return "Preferred";
		case 3:
			if (hasSolar) {
				return "Solar Only";
			}
			if (hasHeatPump) {
				return "Heat Pump";
			}
			return "Mode 3";
		case 4:
			return "No Change";
		default:
			return typeof value === "number" ? `Mode ${value}` : "--";
	}
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
