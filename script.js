// Find the screen where the calculator shows numbers and answers.
const display = document.getElementById('display');
const calculator = document.querySelector('.calculator');
let currentInput = '';
let startNewNumber = false;

// Match each button action to the work it should do.
const actions = {
    clear: () => setInput(''),
    delete: () => setInput(currentInput.slice(0, -1)),
    calculate: () => runCalculation(),
    sin: () => runCalculation(value => Math.sin(value * Math.PI / 180)),
    cos: () => runCalculation(value => Math.cos(value * Math.PI / 180)),
    tan: () => runCalculation(value => Math.tan(value * Math.PI / 180)),
    square: () => runCalculation(value => value ** 2)
};
function setInput(value) {
    currentInput = value;
    startNewNumber = false;
    display.value = currentInput;
}
function appendToDisplay(value) {
    if (startNewNumber && /^[0-9.]$/.test(value)) currentInput = '';
    setInput(currentInput + value);
}
function evaluateExpression(expression) {
    const valid = /^[0-9pi+\-*/^().\s]+$/i.test(expression);
    if (!valid) throw new Error('Invalid expression');

    const normalizedExpression = expression.replace(/\s+/g, '')
        .replace(/(\d|\)|pi)(?=\(|pi)/g, '$1*')
        .replace(/(\)|pi)(?=\d|\()/g, '$1*')
        .replace(/\^/g, '**');
    return Function('pi', `return (${normalizedExpression});`)(Math.PI);
}
function runCalculation(operation) {
    try {
        let result = evaluateExpression(currentInput);
        // Scientific buttons transform the current answer before it is shown.
        if (operation) result = operation(result);
        if (!Number.isFinite(result)) throw new Error('Invalid result');
        setInput(String(Number(result.toPrecision(12))));
        startNewNumber = true;
    } catch {
        setInput('');
        display.value = 'Error';
    }
}
calculator.addEventListener('click', event => {
    const button = event.target.closest('button');
    const action = actions[button?.dataset.action];
    if (action) action();
    else if (button) appendToDisplay(button.dataset.value);
});
