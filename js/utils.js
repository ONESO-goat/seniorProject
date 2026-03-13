export function p(s){
    console.log(`${s}\n`);
}

export function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
let times = 1;
export function debug(s){
    
    console.log(`${times} [DEBUG] ${s}\n`)
    times++;
}