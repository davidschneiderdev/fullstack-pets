const db = require('./connection');

// Create
async function create(name, species, birthdate, owner_id) {
    try {
        const result = await db.one(`
        insert into pets
            (name, species, birthdate, owner_id)
        values
            ($1, $2, $3, $4)
        returning id
        `, [name, species, birthdate, owner_id]);
        // return result.rows[0].id;
        return result.id;
    } catch (err) {
        console.log(err);

    }
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
async function updateName(id, name) {
    const result = await db.result(`
        update pets set
            name=$1
        where id=$2;      
    `, [name, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}

async function updateBirthdate(id, dateObject) {
    // '2020-01-12'
    const year = dateObject.getFullYear(); // YYYY

    let month = dateObject.getMonth() + 1; // MM
    if (month < 10) {
        month = `0${month}`;
    }

    let day = dateObject.getDate(); // DD
    if (day < 10) {
        day = `0${day}`;
    }

    const dateString = `${year}-${month}-${day}`;
    const result = await db.result(`
        update pets set
            birthdate=$1
        where id=$2
    `, [dateString, id]);
    return result;
}

// Delete
async function del(id) {
    const result = await db.result(`delete from pets where id=$1`, [id]);
    console.log(result);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}

module.exports = {
    create,
    one,
    all, 
    updateName,
    updateBirthdate,
    del
}