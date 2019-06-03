import jsonData from './list.json';

function formatDistrictData() {
    const provice = [];
    const city = [];
    const district = [];
    for (let key in jsonData) {
        let strKey = key.toString();
        if (strKey.substring(2, 6) === '0000') {
            provice.push({
                value: strKey,
                label: jsonData[key],
                children: []
            });
        } else if (strKey.substring(4, 6) === '00') {
            city.push({
                value: strKey,
                label: jsonData[key],
                children: []
            });
        } else {
            district.push({
                value: strKey,
                label: jsonData[key],
                children: []
            });
        }
    }
    district.forEach(item => {
        let _value = item.value;
        const _city_prefix = _value.substring(0, 4);
        for (let i = 0; i < city.length; i++) {
            if (city[i].value.substring(0, 4) === _city_prefix) {
                city[i].children.push(item);
            }
        }
    });
    city.forEach(item => {
        let _value = item.value;
        const _provice_prefix = _value.substring(0, 2);
        for (let i = 0; i < provice.length; i++) {
            if (provice[i].value.substring(0, 2) === _provice_prefix) {
                provice[i].children.push(item);
            }
        }
    });

    return provice;
}

const district = formatDistrictData();

export default district;
