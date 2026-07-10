// supPopover.ts
import { computePosition, flip, offset, shift, arrow, autoUpdate, } from '@floating-ui/dom';
import DOMPurify from 'dompurify';
let tooltipEl = null;
let arrowEl = null;
let contentEl = null;
let currentSup = null;
let cleanupAutoUpdate = null;
let initialized = false;
// ---- Creation tooltip DOM ----
function createTooltip() {
    const el = document.createElement('div');
    el.className = 'sup-popover';
    const inner = document.createElement('div');
    inner.className = 'sup-popover__content';
    el.appendChild(inner);
    const av = document.createElement('div');
    av.className = 'sup-popover__arrow';
    el.appendChild(av);
    document.body.appendChild(el);
    return { el, arrowEl: av, contentEl: inner };
}
// ---- PositionCalculate ----
async function updatePosition(reference) {
    if (!tooltipEl || !arrowEl)
        return;
    const { x, y, placement, middlewareData } = await computePosition(reference, tooltipEl, {
        placement: 'top',
        middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowEl })],
    });
    Object.assign(tooltipEl.style, { left: `${x}px`, top: `${y}px` });
    tooltipEl.dataset.placement = placement;
    const { x: ax, y: ay } = middlewareData.arrow ?? {};
    const side = placement.split('-')[0];
    const staticSide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side];
    Object.assign(arrowEl.style, {
        left: '',
        top: '',
        right: '',
        bottom: '',
        ...(ax != null ? { left: `${ax}px` } : {}),
        ...(ay != null ? { top: `${ay}px` } : {}),
        [staticSide]: '-5px',
    });
}
// ---- Show / Hide ----
function show(sup) {
    if (!tooltipEl || !contentEl)
        return;
    // Filter XSS, onlyRetainSafe HTML TagAnd properties
    contentEl.innerHTML = DOMPurify.sanitize(sup.dataset.title ?? '');
    tooltipEl.style.display = 'block';
    tooltipEl.style.pointerEvents = 'auto';
    cleanupAutoUpdate?.();
    cleanupAutoUpdate = autoUpdate(sup, tooltipEl, () => updatePosition(sup));
}
function hide() {
    if (!tooltipEl)
        return;
    tooltipEl.style.display = 'none';
    cleanupAutoUpdate?.();
    cleanupAutoUpdate = null;
    currentSup = null;
}
// ---- Core: use pointer PathDetermineWhetherWithin safe zone ----
// RecordMouse coordinates
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });
function isMouseInsideSafeZone() {
    if (!tooltipEl || !currentSup)
        return false;
    const supRect = currentSup.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    //  Sup and tooltip rect each extended by 2px tolerance, 
    // Then determine if mouse is within the convex hull of two rectangles (union bbox)
    const pad = 2;
    const minX = Math.min(supRect.left, tipRect.left) - pad;
    const maxX = Math.max(supRect.right, tipRect.right) + pad;
    const minY = Math.min(supRect.top, tipRect.top) - pad;
    const maxY = Math.max(supRect.bottom, tipRect.bottom) + pad;
    return mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY;
}
// ---- EventProcess ----
function onMouseOver(e) {
    const sup = e.target.closest('sup[data-title]');
    if (!sup)
        return;
    if (sup !== currentSup) {
        currentSup = sup;
        show(sup);
    }
}
function onMouseMove(e) {
    if (!currentSup)
        return;
    // Mouse on tooltip Internal，DirectSkip, notDo anyProcess
    if (tooltipEl && (e.target === tooltipEl || tooltipEl.contains(e.target)))
        return;
    const overSup = e.target.closest('sup[data-title]');
    if (!overSup && !isMouseInsideSafeZone()) {
        hide();
    }
}
// ---- SingletonPublic API ----
export const supPopover = {
    init() {
        if (initialized)
            return;
        initialized = true;
        const els = createTooltip();
        tooltipEl = els.el;
        arrowEl = els.arrowEl;
        contentEl = els.contentEl;
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mousemove', onMouseMove, { passive: true });
    },
    destroy() {
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('mousemove', onMouseMove);
        cleanupAutoUpdate?.();
        tooltipEl?.remove();
        tooltipEl = null;
        arrowEl = null;
        contentEl = null;
        currentSup = null;
        initialized = false;
    },
};
