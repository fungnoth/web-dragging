<template>
    <div class="p-2" :class="modeClasses" >
      <LinkItem v-for="(item, i) in items"
        ref="itemRefs" :file-name="item.fileName.value" :color="item.color.value" 
        :data-left="`${item.position?.value?.[0]}px`"
        :style="{ 
            left: `${item.position?.value?.[0]}px`, top: `${item.position?.value?.[1]}px`,
            position: isDragging ? 'absolute' : null,
            order: (item.order?.value) || i ,
        }"
        @dragstart.prevent  
        @mousedown.prevent="(e)=>dragStart(e, i)" 
        @touchstart.prevent="(e)=>dragStart(e, i)"
    ></LinkItem>
      
    </div>

</template>

<script setup>
    import { ref } from 'vue';
    import LinkItem from '@/components/LinkItem.vue'
    import { pick, target as draggingTarget, pauseSelection } from '@/DragLogic.js';
    import { getCursorPosition, calculateOffset } from '@/CursorLogic';
    const props = defineProps(["mode"])
    
    const metaData = [
        { "fileName": "123", "color": "red"},
        { "fileName": "image", "color": "blue"},
        { "fileName": "LOLOLOL", "color": "yellow"},
        { "fileName": "PK", "color": "purple"},
        { "fileName": "xzv", "color": "#777"},
        { "fileName": "[][][]", "color": "#000"},
    ]
    const isDragging = ref(false);
    const items = metaData.map((data, i) => {
        return {
            "fileName": ref(data.fileName),
            "color": ref(data.color),
            "position": ref([null, null]),
            "order": ref(i+1),
        }
    });
    const itemRefs = ref([]);
    
    const modeClasses = ref({});
    
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

    function getSortedCombinedItems() {
        const combinedItems = itemRefs.value.map((itemRef, index) => ({
            element: itemRef.el,
            metadata: items[index],
            realIndex: index,
        }));
        combinedItems.sort((a, b) => a.metadata.order.value - b.metadata.order.value);
        return combinedItems;
    }

    function reorderItems(itemData, newOrder) {
        const combinedItems = getSortedCombinedItems();
        combinedItems.forEach((combinedItem) => {
            if (combinedItem.metadata.order.value < newOrder) return;
            if (combinedItem.metadata === itemData) return


            console.log(combinedItem.element, combinedItem)
            if (combinedItem.metadata.order.value === newOrder) {
                combinedItem.metadata.order.value -= 1;
            } else {
                combinedItem.metadata.order.value += 1;
            }
        })
        itemData.order.value = newOrder;
    }

    function findDropPosition(currentCursorPosition, item) {
        const [cursorX, cursorY] = currentCursorPosition;

        // Find the closest item element to the cursor position
        let closestItem = null;
        let closestDistance = Infinity;
        
        const sortedCombinedItems = getSortedCombinedItems();
        

        console.log("findDropPosition for loop")
        for (const combinedItem of sortedCombinedItems) {
            console.log(combinedItem, item)
            if (combinedItem.metadata === item) {
                console.log(item, "same")
                continue;
            }
            const rect = combinedItem.element.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;

            // Calculate the distance between the cursor and the item center
            const distance = Math.sqrt((cursorX - itemX) ** 2 + (cursorY - itemY) ** 2);

            // Update the closest item if the distance is smaller
            if (distance < closestDistance) {
                closestItem = combinedItem;
                closestDistance = distance;
            }
        }

        console.log("findDropPosition for loop end", {closestItem})
        // If no items found, return null
        if (!closestItem) return;

        // Determine the drop position based on the cursor position and the closest item
        const closestRect = closestItem.element.getBoundingClientRect();
        const itemX = closestRect.left + closestRect.width / 2;
        const itemY = closestRect.top + closestRect.height / 2;

        console.log("closest item", closestItem, itemX)
        console.log("Current cursor x", cursorX)

        let result;
        if (cursorX < itemX) {
            result = closestItem.metadata.order.value - 1;
        } else {
            result = closestItem.metadata.order.value ;
        }
        console.log(result, itemRefs)
        return result;
    }

    function dragStart(e, i) {
        const item = items[i];
        const itemRef = itemRefs.value[i];
        const callbacks = {
            "move": (x, y) => move(item, x, y),
            "drop": (e) => {
                const order = findDropPosition(getCursorPosition(e), item)
                console.log({item})
                console.log({
                    old: item.order.value,
                    new: order
                })
                if (order !== undefined) {
                    reorderItems(item, order)
                }
                isDragging.value = false;
            },
        };
        beforeDragging();

        pick(e, itemRef.el, callbacks)
        // el.value.focus();
        // console.log({e, item, itemRef, i})
        console.log(itemRef.el)
    }

</script>