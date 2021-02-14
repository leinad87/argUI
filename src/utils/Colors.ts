export const colors = [0x003049, 0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0xedf6f9]

let color_i = 0;


function RGBToHex(r: number, g: number, b: number, t: number) {
    var P = (t < 0) ? 1 + t : 1 - t;
    var t1 = (t < 0) ? 0 : 255 * t;

    r = (r * P + t1)
    g = (g * P + t1)
    b = (b * P + t1)

    return (r << 16) + (g << 8) + b;
}

export let resetColors = () => color_i = 0;

export let nextColor = (base: number | undefined = undefined) => {
    if (base !== undefined) {
        var r = (base >> 16) & 255;
        var g = (base >> 8) & 255;
        var b = base & 255;


        let change = .20;
        return RGBToHex(r, g, b, change);

    } else {
        color_i = (color_i + 1) % colors.length
        return colors[color_i];

    }
}
