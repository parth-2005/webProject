/**
 * Format ISO date into locale date string.
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDate(value) {
	if (!value) return "-";
	return new Date(value).toLocaleDateString();
}

/**
 * Format phone number into readable groups.
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
	if (!phone) return "-";
	return phone.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");
}

/**
 * Format slot time value.
 * @param {string} slot
 * @returns {string}
 */
export function formatSlot(slot) {
	return slot || "-";
}

