function convert() {
    const fromBase = document.getElementById('fromBase').value;
    const toBase = document.getElementById('toBase').value;
    const number = document.getElementById('number').value.trim().toUpperCase();
    let result;
    let steps = "";

    if (fromBase === toBase) {
        document.getElementById('result').innerText = `Basisnya sama cok, nilai tetap: ${number}`;
        document.getElementById('conversionSteps').innerText = "Gak ada caranya lah cok!";
        return;
    }

    try {
        if (fromBase === 'd') {
            // Konversi dari Desimal ke basis lain
            const decimalNumber = parseInt(number, 10);
            if (toBase === 'b') {
                result = decimalToBinary(decimalNumber);
                steps = getDecimalToBinarySteps(decimalNumber);
            } else if (toBase === 'o') {
                result = decimalToOctal(decimalNumber);
                steps = getDecimalToOctalSteps(decimalNumber);
            } else if (toBase === 'h') {
                result = decimalToHex(decimalNumber);
                steps = getDecimalToHexSteps(decimalNumber);
            }
        } else if (fromBase === 'b') {
            // Konversi dari Biner
            if (toBase === 'd') {
                result = binaryToDecimal(number);
                steps = getBinaryToDecimalSteps(number);
            } else if (toBase === 'o') {
                result = binaryToOctal(number);
                steps = getBinaryToOctalSteps(number);
            } else if (toBase === 'h') {
                result = binaryToHex(number);
                steps = getBinaryToHexSteps(number);
            }
        } else if (fromBase === 'o') {
            // Konversi dari Oktal
            if (toBase === 'd') {
                result = octalToDecimal(number);
                steps = getOctalToDecimalSteps(number);
            } else if (toBase === 'b') {
                result = octalToBinary(number);
                steps = getOctalToBinarySteps(number);
            } else if (toBase === 'h') {
                result = octalToHex(number);
                steps = getOctalToHexSteps(number);
            }
        } else if (fromBase === 'h') {
            // Konversi dari Heksadesimal
            if (toBase === 'd') {
                result = hexToDecimal(number);
                steps = getHexToDecimalSteps(number);
            } else if (toBase === 'b') {
                result = hexToBinary(number);
                steps = getHexToBinarySteps(number);
            } else if (toBase === 'o') {
                result = hexToOctal(number);
                steps = getHexToOctalSteps(number);
            }
        }

        document.getElementById('result').innerText = `Hasil: ${result}`;
        document.getElementById('conversionSteps').innerText = steps;
    } catch (e) {
        document.getElementById('result').innerText = `Error: ${e.message}`;
        document.getElementById('conversionSteps').innerText = "";
    }
}

// Fungsi konversi langsung
function decimalToBinary(decimalNumber) {
    return decimalNumber.toString(2);
}

function decimalToOctal(decimalNumber) {
    return decimalNumber.toString(8);
}

function decimalToHex(decimalNumber) {
    return decimalNumber.toString(16).toUpperCase();
}

function binaryToDecimal(binaryNumber) {
    return parseInt(binaryNumber, 2);
}

function binaryToOctal(binaryNumber) {
    const decimalNumber = binaryToDecimal(binaryNumber);
    return decimalToOctal(decimalNumber);
}

function binaryToHex(binaryNumber) {
    const decimalNumber = binaryToDecimal(binaryNumber);
    return decimalToHex(decimalNumber);
}

function octalToDecimal(octalNumber) {
    return parseInt(octalNumber, 8);
}

function octalToBinary(octalNumber) {
    const decimalNumber = octalToDecimal(octalNumber);
    return decimalToBinary(decimalNumber);
}

function octalToHex(octalNumber) {
    const decimalNumber = octalToDecimal(octalNumber);
    return decimalToHex(decimalNumber);
}

function hexToDecimal(hexNumber) {
    return parseInt(hexNumber, 16);
}

function hexToBinary(hexNumber) {
    const decimalNumber = hexToDecimal(hexNumber);
    return decimalToBinary(decimalNumber);
}

function hexToOctal(hexNumber) {
    const decimalNumber = hexToDecimal(hexNumber);
    return decimalToOctal(decimalNumber);
}

// Fungsi untuk langkah-langkah konversi
function getDecimalToBinarySteps(decimalNumber) {
    let steps = "";
    let num = decimalNumber;
    let stepNumber = 1;

    while (num > 0) {
        let remainder = num % 2;
        steps += `Langkah ${stepNumber}: Bagi ${num} dengan 2, hasil bagi = ${Math.floor(num / 2)}, sisa = ${remainder}\n`;
        num = Math.floor(num / 2);
        stepNumber++;
    }

    return steps;
}

