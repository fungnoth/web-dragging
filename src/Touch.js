import { shallowRef } from "vue";
import {getCursorPosition} from "@/CursorLogic.js";

const DOUBLE_TAP_DISTANCE = 40;
const DOUBLE_TAP_INTERVAL = 200;

export const dragTrack = shallowRef([]);
let dragCheckingTimeout = null;
let doubleTapCheckingTimeout = null;
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


export function touchHandler(e, callbacks){
    dragTrack.value = [getCursorPosition()];
    if (doubleTapCheckingTimeout) clearTimeout(doubleTapCheckingTimeout);

    if (_isDoubleTap(e)){
        console.log("double tap");
        callbacks.onDoubleTap(e);
        return;
    }
    lastTap = {pos: getCursorPosition(), time: Date.now()};
    doubleTapCheckingTimeout = setTimeout(() => {
        callbacks.onTap(e);
        
    }, DOUBLE_TAP_INTERVAL);


}