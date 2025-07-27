const OPERATORS = {
    eq: (a, b) => a == b,
    neq: (a, b) => a != b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    contains: (a, b) => typeof a === 'string' && a.includes(b),
    startswith: (a, b) => typeof a === 'string' && a.startsWith(b),
    endswith: (a, b) => typeof a === 'string' && a.endsWith(b),
    in: (a, b) => Array.isArray(b) && b.includes(a)
};

export function applyFilter(obj, descriptor) {
    if (descriptor.filters && Array.isArray(descriptor.filters)) {
        const { logicalOperator, filters } = descriptor;
        const evals = filters.map(f => applyFilter(obj, f));
        
        // Support both 'AND'/'OR' and 'and'/'or' (case insensitive)
        const operator = (logicalOperator || 'AND').toLowerCase();
        
        return operator === 'and'
            ? evals.every(Boolean)
            : evals.some(Boolean);
    }

    const { field, operator, value } = descriptor;
    
    // Check if required properties are present
    if (!field || !operator) {
        console.warn('Invalid filter descriptor:', descriptor);
        return false;
    }
    
    const actual = obj[field];
    const fn = OPERATORS[operator];

    if (!fn) {
        throw new Error(`Unsupported operator: ${operator}`);
    }

    return fn(actual, value);
}