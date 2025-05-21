/**
 * Calculate the profit margin of a quote.
 * @param {Array} lineItems - List of quote items with cost and price.
 * @returns {Object} - margin %, total cost, total price
 */
export function calculateMargin(lineItems) {
  let totalCost = 0;
  let totalPrice = 0;

  for (let item of lineItems) {
    const cost = parseFloat(item.cost || 0);
    const price = parseFloat(item.price || 0);
    const quantity = parseInt(item.quantity || 1);

    totalCost += cost * quantity;
    totalPrice += price * quantity;
  }

  const margin = totalPrice > 0 ? ((totalPrice - totalCost) / totalPrice) * 100 : 0;

  return {
    margin: parseFloat(margin.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2))
  };
}

/**
 * Check if a quote is below the minimum acceptable margin.
 * @param {number} margin - The calculated profit margin.
 * @param {number} threshold - Minimum required margin (default 30%).
 * @returns {boolean}
 */
export function isBelowMinimumMargin(margin, threshold = 30) {
  return margin < threshold;
}