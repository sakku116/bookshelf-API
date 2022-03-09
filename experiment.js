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
    console.log(filtered)
};

find_name_index()

//console.log(find_name_index)