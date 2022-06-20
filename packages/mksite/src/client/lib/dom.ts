// @ts-nocheck

export function isCustomElementTag(name) {
	return typeof name === 'string' && /-/.test(name);
}

export function getCustomElementConstructor(name) {
	if (typeof customElements !== 'undefined' && isCustomElementTag(name)) {
		return customElements.get(name) || null;
	}
	return null;
}

export async function isLitElement(Component) {
	const Ctr = getCustomElementConstructor(Component);
	return !!(Ctr && Ctr._$litElement$);
}
