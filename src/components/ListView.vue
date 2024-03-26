<template>
    <div class="flex-wrap" :class="modeClasses" >
        <LinkItem v-for="(item, i) in items"
            ref="itemRefs" :file-name="item.fileName.value" :color="item.color.value" :icon="item.icon.value"
            class="relative z-0 w-28 h-36 flex flex-col "
            :data-left="`${item.position?.value?.[0]}px`"
            :style="{ 
                left: isDragging ? `${item.position?.value?.[0]}px` : null, 
                top:  isDragging ? `${item.position?.value?.[1]}px` : null,
                position: isDragging ? 'absolute' : null,
                order: (item.order?.value) || i+1 ,
            }"
            @dragstart.prevent  
            @mousedown.prevent="(e)=>dragStart(e, i)" 
            @touchstart.prevent="(e)=>dragStart(e, i)"
        >
            <div class="absolute right-0" v-if="item.order">
            
                {{item.order.value}}
            </div>
        </LinkItem>
    </div>


</template>

<script setup>
    import { computed, nextTick, ref } from 'vue';
    import LinkItem from '@/components/LinkItem.vue'
    import { pick } from '@/DragLogic.js';
    import { getCursorPosition, calculateOffset } from '@/CursorLogic';
    const props = defineProps(["mode"])
    const baseUrl = import.meta.env.BASE_URL;
    
    const metaData = [
        { "fileName": "image", },
        { "fileName": "LOLOLOL", },
        { "fileName": "PK" },
        { "fileName": "Instagram", "icon": baseUrl + "instagram.webp" },
        { "fileName": "Google Chrome", "icon": baseUrl + "chrome.png" },
        { "fileName": "Steam", "icon": baseUrl + "steam.png" },
        { "fileName": "Photos", "icon": baseUrl + "photos.webp" },
        { "fileName": "Whatsapp", "icon": baseUrl + "whatsapp.webp" },

    ]
    const isDragging = ref(false);
    const items = metaData.map((data, i) => {
        return {
            "fileName": ref(data.fileName),
            "color": ref(data.color),
            "position": ref([null, null]),
            "icon": ref(data.icon),
            "order": ref(i+1),
        }
    });
    const itemRefs = ref([]);
    const modeClasses = ref({});
    const cusorPosition = ref([0, 0]);

    const combinedItems = computed(() => {
        return itemRefs.value.map((itemRef, index) => ({
            element: itemRef.el,
            metadata: items[index],
            realIndex: index,
        }));
    });
    const sortedCombinedItems = computed(() => {
        return [... combinedItems.value].sort((a, b) => a.metadata.order.value - b.metadata.order.value);
    });
    
    function beforeDragging() {
        itemRefs.value.forEach((itemRef, i) => {
            const item = items[i];
            const rect = itemRef.el.getBoundingClientRect();
            item.position.value[0] = rect.left;
            item.position.value[1] = rect.top;    
        });

        isDragging.value = true;
    }

    function move(item, x, y) {
        item.position.value[0] = x;
        item.position.value[1] = y;
    }


    function reorderItems(itemData, newOrder) {
        sortedCombinedItems.value.forEach((combinedItem) => {
            if (combinedItem.metadata.order.value < newOrder) return;
            if (combinedItem.metadata === itemData) return console.log("same")


            console.log(combinedItem.element, combinedItem)
            if (combinedItem.metadata.order.value > newOrder) {
                combinedItem.metadata.order.value += 2;
            }

        })
        itemData.order.value = newOrder+1;
        sortedCombinedItems.value.forEach((combinedItem, i) => {
            combinedItem.metadata.order.value = i+1;
        });
    }

    function findClosestItem(position, item) {
        const [x, y] = position;
        let closestItem = null;
        let closestDistance = Infinity;
        for (const combinedItem of sortedCombinedItems.value) {
            if (combinedItem.metadata === item) continue;
            const rect = combinedItem.element.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;
            const distance = Math.sqrt((x - itemX) ** 2 + (y - itemY) ** 2);
            if (distance < closestDistance) {
                closestItem = combinedItem;
                closestDistance = distance;
            }
        }
        return closestItem;
    }

    function findDropPosition(currentCursorPosition, item) {
        const [cursorX, cursorY] = currentCursorPosition;

        // Find the closest item element to the cursor position
        let closestItem = findClosestItem(currentCursorPosition, item);
        

        console.log("findDropPosition for loop end", {closestItem})
        // If no items found, return null
        if (!closestItem) return;

        // Determine the drop position based on the cursor position and the closest item
        const closestRect = closestItem.element.getBoundingClientRect();
        const itemX = closestRect.left + closestRect.width / 2;
        const itemY = closestRect.top + closestRect.height / 2;


        let result;
        if (cursorX < itemX) {
            result = closestItem.metadata.order.value - 1;
            closestItem.element.style.borderLeftWidth = '4px';
        } else {
            result = closestItem.metadata.order.value ;
            closestItem.element.style.borderRightWidth = '4px';
        }
        console.log(result, itemRefs)
        return result;
    }

    let _transitionResetTimeout;
    function resetTransition() {
        if (_transitionResetTimeout) {
            clearTimeout(_transitionResetTimeout);
        }
        combinedItems.value.forEach((combinedItem) => {
            combinedItem.element.style.transition = null;
        });
    }
    async function startPosTransition() {
        await nextTick();
        resetTransition()
        combinedItems.value.forEach((combinedItem) => {
            combinedItem.element.style.position = "static";
        });

        const newPositons = combinedItems.value.map((combinedItem) => {
            const rect = combinedItem.element.getBoundingClientRect();
            return [rect.left, rect.top];
        });
        combinedItems.value.forEach((combinedItem) => {
            combinedItem.element.style.borderLeftWidth = 0;
            combinedItem.element.style.borderRightWidth = 0;
            combinedItem.element.style.transition = ".3s";
        });

        newPositons.forEach((newPosition, i) => {
            items[i].position.value = newPosition;
        });
        _transitionResetTimeout = setTimeout(() => {
            resetTransition();  
            isDragging.value = false;
        }, 300);
    }

    function dragStart(e, i) {
        const item = items[i];
        const itemRef = itemRefs.value[i];
        let lastPosition = getCursorPosition();
        resetTransition();
        const callbacks = {
            "move": (x, y) => {
                lastPosition = [x, y];
                
                for (const combinedItem of sortedCombinedItems.value) {
                    combinedItem.element.style.borderLeftWidth = 0;
                    combinedItem.element.style.borderRightWidth = 0;
                }
                const order = findDropPosition(lastPosition, item)
                cusorPosition.value[0] = x;
                cusorPosition.value[1] = y;
                return move(item, x, y);
            },
            "drop": (e) => {
                const order = findDropPosition(lastPosition, item)
                console.log({item})
                console.log({
                    old: item.order.value,
                    new: order
                })
                if (order !== undefined) {
                    reorderItems(item, order)
                }
                startPosTransition();

            },
        };
        beforeDragging();

        pick(e, itemRef.el, callbacks)
        itemRef.el.focus();
        // console.log({e, item, itemRef, i})
        console.log(itemRef.el)
    }

</script>