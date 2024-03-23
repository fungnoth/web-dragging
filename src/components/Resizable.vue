<template>
    <div>
        <div @mousedown.stop="(e) => dragStart(e, 't')" 
            class="absolute left-0 top-0 --bg-red-500 w-full h-3 z-10 cursor-n-resize"
        ></div>
        <div @mousedown.stop="(e) => dragStart(e, 'b')" 
            class="absolute left-0 bottom-0 --bg-black/40 w-full h-3 z-10 cursor-s-resize"
        ></div>
        <div @mousedown.stop="(e) => dragStart(e, 'l')" 
            class="absolute left-0 top-0 --bg-black/40 w-3 h-full z-10 cursor-w-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'r')" 
            class="absolute right-0 top-0 --bg-black/40 w-3 h-full z-10 cursor-e-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'tl')" 
            class="absolute left-0 top-0 --bg-black/40 w-3 h-3 z-10 cursor-nw-resize">
        </div> 
        <div @mousedown.stop="(e) => dragStart(e, 'tr')" 
            class="absolute right-0 top-0 --bg-black/40 w-3 h-3 z-10 cursor-ne-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'bl')" 
            class="absolute left-0 bottom-0 --bg-black/40 w-3 h-3 z-10 cursor-sw-resize">
        </div>  
        <div @mousedown.stop="(e) => dragStart(e, 'br')" 
            class="absolute right-0 bottom-0 --bg-black/40 w-3 h-3 z-10 cursor-se-resize">
        </div>  
    </div>
</template>
<script setup>
    const props = defineProps(["elClass", "target"])
    import { onMounted, ref } from 'vue';
    onMounted(() => {
        console.log(props.target)
        if (props.target) props.target.dateset.resizable = 1;

    })
    const dragFrom = [0,0]
    const elOriginalPos = [0,0]

    const targetSize = [0,0];
    const targetOffset = [0,0];

    let direction = null;

    let resizing = false
    const dragStart = (e, _direction) => {
        resizing = true;
        direction = _direction;
        console.log(resizing)
        dragFrom[0] = e.clientX;
        dragFrom[1] = e.clientY;

        // save target size with border size
        const rect = props.target.getBoundingClientRect();
        
        targetSize[0] = rect.width;
        targetSize[1] = rect.height;
        elOriginalPos[0] = rect.left;
        elOriginalPos[1] = rect.top;

    }
    const dragEnd = () => {
        resizing = false;
        direction = null;
    }


    const drag = (e) => {
        if (!resizing) return;
        const _target = props.target;

        const dx = e.clientX - dragFrom[0];
        const dy = e.clientY - dragFrom[1];

        let widthMultiplier = 0;
        let heightMultiplier = 0;
        
        if (direction.includes("t")) {
            _target.style.top = (elOriginalPos[1] + dy) + "px";
            heightMultiplier = -1;
        } else if (direction.includes("b")) {
            _target.style.bottom = (elOriginalPos[1] - dy) + "px";
            heightMultiplier = 1;
        }
        if (direction.includes("l")) {
            _target.style.left = (elOriginalPos[0] + dx) + "px";
            widthMultiplier = -1;
        } else if (direction.includes("r")) {
            _target.style.right = (elOriginalPos[0] - dx) + "px";
            widthMultiplier = 1;
        }

        _target.style.width = (targetSize[0] + widthMultiplier * dx) + "px";
        _target.style.height = (targetSize[1] + heightMultiplier * dy) + "px";
        

    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
</script>