import { ref } from 'vue';

let z = 1;
const draggedFrom = [0, 0];
const offsetFrom = [0, 0]
export const target = ref(null);

export function pick(e, newTarget, ) {
    target.value = newTarget;
    draggedFrom[0] = e.clientX;
    draggedFrom[1] = e.clientY;
    offsetFrom[0] = target.value.offsetLeft;
    offsetFrom[1] = target.value.offsetTop;
    console.log(draggedFrom[0], draggedFrom[1])
    console.log(offsetFrom[0], offsetFrom[1])
    target.value.style.zIndex = z++;
}
export function drop(e) {
    target.value = null;
}
function drag(e) {
    if (!target.value) return;
    const curOffset = [
        e.clientX - draggedFrom[0],
        e.clientY - draggedFrom[1],
    ];
    const x = curOffset[0] + offsetFrom[0];
    const y = curOffset[1] + offsetFrom[1];

    target.value.style.left = `${x}px`;
    target.value.style.top = `${y}px`;

    console.log("dragging", target.value)
    
}

document.addEventListener('mousemove', (e) => drag(e));
document.addEventListener('mouseup', (e) => drop(e));