function getDecimalToOctalSteps(decimalNumber) {
    let steps = "";
    let num = decimalNumber;
    let stepNumber = 1;

    while (num > 0) {
        let remainder = num % 8;
        steps += `Langkah ${stepNumber}: Bagi ${num} dengan 8, hasil bagi = ${Math.floor(num / 8)}, sisa = ${remainder}\n`;
        num = Math.floor(num / 8);
        stepNumber++;
    }

    return steps;
}

function getDecimalToHexSteps(decimalNumber) {
    let steps = "";
    let num = decimalNumber;
    let stepNumber = 1;

    while (num > 0) {
        let remainder = num % 16;
        let hexDigit = remainder.toString(16).toUpperCase();
        steps += `Langkah ${stepNumber}: Bagi ${num} dengan 16, hasil bagi = ${Math.floor(num / 16)}, sisa = ${remainder} (hex: ${hexDigit})\n`;
        num = Math.floor(num / 16);
        stepNumber++;
    }

    return steps;
}

function getBinaryToDecimalSteps(binaryNumber) {
    let steps = "";
    let decimal = 0;

    for (let i = 0; i < binaryNumber.length; i++) {
        let digit = binaryNumber[binaryNumber.length - 1 - i];
        let value = digit * Math.pow(2, i);
        steps += `Langkah ${i + 1}: ${digit} * 2^${i} = ${value}\n`;
        decimal += value;
    }

    steps += `Nilai desimal adalah: ${decimal}\n`;
    return steps;
}

function getBinaryToOctalSteps(binaryNumber) {
    let decimalSteps = getBinaryToDecimalSteps(binaryNumber);
    let decimalNumber = binaryToDecimal(binaryNumber);
    let octalSteps = getDecimalToOctalSteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke oktal:\n${octalSteps}`;
}

function getBinaryToHexSteps(binaryNumber) {
    let decimalSteps = getBinaryToDecimalSteps(binaryNumber);
    let decimalNumber = binaryToDecimal(binaryNumber);
    let hexSteps = getDecimalToHexSteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke heksadesimal:\n${hexSteps}`;
}

function getOctalToDecimalSteps(octalNumber) {
    let steps = "";
    let decimal = 0;

    for (let i = 0; i < octalNumber.length; i++) {
        let digit = octalNumber[octalNumber.length - 1 - i];
        let value = digit * Math.pow(8, i);
        steps += `Langkah ${i + 1}: ${digit} * 8^${i} = ${value}\n`;
        decimal += value;
    }

    steps += `Nilai desimal adalah: ${decimal}\n`;
    return steps;
}

function getOctalToBinarySteps(octalNumber) {
    let decimalSteps = getOctalToDecimalSteps(octalNumber);
    let decimalNumber = octalToDecimal(octalNumber);
    let binarySteps = getDecimalToBinarySteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke biner:\n${binarySteps}`;
}

function getOctalToHexSteps(octalNumber) {
    let decimalSteps = getOctalToDecimalSteps(octalNumber);
    let decimalNumber = octalToDecimal(octalNumber);
    let hexSteps = getDecimalToHexSteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke heksadesimal:\n${hexSteps}`;
}

function getHexToDecimalSteps(hexNumber) {
    let steps = "";
    let decimal = 0;

    for (let i = 0; i < hexNumber.length; i++) {
        let digit = parseInt(hexNumber[hexNumber.length - 1 - i], 16);
        let value = digit * Math.pow(16, i);
        steps += `Langkah ${i + 1}: ${digit} * 16^${i} = ${value}\n`;
        decimal += value;
    }

    steps += `Nilai desimal adalah: ${decimal}\n`;
    return steps;
}

function getHexToBinarySteps(hexNumber) {
    let decimalSteps = getHexToDecimalSteps(hexNumber);
    let decimalNumber = hexToDecimal(hexNumber);
    let binarySteps = getDecimalToBinarySteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke biner:\n${binarySteps}`;
}

function getHexToOctalSteps(hexNumber) {
    let decimalSteps = getHexToDecimalSteps(hexNumber);
    let decimalNumber = hexToDecimal(hexNumber);
    let octalSteps = getDecimalToOctalSteps(decimalNumber);

    return `${decimalSteps}\nLalu konversi dari desimal ke oktal:\n${octalSteps}`;
}

// Toggle display of conversion steps
function toggleSteps() {
    const stepsDiv = document.getElementById('steps');
    stepsDiv.style.display = stepsDiv.style.display === 'none' ? 'block' : 'none';
}
