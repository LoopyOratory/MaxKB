/**
 * Parse MatchValue Residual {{}}
 *
 * Frontend only processes same-node form references
 * ex: CurrentNodeCalled "FormCollect", {{FormCollect.region}} → formValue.region
 *
 * Cross-node {{Start.question}} / {{GlobalVariable.x}} / {{chat.x}} already handled by backend form-node
 * reset_field Phase (FilterRemove localNode field_list After)Through generate_prompt
 * Pre-rendered as literal; frontend will no longer see these forms.
 */
export function resolveValue(raw, ctx) {
    return raw.replace(/\{\{([^.\s}]+)\.([^.\s}]+)\}\}/g, (match, nodeName, fieldName) => {
        if (nodeName !== ctx.currentNodeName) {
            return match; // Non-identicalForm, prefixnode Reference
        }
        const v = ctx.formValue?.[fieldName];
        return v == null ? match : String(v);
    });
}
export function lookupLeft(cond, ctx) {
    const scope = cond.field[0] === 'global' ? 'base-node' : cond.field[0];
    if (scope === ctx.currentNodeId) {
        return ctx.formValue?.[cond.field[1]]; // SameNode: Real-time from formValue 
    }
    return cond._left; // Cross-Node: Backend Return
}
const compareHandlers = {
    eq: (l, r) => String(l) === String(r),
    not_eq: (l, r) => String(l) !== String(r),
    contain: (l, r) => containImpl(l, r),
    not_contain: (l, r) => !containImpl(l, r),
    is_true: (l) => l === true,
    is_not_true: (l) => l !== true,
    gt: (l, r) => numOrStrCmp(l, r, (a, b) => a > b, (a, b) => a > b),
    ge: (l, r) => numOrStrCmp(l, r, (a, b) => a >= b, (a, b) => a >= b),
    lt: (l, r) => numOrStrCmp(l, r, (a, b) => a < b, (a, b) => a < b),
    le: (l, r) => numOrStrCmp(l, r, (a, b) => a <= b, (a, b) => a <= b),
};
export function compareByOp(left, op, right) {
    const fn = compareHandlers[op];
    if (!fn)
        throw new Error(`Unknown compare op: ${op}`);
    return fn(left, right);
}
function containImpl(source, target) {
    if (Array.isArray(target)) {
        return target.every((t) => containImpl(source, t));
    }
    const t = String(target);
    if (typeof source === 'string')
        return source.includes(t);
    if (Array.isArray(source))
        return source.some((item) => String(item) === t);
    return String(source).includes(t);
}
function numOrStrCmp(left, right, numFn, strFn) {
    const a = Number(left);
    const b = Number(right);
    if (!Number.isNaN(a) && !Number.isNaN(b))
        return numFn(a, b);
    try {
        return strFn(String(left), String(right));
    }
    catch {
        return false;
    }
}
export function evaluateVisibility(rules, ctx) {
    if (!rules || !rules.conditions || rules.conditions.length === 0) {
        return true;
    }
    const results = rules.conditions.map((cond) => {
        const left = lookupLeft(cond, ctx);
        if (left == null && cond.compare !== 'is_true' && cond.compare !== 'is_not_true') {
            return false;
        }
        const right = typeof cond.value === 'string' ? resolveValue(cond.value, ctx) : cond.value;
        return compareByOp(left, cond.compare, right);
    });
    const matched = rules.condition === 'or' ? results.some(Boolean) : results.every(Boolean);
    return rules.action === 'show' ? matched : !matched;
}
/**
 * Single-direction scanCalculateEntireFieldListVisibility table.
 * @param fields
 * @param formValue
 * @returns { FieldName: WhetherVisible }  map
 */
export function computeVisibilityMap(fields, formValue) {
    const copy = { ...formValue };
    const map = {};
    for (const f of fields) {
        if (!f.visibility_rules?.node_id) {
            map[f.field] = true;
            continue;
        }
        const visible = evaluateVisibility(f.visibility_rules, {
            formValue: copy,
            currentNodeId: f.visibility_rules.node_id,
            currentNodeName: f.visibility_rules.node_name || '',
        });
        map[f.field] = visible;
        if (!visible) {
            copy[f.field] = null;
        }
    }
    return map;
}
