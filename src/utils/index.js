export const colorArr = {
    cases: [
        "#ffffb2",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#f03b20",
        "#bd0026",
    ],
    deaths: [
        "#f1eef6",
        "#d4b9da",
        "#c994c7",
        "#df65b0",
        "#dd1c77",
        "#980043",
    ],
};

export const radiusArr = [1, 10, 20, 30, 40, 50];

export const parseMapboxArr = (maxAmount, inputArr, property) => {
    const level = String(Math.trunc(maxAmount / inputArr.length));
    const parsedLevel = level.substring(0, 2) + '0'.repeat(level.length - 2); /** ex: 25678 => 25000 */
    let mapboxArr = ["interpolate", ["linear"], ["get", property]];
    inputArr.forEach((el, index) => {
        mapboxArr.push(parsedLevel * index);
        mapboxArr.push(el);
    });
    return mapboxArr;
};

export const parseLegendList = (maxAmount, colorArr) => {
    const level = String(Math.trunc(maxAmount / colorArr.length));
    const parsedLevel = level.substring(0, 2) + '0'.repeat(level.length - 2); /** ex: 25678 => 25000 */
    const legendList = colorArr.map((el, index) => ({ 'color': el, 'text': `${(parsedLevel * index).toLocaleString('en-US')}` }));
    return legendList;
};