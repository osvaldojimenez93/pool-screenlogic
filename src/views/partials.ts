import type {
	CircuitState,
	ControllerConfig,
	EquipmentConfiguration,
	EquipmentState,
	PumpConfig,
	PumpStatus,
} from "../screenlogic";
import { discoverUnits, withClient } from "../screenlogic";
import { escapeHtml, formatHeatMode, formatHeatStatus, formatTemperature, metric } from "./helpers";

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
		const equipmentConfig = await getEquipmentConfiguration(client);

		const circuitNames = new Map(
			(config.circuitArray ?? [])
				.map((circuit) => [circuit.circuitId ?? circuit.id, circuit.name])
				.filter(([id]) => typeof id === "number") as [number, string][],
		);

		return `
			<section class="status-grid">
				${metric("Air", formatTemperature(state.airTemp, config.degC))}
				${renderBodyMetric("Pool", state, config, equipmentConfig, 0)}
				${renderBodyMetric("Spa", state, config, equipmentConfig, 1)}
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
				${await renderPumpSection(client, equipmentConfig)}
				${renderCircuitStates(state.circuitArray ?? [], circuitNames)}
			</section>
		`;
	});
}

function renderBodyMetric(
	label: string,
	state: EquipmentState,
	config: ControllerConfig,
	equipmentConfig: EquipmentConfiguration | undefined,
	bodyIndex: number,
): string {
	const body = state.bodies?.[bodyIndex];
	const details = [
		`set ${formatTemperature(body?.setPoint, config.degC)}`,
		`mode ${formatHeatMode(body?.heatMode, bodyIndex, equipmentConfig?.heaterConfig)}`,
		`status ${formatHeatStatus(body?.heatStatus)}`,
	].join(" · ");
	return metric(label, formatTemperature(body?.currentTemp, config.degC), details);
}

async function getEquipmentConfiguration(client: {
	equipment: {
		getEquipmentConfigurationAsync(): Promise<EquipmentConfiguration>;
	};
}): Promise<EquipmentConfiguration | undefined> {
	try {
		return await client.equipment.getEquipmentConfigurationAsync();
	} catch {
		return undefined;
	}
}

async function renderPumpSection(
	client: {
		pumps: {
			getPumpStatusAsync(pumpId: number): Promise<PumpStatus>;
		};
	},
	equipmentConfig: EquipmentConfiguration | undefined,
): Promise<string> {
	const pumps = getPumps(equipmentConfig);
	if (pumps.length === 0) {
		return `<div class="notice">No pumps reported by the controller.</div>`;
	}

	const pumpStatuses = await Promise.allSettled(
		pumps.map(async (pump) => ({
			pump,
			status: await client.pumps.getPumpStatusAsync(pump.id),
		})),
	);

	return `
		<div class="section-stack">
			<div>
				<h3>Pumps</h3>
				<p>Live pump telemetry</p>
			</div>
			<div class="pump-grid">
				${pumpStatuses
					.map((result, index) => {
						if (result.status === "rejected") {
							return `
								<div class="metric">
									<span>${escapeHtml(pumps[index]?.name ?? `Pump ${index + 1}`)}</span>
									<strong>Unavailable</strong>
									<small>${escapeHtml(result.reason instanceof Error ? result.reason.message : String(result.reason))}</small>
								</div>
							`;
						}

						const { pump, status } = result.value;
						return `
							<div class="metric">
								<span>${escapeHtml(pump.name ?? `Pump ${pump.id}`)}</span>
								<strong>${status.isRunning ? "Running" : "Idle"}</strong>
								<small>${escapeHtml(`${status.pumpWatts} W · ${status.pumpRPMs} RPM · ${status.pumpGPMs} GPM`)}</small>
							</div>
						`;
					})
					.join("")}
			</div>
		</div>
	`;
}

function getPumps(equipmentConfig: EquipmentConfiguration | undefined): PumpConfig[] {
	const configuredPumps = (equipmentConfig?.pumps ?? []).filter((pump) => pump.id > 0);
	if (configuredPumps.length > 0) {
		return configuredPumps;
	}

	return Array.from({ length: equipmentConfig?.numPumps ?? 0 }, (_, index) => ({
		id: index + 1,
		name: `Pump ${index + 1}`,
	}));
}

function renderCircuitStates(
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
						<span class="pill">${isOn ? "On" : "Off"}</span>
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
