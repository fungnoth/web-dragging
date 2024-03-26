export function getCursorPosition(e) {
    if (e instanceof MouseEvent) return [e.clientX, e.clientY];
    if (window.TouchEvent && e instanceof TouchEvent) return [e.touches[0].clientX, e.touches[0].clientY];
    return [e.clientX, e.clientY];
}

export function calculateOffset(e, initialPosition) {
    const cursorPosition = getCursorPosition(e);
    return [
        cursorPosition[0] - initialPosition[0],
        cursorPosition[1] - initialPosition[1],
    ];
}