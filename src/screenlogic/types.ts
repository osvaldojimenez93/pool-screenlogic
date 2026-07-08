export type LocalUnit = {
	address: string;
	type: number;
	port: number;
	gatewayType: number;
	gatewaySubtype: number;
	gatewayName: string;
};

export type CircuitState = {
	id: number;
	state: number | boolean;
	name?: string;
};

export type BodyState = {
	id: number;
	currentTemp: number;
	heatStatus: number;
	setPoint: number;
	coolSetPoint: number;
	heatMode: number;
};

export type EquipmentState = {
	airTemp?: number;
	bodies?: BodyState[];
	circuitArray?: CircuitState[];
	pH?: number;
	orp?: number;
	saltPPM?: number;
};

export type ControllerCircuit = {
	circuitId?: number;
	id?: number;
	name?: string;
};

export type ControllerConfig = {
	degC?: boolean;
	circuitArray?: ControllerCircuit[];
};

export type HeaterConfig = {
	body1SolarPresent?: boolean;
	body2SolarPresent?: boolean;
	solarHeatPumpPresent?: boolean;
	thermaFloPresent?: boolean;
};

export type PumpConfig = {
	id: number;
	name?: string;
};

export type PumpStatus = {
	isRunning: boolean;
	pumpWatts: number;
	pumpRPMs: number;
	pumpGPMs: number;
};

export type EquipmentConfiguration = {
	heaterConfig?: HeaterConfig;
	numPumps?: number;
	pumps?: PumpConfig[];
};
