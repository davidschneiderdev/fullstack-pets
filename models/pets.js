const db = require('./connection');

// Create
function create() {

}

// Retrieve
async function one(id) {
    try {
        // const onePet = await db.query(`select * from pets where id=${id}`);
        // const onePet = await db.any(`select * from pets where id=${id}`);
        // const onePet = await db.one(`select * from pets where id=${id}`);

        // $1 is syntax specific to pg-promise
        // it means interpolate the 1st value form the array
        // (in this case, that's the 'id' that we received as an argument)
        const onePet = await db.one(`select * from pets where id=$1`, [id]);
        // console.log(onePet);
        return onePet;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function all() {
    const allPets = await db.query(`select * from pets`)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(err => {
            console.log(err);
            return [];
        })
    console.log(allPets);
    return allPets;
}

// Update
function update() {

}

// Delete
function del() {

}

module.exports = {
    create,
    one,
    all, 
    update,
    del
}