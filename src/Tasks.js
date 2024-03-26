import { ref, computed, defineAsyncComponent } from "vue";
import { uid } from '@/uid';
export const items = ref({});

import { pointerPosition } from '@/CursorLogic.js';

export async function launch(task) {
    const taskId = uid();
    let component = task;
    const position = pointerPosition.value;
    console.log(taskId, 'launching task', task);
    if (typeof task === "string" && task.startsWith("@/")) {
        // trim the @/ prefix
        const componentPath = "./" + task.slice(2);
        component = defineAsyncComponent(() =>
            import(componentPath)
        );
    }

    items.value[taskId] = { component, position };
}