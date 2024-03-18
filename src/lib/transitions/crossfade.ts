import { quintOut } from "svelte/easing";
import { crossfade, fade, slide } from "svelte/transition";

export const [send, receive] = crossfade({
    duration: 1500,
    easing: quintOut,
    fallback: (node, params) => slide(node, {
        duration: 200
    })
});