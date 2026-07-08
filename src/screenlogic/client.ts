import * as Screenlogic from "node-screenlogic";
import type { LocalUnit } from "./types";

const searchMs = Number(Bun.env.SCREENLOGIC_SEARCH_MS ?? 2500);

export async function discoverUnits(): Promise<LocalUnit[]> {
	const finder = new Screenlogic.FindUnits();
	try {
		return (await finder.searchAsync(searchMs)) as LocalUnit[];
	} finally {
		try {
			finder.close();
		} catch {
			// searchAsync closes the socket; close() is only a best-effort cleanup.
		}
	}
}

async function getTargetUnit(): Promise<LocalUnit> {
	const configuredAddress = Bun.env.SCREENLOGIC_HOST;
	const configuredPort = Number(Bun.env.SCREENLOGIC_PORT ?? 80);

	if (configuredAddress) {
		return {
			address: configuredAddress,
			port: configuredPort,
			gatewayName: Bun.env.SCREENLOGIC_NAME ?? "Configured ScreenLogic",
		} as LocalUnit;
	}

	const units = await discoverUnits();
	const unit = units[0];
	if (!unit) {
		throw new Error(
			"No ScreenLogic units found. Set SCREENLOGIC_HOST or check UDP broadcast/firewall access.",
		);
	}

	return unit;
}

export async function withClient<T>(
	work: (client: Screenlogic.UnitConnection, unit: LocalUnit) => Promise<T>,
): Promise<T> {
	const unit = await getTargetUnit();
	const client = new Screenlogic.UnitConnection();
	client.init(unit.gatewayName, unit.address, unit.port, Bun.env.SCREENLOGIC_PASSWORD ?? "");

	try {
		await client.connectAsync();
		return await work(client, unit);
	} finally {
		await client.closeAsync();
	}
}

export async function setCircuitState(circuitId: number, enabled: boolean): Promise<void> {
	await withClient(async (client) => {
		await client.circuits.setCircuitStateAsync(circuitId, enabled);
	});
}
