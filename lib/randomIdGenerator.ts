export function generateRandomId(length : number) : string {
    const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    const arr = new Uint8Array(length);

    crypto.getRandomValues(arr);

    for (let i = 0; i < length; i++) {
        out += alphabet[arr[i] % alphabet.length];
    }
    return out;
}