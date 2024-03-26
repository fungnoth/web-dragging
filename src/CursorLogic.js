import { ref } from "vue";

export const pointerDown = ref(false);
export const pointerPosition = ref([0, 0]);
document.addEventListener("pointerdown", () => {
    pointerDown.value = true;
});
document.addEventListener("pointerup", () => {
    pointerDown.value = false;
});
document.addEventListener("pointermove", (e) => {
    pointerPosition.value = getCursorPosition(e);
});

export function getCursorPosition(e) {
    if (!e) return pointerPosition.value;
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