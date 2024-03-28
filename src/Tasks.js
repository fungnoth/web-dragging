import { ref, computed } from "vue";
import { uid } from '@/uid';
export const items = ref({});

import { pointerPosition } from '@/CursorLogic.js';

export async function launch(component) {
    const taskId = uid()
    const position = pointerPosition.value;
    console.log(taskId, 'launching task', component);

    items.value[taskId] = { component, position };
}