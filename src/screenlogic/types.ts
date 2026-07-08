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

export type EquipmentState = {
	airTemp?: number;
	currentTemp?: number[];
	heatStatus?: number[];
	setPoint?: number[];
	coolSetPoint?: number[];
	heatMode?: number[];
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
