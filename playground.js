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

var filtered = []
function find_name_index() {
    for (let index in array) {
        if (array[index].name === 'zakky') {
            filtered.push(index)
        };
    }
    console.log(filtered)
};

find_name_index()
var a = undefined;
var b = undefined;
var c = 'hei';

if (a,b === undefined && c !== undefined) {
    console.log('a, b undefined, c defined')
}
else if (a,c === undefined && b !== undefined) {
    console.log('a, c undefined, b defined')
}

//console.log(find_name_index)