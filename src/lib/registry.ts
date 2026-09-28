import { AURA_PRESETS } from './presets.js'
import type { AuraPreset } from './types.js'

export { AURA_PRESETS }

const byId = new Map(AURA_PRESETS.map((p) => [p.id, p]))

export const AURA_CATEGORIES: string[] = [...new Set(AURA_PRESETS.map((p) => p.category))]

/** Look up a preset by id. Returns undefined for unknown ids. */
export function getAura(id: string): AuraPreset | undefined {
	return byId.get(id)
}
