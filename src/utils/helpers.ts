export function formatAttributes(attrs: any): string {
	if (!attrs) return ''
	if (typeof attrs === 'string') return attrs
	if (Array.isArray(attrs)) return attrs.join(' / ')
	if (typeof attrs === 'object') {
		try {
			return Object.values(attrs).filter(v => v !== null && v !== undefined).join(' / ')
		} catch {
			return String(attrs)
		}
	}
	return String(attrs)
}

export default { formatAttributes }
