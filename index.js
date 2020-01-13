const pets = require('./models/pets');

async function main() {
    // const thePets = await pets.all();
    const onePet = await pets.one(1);
    console.log(onePet);
}

main();

