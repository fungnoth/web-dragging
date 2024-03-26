import { getCursorPosition, calculateOffset } from './CursorLogic';

let resizeDirection = null;
const dragFrom = [0, 0];
const elOriginalPos = [0, 0];
const targetSize = [0, 0];

export function initResize(e, direction, target) {
    resizeDirection = direction;
    const cursorPosition = getCursorPosition();
    dragFrom[0] = cursorPosition[0];
    dragFrom[1] = cursorPosition[1];

    const rect = target.getBoundingClientRect();
    targetSize[0] = rect.width;
    targetSize[1] = rect.height;
    elOriginalPos[0] = rect.left;
    elOriginalPos[1] = rect.top;
}

export function calculateNewDimensions(e, target) {
    if (!resizeDirection) return [0, 0, 0, 0];

    const cursorOffset = calculateOffset(e, dragFrom);
    const dx = cursorOffset[0];
    const dy = cursorOffset[1];

    let widthMultiplier = 0;
    let heightMultiplier = 0;
    let newLeft = elOriginalPos[0];
    let newTop = elOriginalPos[1];

    if (resizeDirection.includes('t')) {
        newTop = elOriginalPos[1] + dy;
        heightMultiplier = -1;
    } else if (resizeDirection.includes('b')) {
        heightMultiplier = 1;
    }
    if (resizeDirection.includes('l')) {
        newLeft = elOriginalPos[0] + dx;
        widthMultiplier = -1;
    } else if (resizeDirection.includes('r')) {
        widthMultiplier = 1;
    }

    let newWidth = Math.max(
        200,
        Math.min(targetSize[0] + widthMultiplier * dx, window.innerWidth)
    );
    let newHeight = Math.max(
        200,
        Math.min(targetSize[1] + heightMultiplier * dy, window.innerHeight)
    );

    return [newLeft, newTop, newWidth, newHeight];
}

export function cleanupResize() {
    resizeDirection = null;
}