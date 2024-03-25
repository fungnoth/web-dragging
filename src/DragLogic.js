import { ref } from 'vue';
import { getCursorPosition, calculateOffset } from './CursorLogic';

let z = 1;
const draggedFrom = [0, 0];
const offsetFrom = [0, 0];
export const pauseSelection = ref(false);
let moveCallback = null;
let dropCallback = null;
export const target = ref(null);

export function bringToTop(el) {
    el.style.zIndex = z++;
}

export function pick(e, newTarget, callbacks) {
    target.value = newTarget;
    moveCallback = callbacks?.move;
    dropCallback = callbacks?.drop;
    const cursorPosition = getCursorPosition(e);
    draggedFrom[0] = cursorPosition[0];
    draggedFrom[1] = cursorPosition[1];
    offsetFrom[0] = target.value.offsetLeft;
    offsetFrom[1] = target.value.offsetTop;
    bringToTop(target.value);
    pauseSelection.value = true;
}

export function drop(e) {
    if (dropCallback instanceof Function) { dropCallback(e); }
    target.value = null;
    moveCallback = null;
    dropCallback = null;
    pauseSelection.value = false;
}

function drag(e) {
    if (!target.value) return;
    const curOffset = calculateOffset(e, draggedFrom);
    const x = curOffset[0] + offsetFrom[0];
    const y = curOffset[1] + offsetFrom[1];

    moveCallback(x, y);
}

document.addEventListener('mousemove', (e) => drag(e));
document.addEventListener('touchmove', (e) => drag(e));
document.addEventListener('mouseup', (e) => drop(e));
document.addEventListener('touchend', (e) => drop(e));