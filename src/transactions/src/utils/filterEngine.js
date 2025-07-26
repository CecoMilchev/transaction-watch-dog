const OPERATORS = {
    eq: (a, b) => a === b,
    neq: (a, b) => a !== b,
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
        const { logic, filters } = descriptor;
        const evals = filters.map(f => applyFilter(obj, f));
        return logic === 'and'
            ? evals.every(Boolean)
            : evals.some(Boolean);
    }

    const { field, operator, value } = descriptor;
    const actual = getNestedValue(obj, field);
    const fn = OPERATORS[operator];

    if (!fn) {
        throw new Error(`Unsupported operator: ${operator}`);
    }

    return fn(actual, value);
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}