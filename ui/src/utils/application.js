export function isWorkFlow(type) {
    return type === 'WORK_FLOW';
}
export function mapToUrlParams(map) {
    const params = new URLSearchParams();
    map.forEach((item) => {
        params.append(encodeURIComponent(item.name), encodeURIComponent(item.value));
    });
    return params.toString(); // Return URL QueryString
}
