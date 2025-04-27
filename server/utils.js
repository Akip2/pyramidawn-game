import {ROLES} from "./const.js";

export async function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function isRoleMummy(role) {
    return role === ROLES.MUMMY;
}

export function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}