let frutas = [];

frutas[0] = "Banana";
frutas[1] = "Mamao";
frutas[2] = "Uva";
frutas[3] = "Goiaba";
frutas[4] = "Abacate";

console.log(frutas[3]);

const arraySize = frutas.length;
let index = 0;

while (index < arraySize) {
    console.log(`While: ${frutas[index]}`);
    index++;
}

for (let i = 0; i < arraySize; i++) {
    console.log(`For: ${frutas[i]}`);
}

let index2 = 0;

do {
    console.log(`DoWhile: ${frutas[index2]}`);
    index2++;
} while (index2 < arraySize);
