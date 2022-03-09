const array = [
    {
        "name": "zakky"
    },
    {
        "name": "not_2"
    },
    {
        "name": "zakky"
    }
]

function find_name_index() {
    var filtered = []
    for (let index in array) {
        if (array[index].name === 'zakky') {
            filtered.push(index)
        };
    }
    return filtered
};

const f = () => {
    var filtered = [];
    for (let idx in array) {
        if (array[idx].name === 'zakky') {
            filtered.push(idx)
        }
    }
    return 'anjing';
}

console.log(find_name_index())

console.log(Object.keys(array[1]))