import type { CircuitState, ControllerConfig, EquipmentState } from "../screenlogic";
import { discoverUnits, withClient } from "../screenlogic";
import { escapeHtml, formatTemperature, metric } from "./helpers";

export async function renderUnits(): Promise<string> {
	const units = await discoverUnits();

	if (units.length === 0) {
		return `<div class="notice warning">No local ScreenLogic units found.</div>`;
	}

	return `
		<div class="unit-list">
			${units
				.map(
					(unit) => `
				<section class="unit-card">
					<div>
						<h3>${escapeHtml(unit.gatewayName)}</h3>
						<p>${escapeHtml(unit.address)}:${unit.port}</p>
					</div>
					<span class="pill">type ${unit.type}</span>
				</section>
			`,
				)
				.join("")}
		</div>
	`;
}

export async function renderStatus(): Promise<string> {
	return await withClient(async (client, unit) => {
		const [state, config] = await Promise.all([
			client.equipment.getEquipmentStateAsync() as Promise<EquipmentState>,
			client.equipment.getControllerConfigAsync() as Promise<ControllerConfig>,
		]);

		const circuitNames = new Map(
			(config.circuitArray ?? [])
				.map((circuit) => [circuit.circuitId ?? circuit.id, circuit.name])
				.filter(([id]) => typeof id === "number") as [number, string][],
		);

		return `
			<section class="status-grid">
				${metric("Air", formatTemperature(state.airTemp, config.degC))}
				${metric("Pool", formatTemperature(state.bodies?.[0]?.currentTemp, config.degC), `set ${formatTemperature(state.bodies?.[0]?.setPoint, config.degC)}`)}
				${metric("Spa", formatTemperature(state.bodies?.[1]?.currentTemp, config.degC), `set ${formatTemperature(state.bodies?.[1]?.setPoint, config.degC)}`)}
				${metric("Salt", state.saltPPM ? `${state.saltPPM} ppm` : "--")}
			</section>

			<section class="panel">
				<div class="panel-heading">
					<div>
						<h2>${escapeHtml(unit.gatewayName)}</h2>
						<p>${escapeHtml(unit.address)}:${unit.port}</p>
					</div>
					<span class="pill">${config.degC ? "C" : "F"}</span>
				</div>
				${renderCircuitControls(state.circuitArray ?? [], circuitNames)}
			</section>
		`;
	});
}

function renderCircuitControls(
	circuits: CircuitState[],
	names: Map<number, string | undefined>,
): string {
	if (circuits.length === 0) {
		return `<div class="notice">No circuits returned by the controller.</div>`;
	}

	return `
		<div class="circuit-list">
			${circuits
				.map((circuit) => {
					const isOn = circuit.state === 1 || circuit.state === true;
					const label = names.get(circuit.id) || circuit.name || `Circuit ${circuit.id}`;
					return `
					<div class="circuit-row">
						<div>
							<strong>${escapeHtml(label)}</strong>
							<span>${isOn ? "On" : "Off"}</span>
						</div>
						<button
							type="button"
							class="${isOn ? "secondary" : "primary"}"
							hx-post="/partials/circuits/${circuit.id}/${isOn ? "off" : "on"}"
							hx-target="#status"
							hx-swap="innerHTML"
						>
							${isOn ? "Turn Off" : "Turn On"}
						</button>
					</div>
				`;
				})
				.join("")}
		</div>
	`;
}

export function renderError(error: unknown): string {
	const message = error instanceof Error ? error.message : String(error);
	return `<div class="notice danger">${escapeHtml(message)}</div>`;
}
