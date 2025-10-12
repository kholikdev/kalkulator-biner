let history = [];
let currentMode = 'basic';
let memory = [0, 0, 0, 0, 0]; // M1 to M5
let currentMemorySlot = 0; // 0 for M1, 1 for M2, etc.
let rawText = '';

function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.textContent += value;
    highlightParentheses();
}

function clearDisplay() {
    document.getElementById('display').textContent = '';
    highlightParentheses();
}

function backspace() {
    const display = document.getElementById('display');
    display.textContent = display.textContent.slice(0, -1);
    highlightParentheses();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function highlightParentheses() {
    const display = document.getElementById('display');
    const text = display.textContent;
    let highlighted = '';
    let openCount = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') {
            openCount++;
            highlighted += '<span class="highlight">(';
        } else if (text[i] === ')') {
            if (openCount > 0) {
                openCount--;
                highlighted += ')</span>';
            } else {
                highlighted += ')';
            }
        } else {
            highlighted += text[i];
        }
    }
    display.innerHTML = highlighted;
}

function calculate() {
    const display = document.getElementById('display');
    let expression = display.textContent;

    try {
        // Replace ^ with ** for exponentiation
        expression = expression.replace(/\^/g, '**');

        // Handle functions
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/asin\(/g, 'Math.asin(');
        expression = expression.replace(/acos\(/g, 'Math.acos(');
        expression = expression.replace(/atan\(/g, 'Math.atan(');
        expression = expression.replace(/fact\(/g, 'factorial(');

        // Handle constants
        expression = expression.replace(/pi/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');
        expression = expression.replace(/phi/g, '(1 + Math.sqrt(5)) / 2');
        expression = expression.replace(/sqrt2/g, 'Math.SQRT2');
        expression = expression.replace(/c/g, '299792458'); // Speed of light (m/s)
        expression = expression.replace(/g/g, '9.80665'); // Gravity (m/s²)
        expression = expression.replace(/h/g, '6.62607015e-34'); // Planck's constant (J⋅s)

        // Handle custom constants from localStorage
        const customConstants = JSON.parse(localStorage.getItem('customConstants') || '{}');
        for (const [key, value] of Object.entries(customConstants)) {
            expression = expression.replace(new RegExp(key, 'g'), value);
        }

        const result = eval(expression);
        const calculation = `${display.textContent} = ${result}`;
        display.textContent = result;

        // Add to history
        history.unshift(calculation);
        if (history.length > 10) {
            history.pop();
        }
        updateHistory();
    } catch (error) {
        display.textContent = 'Error: Invalid expression';
    }
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.onclick = () => {
            const expression = item.split(' = ')[0];
            const display = document.getElementById('display');
            display.textContent = expression;
            highlightParentheses();
        };
        historyList.appendChild(li);
    });
}

function toggleHistory() {
    const historyDiv = document.querySelector('.history');
    const toggleBtn = document.getElementById('toggleHistory');
    if (historyDiv.classList.contains('collapsed')) {
        historyDiv.classList.remove('collapsed');
        toggleBtn.textContent = 'Hide';
    } else {
        historyDiv.classList.add('collapsed');
        toggleBtn.textContent = 'Show';
    }
}

// Initialize toggle button event listener
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleHistory');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleHistory);
    }
    setMode('basic'); // Set default mode
    updateMemoryDisplay(); // Initialize memory display
    updateBaseDisplay(); // Initialize base display
});

