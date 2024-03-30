import { computed, shallowRef, watch } from "vue";
import {getCursorPosition, pointerDown, pointerPosition} from "@/CursorLogic.js";

const DOUBLE_TAP_DISTANCE = 40;
const DOUBLE_TAP_INTERVAL = 200;
const LONG_PRESS_INTERVAL = 500;

export const dragTrack = shallowRef([]);
let dragCheckingTimeout = null;
let doubleTapCheckingTimeout = null;
let longPressCheckingTimeout = null;
let lastTap = {pos: [null, null], time: 0};

export function tapCleanup(){
    if (dragCheckingTimeout) clearTimeout(dragCheckingTimeout);
    dragTrack.value = [];
}

function _distance(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
function _isDoubleTap(e){
    const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    const hasLastTap = lastTap.pos[0] !== null && lastTap.pos[1] !== null;
    const lastTapDistance = hasLastTap ? dist(lastTap.pos, getCursorPosition()) : undefined;
    const tapInterval = hasLastTap ? Date.now() - lastTap.time : undefined;
    console.log("tapInterval", tapInterval, "lastTapDistance", lastTapDistance);
    return hasLastTap && lastTapDistance < DOUBLE_TAP_DISTANCE && tapInterval < DOUBLE_TAP_INTERVAL;
}

function _isLongPress(){
    return Date.now() - lastTap.time > LONG_PRESS_INTERVAL;
}


export function touchHandler(e, callbacks){
    dragTrack.value = [getCursorPosition()];
    if (doubleTapCheckingTimeout) clearTimeout(doubleTapCheckingTimeout);

    if (_isDoubleTap(e)){
        console.log("double tap");
        callbacks.onDoubleTap(e);
        return;
    }
    
    if (longPressCheckingTimeout) clearTimeout(longPressCheckingTimeout);
    longPressCheckingTimeout = setTimeout(() => {
        if (pointerDown.value &&_isLongPress()){
            console.log("long press");
            callbacks.onLongPress && callbacks.onLongPress(e);
            if (doubleTapCheckingTimeout) clearTimeout(doubleTapCheckingTimeout);
        }
    }, LONG_PRESS_INTERVAL);

    lastTap = {pos: getCursorPosition(), time: Date.now()};
    doubleTapCheckingTimeout = setTimeout(() => {
        console.log("still pressing?", pointerDown.value);
        if (pointerDown.value) return;
        console.log("still pressing?", pointerDown.value);  
        callbacks.onTap(e);
        
    }, DOUBLE_TAP_INTERVAL);
}

watch(pointerPosition, (newVal, oldVal) => {
    if (newVal === oldVal) return;
    if (!pointerDown.value) return;
    dragTrack.value.push(newVal);
    if (longPressCheckingTimeout) clearTimeout(longPressCheckingTimeout);
    if (doubleTapCheckingTimeout) clearTimeout(doubleTapCheckingTimeout);

});

watch(pointerDown, (newVal, oldVal) => {
    if (newVal) return;
    if (dragCheckingTimeout) clearTimeout(dragCheckingTimeout);
    if (longPressCheckingTimeout) clearTimeout(longPressCheckingTimeout);
    dragTrack.value = [];
});