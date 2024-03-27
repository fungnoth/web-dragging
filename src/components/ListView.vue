<template>
    <div ref="container" class="flex-wrap relative" :class="modeClasses" >
        <LinkItem v-for="(item, i) in items"
            ref="itemRefs" :file-name="item.fileName.value" :color="item.color.value" :icon="item.icon.value"
            :launch="item.launch" :class="itemClass"
            :style="{ 
                left: isDragging ? `${item.position?.value?.[0]}px` : null, 
                top:  isDragging ? `${item.position?.value?.[1]}px` : null,
                position: isDragging ? 'absolute' : null,
                order: (item.order?.value) || i+1 ,
            }"
            @dragstart.prevent  
            @mousedown.prevent="(e)=>_dragStart(e, i)" 
            @touchstart="(e)=>dragStart(e, i)"
            @dblclick="launch(item)"
        >
            <!-- <div class="absolute right-0" v-if="item.order">
            
                {{item.order.value}}
            </div> -->
        </LinkItem>
    </div>


</template>

<script setup>
    import { computed, nextTick, ref, watch } from 'vue';
    import LinkItem from '@/components/LinkItem.vue'
    import { pick } from '@/DragLogic.js';
    import { getCursorPosition, pointerDown } from '@/CursorLogic';
    import { launch as launchTask } from '@/Tasks.js';
    import { touchHandler } from '@/Touch.js';
    const props = defineProps(["mode"])
    let dragCheckingTimeout = null;
    let lastTap = {pos: [null, null], time: 0};
    let dragTrack = [];
    let itemClass = "relative border-white/75 z-0 ";
    let container = ref(null);
    let labelClass;
    if (props.mode === "list") {
        itemClass += "w-full h-20 flex flex-row"
        labelClass = "!text-left"
    } else {
        itemClass += "w-28 h-36 gap-1 flex flex-col"
    }
    const baseUrl = import.meta.env.BASE_URL;
    watch(pointerDown, (val) => {
        if (dragCheckingTimeout) clearTimeout(dragCheckingTimeout);
    });
    
    const metaData = [
        { "fileName": "Component", "launch": '@/components/MyStatus.vue' },
        { "fileName": "Files", "icon": baseUrl + "files.png", "launch": '@/components/Files.vue' },
        { "fileName": "Instagram", "icon": baseUrl + "instagram.webp" },
        { "fileName": "Google Chrome", "icon": baseUrl + "chrome.png" },
        { "fileName": "Steam", "icon": baseUrl + "steam.png" },
        { "fileName": "Photos", "icon": baseUrl + "photos.webp", "launch": '@/components/ImageBox.vue' },
        { "fileName": "Whatsapp", "icon": baseUrl + "whatsapp.webp" },

    ]
    const isDragging = ref(false);
    const items = metaData.map((data, i) => {
        return {
            "fileName": ref(data.fileName),
            "color": ref(data.color),
            "position": ref([null, null]),
            "launch": data.launch,
            "icon": ref(data.icon),
            "order": ref(i+1),
        }
    });
    const itemRefs = ref([]);
    const modeClasses = ref({});

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
            item.position.value = getAdjustedPosition([rect.left, rect.top]);
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


            // console.log(combinedItem.element, combinedItem)
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
            const adjustedPos = getAdjustedPosition([rect.left, rect.top]);
            const itemX = adjustedPos[0] + rect.width / 2;
            const itemY = adjustedPos[1] + rect.height / 2;
            const distance = Math.sqrt((x - itemX) ** 2 + (y - itemY) ** 2);
            if (distance < closestDistance) {
                closestItem = combinedItem;
                closestDistance = distance;
            }
        }
        const closestRect = closestItem.element.getBoundingClientRect();
        console.log("target position", position,"closest item position",  [closestRect.left, closestRect.top])
        return closestItem;
    }

    function launch(item) {
        item.launch && launchTask(item.launch);
    }

    function findDropPosition(currentCursorPosition, item) {
        const [adjustedX, adjustedY] = currentCursorPosition;

        // Find the closest item element to the cursor position
        let closestItem = findClosestItem(currentCursorPosition, item);
        

        console.log("findDropPosition for loop end", {closestItem})
        // If no items found, return null
        if (!closestItem) return;

        // Determine the drop position based on the cursor position and the closest item
        const closestRect = closestItem.element.getBoundingClientRect();
        const closestPos = getAdjustedPosition([closestRect.left, closestRect.top]);
        const itemX = closestPos[0] + closestRect.width / 2;
        const itemY = closestPos[1] + closestRect.height / 2;

        console.log({adjustedX, adjustedY})
        let result;
        if (props.mode === "list") {
            if (adjustedY < itemY) {
                result = closestItem.metadata.order.value - 1;
                closestItem.element.style.borderTopWidth = '12px';
                // closestItem.element.style.marginTop = '16px';
            } else {
                result = closestItem.metadata.order.value ;
                closestItem.element.style.borderBottomWidth = '12px';
                // closestItem.element.style.marginBottom = '16px';
            }
        } else {
            
            if (adjustedX < itemX) {
                result = closestItem.metadata.order.value - 1;
                closestItem.element.style.borderLeftWidth = '12px';
                // closestItem.element.style.marginLeft = '16px';
            } else {
                result = closestItem.metadata.order.value ;
                closestItem.element.style.borderRightWidth = '12px';
                // closestItem.element.style.marginRight = '16px';
            }
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
            return getAdjustedPosition([rect.left, rect.top]);
        });
        combinedItems.value.forEach((combinedItem) => {
            combinedItem.element.style.borderLeftWidth = 0;
            combinedItem.element.style.borderRightWidth = 0;
            combinedItem.element.style.borderTopWidth = 0;
            combinedItem.element.style.borderBottomWidth = 0;
            // combinedItem.element.style.marginLeft = 0;
            // combinedItem.element.style.marginRight = 0;
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
    function getAdjustedPosition(position) {
        const containerRect = container.value?.getBoundingClientRect() || { left: 0, top: 0 };
        return [position[0] - containerRect.left, position[1] - containerRect.top];
    }

    function dragStart(e, i) {
        touchHandler(e, {
            onDoubleTap: function (e) {
                console.log("DOUBLE TAP", i)
            },
            onTap: function (e) {
                console.log("ONE TAP", i)
                launch(items[i]);
            }
        })
        e.preventDefault();

        // if (dragCheckingTimeout) clearTimeout(dragCheckingTimeout);
        // dragCheckingTimeout = setTimeout(() => {
        //     const anyMovement = dragTrack.filter((pos) => {
        //         return Math.abs(pos[0] - lastPosition[0]) > 5 || Math.abs(pos[1] - lastPosition[1]) > 5;
        //     }).length > 1;
        //     if (anyMovement) return console.log("dragTooShort")
        //     _dragStart(e, i)

        // }, 500);

    }

    function _dragStart(e, i) {
        const item = items[i];
        const itemRef = itemRefs.value[i];
        let lastPosition = getCursorPosition();

        resetTransition();
        const callbacks = {
            "move": (x, y) => {
                lastPosition = [x, y];
                dragTrack.push(lastPosition);
                
                for (const combinedItem of sortedCombinedItems.value) {
                    combinedItem.element.style.borderLeftWidth = 0;
                    combinedItem.element.style.borderRightWidth = 0;
                    combinedItem.element.style.borderTopWidth = 0;
                    combinedItem.element.style.borderBottomWidth = 0;
                    // combinedItem.element.style.marginLeft = 0;
                    // combinedItem.element.style.marginRight = 0;
                }
                const order = findDropPosition(lastPosition, item)
                return move(item, x, y);
            },
            "drop": (e) => {
                if (dragCheckingTimeout) clearTimeout(dragCheckingTimeout);
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
        // console.log(itemRef.el)
    }

</script>