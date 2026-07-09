import { describe, expect, test } from "bun:test";
import { formatHeatMode, formatHeatStatus } from "./helpers";

describe("formatHeatStatus", (): void => {
	test("maps known heat status values", (): void => {
		expect(formatHeatStatus(0)).toBe("Off");
		expect(formatHeatStatus(3)).toBe("Solar");
		expect(formatHeatStatus(4)).toBe("Heat Pump");
	});

	test("falls back for unknown values", (): void => {
		expect(formatHeatStatus(9)).toBe("Status 9");
		expect(formatHeatStatus(undefined)).toBe("--");
	});
});

describe("formatHeatMode", (): void => {
	test("uses solar labels when solar is present", (): void => {
		expect(formatHeatMode(2, 0, { body1SolarPresent: true })).toBe("Solar Preferred");
		expect(formatHeatMode(3, 0, { body1SolarPresent: true })).toBe("Solar Only");
	});

	test("uses heat pump labels when only a heat pump is present", (): void => {
		expect(formatHeatMode(1, 1, { thermaFloPresent: true })).toBe("Heat Pump");
		expect(formatHeatMode(2, 1, { thermaFloPresent: true })).toBe("Heat Pump Preferred");
	});

	test("falls back for unknown values", (): void => {
		expect(formatHeatMode(7, 0, undefined)).toBe("Mode 7");
		expect(formatHeatMode(undefined, 0, undefined)).toBe("--");
	});
});
