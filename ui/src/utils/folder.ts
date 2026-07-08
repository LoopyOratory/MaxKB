/**
 * Bitwise operationSortToolFunction
 * High 16 bits: integer, low 16 bits: decimal
 */

const FRACTION_BITS = 16
const FRACTION_MASK = 0xffff

// Encoding32Bit integer
function encode(integer: number, fraction = 0) {
  return (integer << FRACTION_BITS) | (fraction & FRACTION_MASK)
}

// Calculate value between two positions 
function mid(pos1: number, pos2: number) {
  const midPos = (pos1 + pos2) >> 1
  if (midPos === pos1 || midPos === pos2) {
    return null
  }
  return midPos
}

// Rebalance, adjacent position difference less than2When, cannotInsert
// positions - { nodeId: position }
function rebalance(positions: any) {
  const sorted = Object.entries(positions).sort((a: any, b: any) => a[1] - b[1])

  const rebalanced = {} as Record<string, number>
  sorted.forEach(([nodeId], index) => {
    rebalanced[nodeId] = encode(index + 1, 0)
  })
  return rebalanced
}


export { encode, rebalance, mid }
