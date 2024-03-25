<template>
    <div>
        <div @mousedown.stop="(e) => dragStart(e, 't')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 't')" 
            class="absolute left-0 top-0 --bg-red-500 w-full h-3 z-10 cursor-n-resize"
        ></div>
        <div @mousedown.stop="(e) => dragStart(e, 'b')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'b')" 
            class="absolute left-0 bottom-0 --bg-black/40 w-full h-3 z-10 cursor-s-resize"
        ></div>
        <div @mousedown.stop="(e) => dragStart(e, 'l')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'l')" 
            class="absolute left-0 top-0 --bg-black/40 w-3 h-full z-10 cursor-w-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'r')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'r')" 
            class="absolute right-0 top-0 --bg-black/40 w-3 h-full z-10 cursor-e-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'tl')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'tl')" 
            class="absolute left-0 top-0 --bg-black/40 w-8 h-8 z-10 cursor-nw-resize">
        </div> 
        <div @mousedown.stop="(e) => dragStart(e, 'tr')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'tr')" 
            class="absolute right-0 top-0 --bg-black/40 w-8 h-8 z-10 cursor-ne-resize">
        </div>
        <div @mousedown.stop="(e) => dragStart(e, 'bl')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'bl')" 
            class="absolute left-0 bottom-0 --bg-black/40 w-8 h-8 z-10 cursor-sw-resize">
        </div>  
        <div @mousedown.stop="(e) => dragStart(e, 'br')" 
            @touchstart.stop.prevent="(e) => dragStart(e, 'br')" 
            class="absolute right-0 bottom-0 --bg-black/40 w-8 h-8 z-10 cursor-se-resize">
        </div>  
    </div>
</template>
<script setup>
    const props = defineProps({
        move: {
            type: Function,
            required: true
        },
        elClass: {
            required: false
        },
        target: {
            required: false
        }

    })
    
    import { onMounted, ref } from 'vue';
    import { bringToTop, pauseSelection } from '@/DragLogic';
    import { getCursorPosition } from '@/CursorLogic';


    onMounted(() => {
        console.log(props.target)
        if (props.target) props.target.dateset.resizable = 1;

    })
    const dragFrom = [0,0]
    const elOriginalPos = [0,0]

    const targetSize = [0,0];

    let direction = null;

    let resizing = false
    const dragStart = (e, _direction) => {
        resizing = true;
        direction = _direction;
        console.log(resizing)
        
        const cursorPosition = getCursorPosition(e);
        dragFrom[0] = cursorPosition[0];
        dragFrom[1] = cursorPosition[1];

        // save target size with border size
        const rect = props.target.getBoundingClientRect();
        
        targetSize[0] = rect.width;
        targetSize[1] = rect.height;
        elOriginalPos[0] = rect.left;
        elOriginalPos[1] = rect.top;

        bringToTop(props.target);
        pauseSelection.value = true;
        e.preventDefault();

    }
    const dragEnd = () => {
        resizing = false;
        direction = null;
        pauseSelection.value = false;
    }


    const drag = (e) => {
        if (!resizing) return;
        const _target = props.target;

        const cursorPosition = getCursorPosition(e);
        const dx = cursorPosition[0] - dragFrom[0];
        const dy = cursorPosition[1] - dragFrom[1];

        let widthMultiplier = 0;
        let heightMultiplier = 0;
        let newLeft = elOriginalPos[0];
        let newTop = elOriginalPos[1];

        if (direction.includes('t')) {
            newTop = elOriginalPos[1] + dy;
            heightMultiplier = -1;
        } else if (direction.includes('b')) {
            heightMultiplier = 1;
        }
        if (direction.includes('l')) {
            newLeft = elOriginalPos[0] + dx;
            widthMultiplier = -1;
        } else if (direction.includes('r')) {
            widthMultiplier = 1;
        }


        let newWidth = Math.max(200,
            Math.min((targetSize[0] + widthMultiplier * dx), 
                window.innerWidth
            )
        );
        let newHeight = Math.max(200,
            Math.min((targetSize[1] + heightMultiplier * dy), 
                window.innerHeight
            )
        ) ;

        _target.style.width = newWidth + "px";
        _target.style.height = newHeight + "px";
        props.move(newLeft, newTop)

    }

    document.addEventListener("mousemove", drag);
    document.addEventListener('touchmove', drag)
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener('touchend', dragEnd)
</script>