function setMode(mode) {
    currentMode = mode;
    const basicBtn = document.getElementById('basicMode');
    const converterBtn = document.getElementById('converterMode');
    const buttonsDiv = document.querySelector('.buttons');

    // Update button states
    basicBtn.classList.toggle('active', mode === 'basic');
    converterBtn.classList.toggle('active', mode === 'converter');

    // Clear display
    clearDisplay();

    // Update buttons based on mode
    if (mode === 'basic') {
        buttonsDiv.innerHTML = `
            <button class="btn clear" onclick="clearDisplay()">C</button>
            <button class="btn backspace" onclick="backspace()">⌫</button>
            <button class="btn operator" onclick="appendToDisplay('^')">^</button>
            <button class="btn operator" onclick="appendToDisplay('/')">/</button>
            <button class="btn number" onclick="appendToDisplay('7')">7</button>
            <button class="btn number" onclick="appendToDisplay('8')">8</button>
            <button class="btn number" onclick="appendToDisplay('9')">9</button>
            <button class="btn operator" onclick="appendToDisplay('*')">*</button>
            <button class="btn number" onclick="appendToDisplay('4')">4</button>
            <button class="btn number" onclick="appendToDisplay('5')">5</button>
            <button class="btn number" onclick="appendToDisplay('6')">6</button>
            <button class="btn operator" onclick="appendToDisplay('-')">-</button>
            <button class="btn number" onclick="appendToDisplay('1')">1</button>
            <button class="btn number" onclick="appendToDisplay('2')">2</button>
            <button class="btn number" onclick="appendToDisplay('3')">3</button>
            <button class="btn operator" onclick="appendToDisplay('+')">+</button>
            <button class="btn number" onclick="appendToDisplay('0')">0</button>
            <button class="btn number" onclick="appendToDisplay('.')">.</button>
            <button class="btn equal" onclick="calculate()">=</button>
            <button class="btn function" onclick="appendToDisplay('sqrt(')">√</button>
            <button class="btn function" onclick="appendToDisplay('log(')">log</button>
            <button class="btn function" onclick="appendToDisplay('(')">(</button>
            <button class="btn function" onclick="appendToDisplay(')')">)</button>
        `;
    } else if (mode === 'converter') {
        buttonsDiv.innerHTML = `
            <button class="btn clear" onclick="clearDisplay()">C</button>
            <button class="btn backspace" onclick="backspace()">⌫</button>
            <button class="btn base-btn" onclick="convertToBase(2)">Bin</button>
            <button class="btn base-btn" onclick="convertToBase(8)">Oct</button>
            <button class="btn number" onclick="appendToDisplay('7')">7</button>
            <button class="btn number" onclick="appendToDisplay('8')">8</button>
            <button class="btn number" onclick="appendToDisplay('9')">9</button>
            <button class="btn base-btn" onclick="convertToBase(10)">Dec</button>
            <button class="btn number" onclick="appendToDisplay('4')">4</button>
            <button class="btn number" onclick="appendToDisplay('5')">5</button>
            <button class="btn number" onclick="appendToDisplay('6')">6</button>
            <button class="btn base-btn" onclick="convertToBase(16)">Hex</button>
            <button class="btn number" onclick="appendToDisplay('1')">1</button>
            <button class="btn number" onclick="appendToDisplay('2')">2</button>
            <button class="btn number" onclick="appendToDisplay('3')">3</button>
            <button class="btn number" onclick="appendToDisplay('0')">0</button>
            <button class="btn number" onclick="appendToDisplay('A')">A</button>
            <button class="btn number" onclick="appendToDisplay('B')">B</button>
            <button class="btn number" onclick="appendToDisplay('C')">C</button>
            <button class="btn number" onclick="appendToDisplay('D')">D</button>
            <button class="btn number" onclick="appendToDisplay('E')">E</button>
            <button class="btn number" onclick="appendToDisplay('F')">F</button>
        `;
    }
}

let sourceBase = 10;
let targetBase = 2;

function setSourceBase(base) {
    if (currentMode === 'converter') {
        sourceBase = base;
        updateBaseDisplay();
        clearDisplay();
    }
}

function convertToBase(targetBase) {
    const display = document.getElementById('display');
    const input = display.textContent.trim();

    if (!input) {
        display.textContent = 'Error: No input';
        return;
    }

    try {
        // Convert from source base to decimal first
        const decimal = parseInt(input, sourceBase);

        if (isNaN(decimal)) {
            display.textContent = 'Error: Invalid input';
            return;
        }

        // Convert from decimal to target base
        const result = decimal.toString(targetBase).toUpperCase();
        const conversion = `${input} (${sourceBase}) = ${result} (${targetBase})`;
        display.textContent = result;

        // Add to history
        history.unshift(conversion);
        if (history.length > 10) {
            history.pop();
        }
        updateHistory();
    } catch (error) {
        display.textContent = 'Error';
    }
}

function updateBaseDisplay() {
    if (currentMode === 'converter') {
        const baseInfo = document.getElementById('baseInfo');
        baseInfo.style.display = 'block';
        // Update button styles to show selected base
        const sourceButtons = document.querySelectorAll('.base-select');
        sourceButtons.forEach(btn => {
            const base = parseInt(btn.textContent.match(/\d+/)[0]);
            btn.classList.toggle('active', base === sourceBase);
        });
    } else {
        const baseInfo = document.getElementById('baseInfo');
        baseInfo.style.display = 'none';
    }
}

