function convert() {
    const fromBase = document.getElementById('fromBase').value;
    const toBase = document.getElementById('toBase').value;
    const number = document.getElementById('number').value.trim();
    let decimalNumber;
    let steps = "";

    try {
        // Konversi dari basis asal ke desimal
        if (fromBase === 'b') {
            decimalNumber = parseInt(number, 2);
            steps += `Konversi biner ${number} ke desimal:\n`;
        } else if (fromBase === 'o') {
            decimalNumber = parseInt(number, 8);
            steps += `Konversi oktal ${number} ke desimal:\n`;
        } else if (fromBase === 'd') {
            decimalNumber = parseInt(number, 10);
            steps += `Nomor sudah dalam desimal: ${number}\n`;
        } else if (fromBase === 'h') {
            decimalNumber = parseInt(number, 16);
            steps += `Konversi heksadesimal ${number} ke desimal:\n`;
        }

        if (isNaN(decimalNumber)) {
            throw new Error("Format angka tidak valid untuk basis yang dipilih.");
        }

        steps += `Nilai desimal adalah: ${decimalNumber}\n\n`;

        // Konversi dari desimal ke basis tujuan
        let result;
        if (toBase === 'b') {
            result = decimalNumber.toString(2);
            steps += `Langkah-langkah konversi dari desimal ${decimalNumber} ke biner:\n`;
            steps += convertDecimalToBinarySteps(decimalNumber);
        } else if (toBase === 'o') {
            result = decimalNumber.toString(8);
            steps += `Langkah-langkah konversi dari desimal ${decimalNumber} ke oktal:\n`;
            steps += convertDecimalToOctalSteps(decimalNumber);
        } else if (toBase === 'd') {
            result = decimalNumber.toString(10);
            steps += `Nomor sudah dalam desimal: ${result}\n`;
        } else if (toBase === 'h') {
            result = decimalNumber.toString(16);
            steps += `Langkah-langkah konversi dari desimal ${decimalNumber} ke heksadesimal:\n`;
            steps += convertDecimalToHexSteps(decimalNumber);
        }

        document.getElementById('result').innerText = `Hasil: ${result}`;
        document.getElementById('conversionSteps').innerText = steps;
    } catch (e) {
        document.getElementById('result').innerText = `Error: ${e.message}`;
        document.getElementById('conversionSteps').innerText = "";
    }
}

function convertDecimalToBinarySteps(decimalNumber) {
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

function convertDecimalToOctalSteps(decimalNumber) {
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

function convertDecimalToHexSteps(decimalNumber) {
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

function toggleSteps() {
    const stepsElement = document.getElementById('steps');
    if (stepsElement.style.display === "none") {
        stepsElement.style.display = "block";
    } else {
        stepsElement.style.display = "none";
    }
}
