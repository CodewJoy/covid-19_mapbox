export const parseMapboxArr = (maxAmount, inputArr, property) => {
    const level = maxAmount / inputArr.length;
    let mapboxArr = ["interpolate", ["linear"], ["get", property]];
    inputArr.forEach((el, index) => {
        mapboxArr.push(level * index);
        mapboxArr.push(el);
    });
    return mapboxArr;
};

export const parseLegendList = (maxAmount, colorArr) => {
    const level = maxAmount / colorArr.length;
    const legendList = colorArr.map((el, index) => ({ 'color': el, 'text': `${level * index}`}));
    return legendList;
};