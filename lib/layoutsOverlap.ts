import {LayoutRectangle} from "react-native";

export function layoutsOverlap(a: LayoutRectangle, b: LayoutRectangle) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    )
}