function convertBase() {
    const display = document.getElementById('display');
    const input = display.textContent.trim();

    if (!input) {
        display.textContent = 'Error: No input';
        return;
    }

    try {
        // Convert from source base to decimal first
        const decimal = parseInt(input, sourceBase);

        if (isNaN(decimal)) {
            display.textContent = 'Error: Invalid input';
            return;
        }

        // Convert from decimal to target base
        const result = decimal.toString(targetBase).toUpperCase();
        const conversion = `${input} (${sourceBase}) = ${result} (${targetBase})`;
        display.textContent = result;

        // Add to history
        history.unshift(conversion);
        if (history.length > 10) {
            history.pop();
        }
        updateHistory();
    } catch (error) {
        display.textContent = 'Error';
    }
}

function addCustomConstant() {
    const key = prompt('Enter constant name (e.g., myconst):');
    const value = prompt('Enter constant value:');
    if (key && value) {
        const customConstants = JSON.parse(localStorage.getItem('customConstants') || '{}');
        customConstants[key] = value;
        localStorage.setItem('customConstants', JSON.stringify(customConstants));
        alert(`Constant '${key}' added with value '${value}'`);
    }
}

function memoryPlus() {
    const display = document.getElementById('display');
    const value = parseFloat(display.textContent);
    if (!isNaN(value)) {
        memory[currentMemorySlot] += value;
        updateMemoryDisplay();
    }
}

function memoryMinus() {
    const display = document.getElementById('display');
    const value = parseFloat(display.textContent);
    if (!isNaN(value)) {
        memory[currentMemorySlot] -= value;
        updateMemoryDisplay();
    }
}

function memoryClear() {
    memory[currentMemorySlot] = 0;
    updateMemoryDisplay();
}

function memoryRecall() {
    const display = document.getElementById('display');
    display.textContent = memory[currentMemorySlot];
    highlightParentheses();
}

function memoryStore() {
    const display = document.getElementById('display');
    const value = parseFloat(display.textContent);
    if (!isNaN(value)) {
        memory[currentMemorySlot] = value;
        updateMemoryDisplay();
    }
}

function setMemorySlot(slot) {
    currentMemorySlot = slot - 1; // 0-based index
    updateMemoryDisplay();
}

function updateMemoryDisplay() {
    const memoryDiv = document.getElementById('memoryList');
    if (memoryDiv) {
        memoryDiv.innerHTML = '';
        memory.forEach((value, index) => {
            const li = document.createElement('li');
            li.textContent = `M${index + 1}: ${value}`;
            li.onclick = () => setMemorySlot(index + 1);
            if (index === currentMemorySlot) {
                li.classList.add('active');
            }
            memoryDiv.appendChild(li);
        });
    }
}

// Allow keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '^' || key === '.') {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        if (currentMode === 'basic') {
            calculate();
        } else {
            convertBase();
        }
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (currentMode === 'converter' && 'ABCDEFabcdef'.includes(key)) {
        appendToDisplay(key.toUpperCase());
    } else if (currentMode === 'basic' && key === 's') {
        appendToDisplay('sin(');
    } else if (currentMode === 'basic' && key === 'c') {
        appendToDisplay('cos(');
    } else if (currentMode === 'basic' && key === 't') {
        appendToDisplay('tan(');
    } else if (currentMode === 'basic' && key === 'l') {
        appendToDisplay('log(');
    } else if (currentMode === 'basic' && key === 'n') {
        appendToDisplay('ln(');
    } else if (currentMode === 'basic' && key === 'q') {
        appendToDisplay('sqrt(');
    } else if (currentMode === 'basic' && key === 'f') {
        appendToDisplay('fact(');
    } else if (currentMode === 'basic' && key === 'p') {
        appendToDisplay('pi');
    } else if (currentMode === 'basic' && key === 'e') {
        appendToDisplay('e');
    } else if (event.ctrlKey && key === 'c') {
        // Copy
        const display = document.getElementById('display');
        navigator.clipboard.writeText(display.textContent);
    } else if (event.ctrlKey && key === 'v') {
        // Paste
        navigator.clipboard.readText().then(text => {
            const display = document.getElementById('display');
            display.textContent = text;
            highlightParentheses();
        });
    }
});
