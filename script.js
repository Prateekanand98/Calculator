// ========== UNIT CONVERSION HELPERS ==========

function getUnitMultiplier() {
    // Multiplier between meters and centimeters for lengths
    return 100; // 1 m = 100 cm
}

function convertLength(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    const m = getUnitMultiplier();
    if (fromUnit === 'cm' && toUnit === 'm') return value / m;
    if (fromUnit === 'm' && toUnit === 'cm') return value * m;
    return value;
}

function convertArea(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    const m = getUnitMultiplier();
    if (fromUnit === 'cm' && toUnit === 'm') return value / (m * m);
    if (fromUnit === 'm' && toUnit === 'cm') return value * (m * m);
    return value;
}

function convertVolume(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    const m = getUnitMultiplier();
    if (fromUnit === 'cm' && toUnit === 'm') return value / (m * m * m);
    if (fromUnit === 'm' && toUnit === 'cm') return value * (m * m * m);
    return value;
}

function formatUnitDisplay(value, label, unit, conversionFunc) {
    // Display result in both units
    const valueInCm = conversionFunc(value, unit, 'cm');
    const valueInM = conversionFunc(value, unit, 'm');
    return `<strong>${label}:</strong> ${formatResult(valueInCm)} ${unit === 'cm' ? 'cm' : 'cm'}² / ${formatResult(valueInM)} ${unit === 'm' ? 'm' : 'm'}²`;
}

function formatUnitDisplay3D(value, label, unit, conversionFunc) {
    // Display result in both units for 3D (volume/area)
    const valueInCm = conversionFunc(value, unit, 'cm');
    const valueInM = conversionFunc(value, unit, 'm');
    const unit3D = label.includes('Volume') ? '³' : '²';
    return `<strong>${label}:</strong> ${formatResult(valueInCm)} ${unit === 'cm' ? 'cm' : 'cm'}${unit3D} / ${formatResult(valueInM)} ${unit === 'm' ? 'm' : 'm'}${unit3D}`;
}

// ========== TAB SWITCHING ==========

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show the selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Mark the clicked button as active (use safe event reference)
    const evt = (typeof event !== 'undefined') ? event : window.event;
    if (evt && evt.target) evt.target.classList.add('active');
    
    // Reset sub-tabs if they exist
    const firstSubTab = selectedTab.querySelector('.sub-tab-content');
    if (firstSubTab) {
        const subTabContents = selectedTab.querySelectorAll('.sub-tab-content');
        subTabContents.forEach(tab => tab.classList.remove('active'));
        subTabContents[0].classList.add('active');
        
        const subTabButtons = selectedTab.querySelectorAll('.sub-tab-btn');
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        subTabButtons[0].classList.add('active');
    }
}

function switchSubTab(parentTabId, subTabName) {
    const parentTab = document.getElementById(parentTabId);
    
    // Hide all sub-tab contents within this parent
    const subTabContents = parentTab.querySelectorAll('.sub-tab-content');
    subTabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all sub-tab buttons
    const subTabButtons = parentTab.querySelectorAll('.sub-tab-btn');
    subTabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show the selected sub-tab
    const selectedSubTab = parentTab.querySelector('#' + subTabName);
    if (selectedSubTab) {
        selectedSubTab.classList.add('active');
    }
    
    // Mark the clicked button as active (use safe event reference)
    const evt = (typeof event !== 'undefined') ? event : window.event;
    if (evt && evt.target) evt.target.classList.add('active');
}

// Utility function to display results
function showResult(elementId, message, isSuccess = true) {
    const resultDiv = document.getElementById(elementId);
    if (!resultDiv) return;
    resultDiv.innerHTML = message;
    resultDiv.classList.add('show');
    resultDiv.classList.toggle('success', isSuccess);
    resultDiv.classList.toggle('error', !isSuccess);

    // rotate background on successful calculation
    if (isSuccess) rotateBackground();
    
    // Show copy button for arithmetic operations
    if (isSuccess && (elementId === 'addResult' || elementId === 'subResult' || elementId === 'mulResult' || elementId === 'divResult')) {
        const copyBtnId = elementId.replace('Result', '') + (elementId === 'mulResult' ? 'Mul' : '') + 'Btn';
        let actualId = '';
        if (elementId === 'addResult') actualId = 'copyAddBtn';
        else if (elementId === 'subResult') actualId = 'copySubBtn';
        else if (elementId === 'mulResult') actualId = 'copyMulBtn';
        else if (elementId === 'divResult') actualId = 'copyDivBtn';
        
        const copyBtn = document.getElementById(actualId);
        if (copyBtn) {
            copyBtn.style.display = 'block';
        }
    }
}

// Validation function
function validateInputs(...values) {
    for (let val of values) {
        if (val === '' || val === null || isNaN(parseFloat(val))) {
            return false;
        }
    }
    return true;
}

// Format number: up to 10 decimals, remove trailing zeros
function formatResult(num) {
    // Round to 10 decimal places
    const rounded = Math.round(num * 10000000000) / 10000000000;
    
    // Convert to string and handle display
    const str = rounded.toString();
    
    // If it's an integer (no decimal point or ends with .0), return as integer
    if (Number.isInteger(rounded)) {
        return rounded.toString();
    }
    
    // Otherwise return with up to 10 decimal places (trailing zeros removed)
    return str;
}

// ========== BACKGROUND ROTATION HELPERS ==========
const _bgGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #a78bfa 0%, #f97316 100%)',
    'linear-gradient(135deg, #60a5fa 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #fda085 0%, #f6d365 100%)',
    'linear-gradient(135deg, #84cc16 0%, #22c1c3 100%)'
];

let _bgIndex = Number(localStorage.getItem('calcBgIndex')) || 0;

function rotateBackground() {
    try {
        _bgIndex = (_bgIndex + 1) % _bgGradients.length;
        localStorage.setItem('calcBgIndex', _bgIndex);
        document.body.style.background = _bgGradients[_bgIndex];
        document.body.classList.add('bg-pulse');
        setTimeout(() => document.body.classList.remove('bg-pulse'), 700);
    } catch (e) {
        // fail silently if DOM not ready
    }
}

// ========== ADDITION HELPERS ==========
let additionTerms = [];

function addAdditionTerm() {
    const input = document.getElementById('addNewInput');
    const value = input.value.trim();
    
    if (!value) {
        alert('Please enter a number');
        return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (additionTerms.length >= 100) {
        alert('Maximum 100 terms allowed');
        return;
    }
    
    additionTerms.push(numValue);
    input.value = '';
    input.focus();
    updateAdditionDisplay();
}

function removeAdditionTerm(index) {
    additionTerms.splice(index, 1);
    updateAdditionDisplay();
}

function updateAdditionDisplay() {
    const display = document.getElementById('addTermsDisplay');
    
    if (additionTerms.length === 0) {
        display.innerHTML = '<span style="color: #999;">Enter numbers to add...</span>';
        return;
    }

    let html = '';
    additionTerms.forEach((term, index) => {
        if (index > 0) {
            html += '<span class="plus-sign">+</span>';
        }
        html += `<span class="term">
            <span class="term-value">${term}</span>
            <button class="term-delete" onclick="removeAdditionTerm(${index})">✕</button>
        </span>`;
    });

    display.innerHTML = html;
}

function calculateAddition() {
    if (additionTerms.length === 0) {
        showResult('addResult', 'Please enter at least one number', false);
        return;
    }
    
    const sum = additionTerms.reduce((acc, num) => acc + num, 0);
    const resultText = additionTerms.join(' + ');
    showResult('addResult', `${resultText} = <strong>${formatResult(sum)}</strong>`);
}

function clearAddition() {
    additionTerms = [];
    document.getElementById('addNewInput').value = '';
    updateAdditionDisplay();
    const res = document.getElementById('addResult');
    if (res) {
        res.classList.remove('show');
    }
    const copyBtn = document.getElementById('copyAddBtn');
    if (copyBtn) {
        copyBtn.style.display = 'none';
    }
}

function continueAddition() {
    if (additionTerms.length === 0) {
        alert('Please calculate first');
        return;
    }
    const sum = additionTerms.reduce((acc, num) => acc + num, 0);
    additionTerms = [sum];
    updateAdditionDisplay();
    document.getElementById('addNewInput').value = '';
    document.getElementById('addNewInput').focus();
}

function copyAddResult() {
    const resultDiv = document.getElementById('addResult');
    const resultText = resultDiv.innerText;
    const cleanResult = resultText.split('=')[1].trim();
    navigator.clipboard.writeText(cleanResult).then(() => {
        alert('Result copied: ' + cleanResult);
    });
}

// ========== SUBTRACTION HELPERS ==========
let subtractionTerms = [];

function addSubtractionTerm() {
    const input = document.getElementById('subNewInput');
    const value = input.value.trim();
    
    if (!value) {
        alert('Please enter a number');
        return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (subtractionTerms.length >= 100) {
        alert('Maximum 100 terms allowed');
        return;
    }
    
    subtractionTerms.push(numValue);
    input.value = '';
    input.focus();
    updateSubtractionDisplay();
}

function removeSubtractionTerm(index) {
    subtractionTerms.splice(index, 1);
    updateSubtractionDisplay();
}

function updateSubtractionDisplay() {
    const display = document.getElementById('subTermsDisplay');
    
    if (subtractionTerms.length === 0) {
        display.innerHTML = '<span style="color: #999;">Enter numbers to subtract...</span>';
        return;
    }
    
    let html = '';
    subtractionTerms.forEach((term, index) => {
        if (index > 0) {
            html += '<span class="plus-sign">−</span>';
        }
        html += `<span class="term">
            <span class="term-value">${term}</span>
            <button class="term-delete" onclick="removeSubtractionTerm(${index})">✕</button>
        </span>`;
    });
    
    display.innerHTML = html;
}

function calculateSubtraction() {
    if (subtractionTerms.length === 0) {
        showResult('subResult', 'Please enter at least one number', false);
        return;
    }
    
    const result = subtractionTerms.reduce((acc, num, idx) => {
        return idx === 0 ? num : acc - num;
    }, 0);
    
    const resultText = subtractionTerms.join(' − ');
    showResult('subResult', `${resultText} = <strong>${formatResult(result)}</strong>`);
}

function clearSubtraction() {
    subtractionTerms = [];
    document.getElementById('subNewInput').value = '';
    updateSubtractionDisplay();
    const res = document.getElementById('subResult');
    if (res) {
        res.classList.remove('show');
    }
    const copyBtn = document.getElementById('copySubBtn');
    if (copyBtn) {
        copyBtn.style.display = 'none';
    }
}

function continueSubtraction() {
    if (subtractionTerms.length === 0) {
        alert('Please calculate first');
        return;
    }
    const result = subtractionTerms.reduce((acc, num, idx) => {
        return idx === 0 ? num : acc - num;
    }, 0);
    subtractionTerms = [result];
    updateSubtractionDisplay();
    document.getElementById('subNewInput').value = '';
    document.getElementById('subNewInput').focus();
}

function copySubResult() {
    const resultDiv = document.getElementById('subResult');
    const resultText = resultDiv.innerText;
    const cleanResult = resultText.split('=')[1].trim();
    navigator.clipboard.writeText(cleanResult).then(() => {
        alert('Result copied: ' + cleanResult);
    });
}

// ========== MULTIPLICATION HELPERS ==========
let multiplicationTerms = [];

function addMultiplicationTerm() {
    const input = document.getElementById('mulNewInput');
    const value = input.value.trim();
    
    if (!value) {
        alert('Please enter a number');
        return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (multiplicationTerms.length >= 100) {
        alert('Maximum 100 terms allowed');
        return;
    }
    
    multiplicationTerms.push(numValue);
    input.value = '';
    input.focus();
    updateMultiplicationDisplay();
}

function removeMultiplicationTerm(index) {
    multiplicationTerms.splice(index, 1);
    updateMultiplicationDisplay();
}

function updateMultiplicationDisplay() {
    const display = document.getElementById('mulTermsDisplay');
    
    if (multiplicationTerms.length === 0) {
        display.innerHTML = '<span style="color: #999;">Enter numbers to multiply...</span>';
        return;
    }
    
    let html = '';
    multiplicationTerms.forEach((term, index) => {
        if (index > 0) {
            html += '<span class="plus-sign">×</span>';
        }
        html += `<span class="term">
            <span class="term-value">${term}</span>
            <button class="term-delete" onclick="removeMultiplicationTerm(${index})">✕</button>
        </span>`;
    });
    
    display.innerHTML = html;
}

function calculateMultiplication() {
    if (multiplicationTerms.length === 0) {
        showResult('mulResult', 'Please enter at least one number', false);
        return;
    }
    
    const result = multiplicationTerms.reduce((product, num) => product * num, 1);
    const resultText = multiplicationTerms.join(' × ');
    showResult('mulResult', `${resultText} = <strong>${formatResult(result)}</strong>`);
}

function clearMultiplication() {
    multiplicationTerms = [];
    document.getElementById('mulNewInput').value = '';
    updateMultiplicationDisplay();
    const res = document.getElementById('mulResult');
    if (res) {
        res.classList.remove('show');
    }
    const copyBtn = document.getElementById('copyMulBtn');
    if (copyBtn) {
        copyBtn.style.display = 'none';
    }
}

function continueMultiplication() {
    if (multiplicationTerms.length === 0) {
        alert('Please calculate first');
        return;
    }
    const result = multiplicationTerms.reduce((product, num) => product * num, 1);
    multiplicationTerms = [result];
    updateMultiplicationDisplay();
    document.getElementById('mulNewInput').value = '';
    document.getElementById('mulNewInput').focus();
}

function copyMulResult() {
    const resultDiv = document.getElementById('mulResult');
    const resultText = resultDiv.innerText;
    const cleanResult = resultText.split('=')[1].trim();
    navigator.clipboard.writeText(cleanResult).then(() => {
        alert('Result copied: ' + cleanResult);
    });
}

// Division helpers
let divisionTerms = [];

function addDivisionTerm() { const input = document.getElementById('divNewInput'); const value = input.value.trim(); if (!value || isNaN(value)) { alert('Please enter a valid number'); return; } if (divisionTerms.length >= 100) { alert('Maximum 100 terms allowed'); return; } divisionTerms.push(parseFloat(value)); input.value=''; input.focus(); updateDivisionDisplay(); }

function removeDivisionTerm(index) { divisionTerms.splice(index,1); updateDivisionDisplay(); }

function updateDivisionDisplay() {
    const display = document.getElementById('divTermsDisplay');
    if (divisionTerms.length === 0) { display.innerHTML = '<span style="color:#999;">Enter numbers to divide...</span>'; return; }
    let html = '';
    divisionTerms.forEach((term,index) => {
        if (index>0) html += '<span class="plus-sign">÷</span>';
        html += `<span class="term"><span class="term-value">${term}</span><button class="term-delete" onclick="removeDivisionTerm(${index})">✕</button></span>`;
    });
    display.innerHTML = html;
}

function calculateDivision() {
    if (divisionTerms.length === 0) {
        showResult('divResult', 'Please enter at least one number', false);
        return;
    }
    for (let i = 1; i < divisionTerms.length; i++) {
        if (divisionTerms[i] === 0) {
            showResult('divResult', 'Cannot divide by zero', false);
            return;
        }
    }
    const result = divisionTerms.reduce((quotient, num, idx) => idx === 0 ? num : quotient / num, 0);
    showResult('divResult', `${divisionTerms.join(' ÷ ')} = <strong>${formatResult(result)}</strong>`);
}

function clearDivision() {
    divisionTerms = [];
    document.getElementById('divNewInput').value = '';
    updateDivisionDisplay();
    const res = document.getElementById('divResult');
    if (res) {
        res.classList.remove('show');
    }
    const copyBtn = document.getElementById('copyDivBtn');
    if (copyBtn) {
        copyBtn.style.display = 'none';
    }
}

function continueDivision() {
    if (divisionTerms.length === 0) {
        alert('Please calculate first');
        return;
    }
    for (let i = 1; i < divisionTerms.length; i++) {
        if (divisionTerms[i] === 0) {
            alert('Cannot divide by zero');
            return;
        }
    }
    const result = divisionTerms.reduce((quotient, num, idx) => idx === 0 ? num : quotient / num, 0);
    divisionTerms = [result];
    updateDivisionDisplay();
    document.getElementById('divNewInput').value = '';
    document.getElementById('divNewInput').focus();
}

function copyDivResult() {
    const resultDiv = document.getElementById('divResult');
    const resultText = resultDiv.innerText;
    const cleanResult = resultText.split('=')[1].trim();
    navigator.clipboard.writeText(cleanResult).then(() => {
        alert('Result copied: ' + cleanResult);
    });
}

// ========== FINANCIAL CALCULATORS ==========

function calculateSI() {
    // Gather raw values (empty string stays empty)
    const principalRaw = document.getElementById('siPrincipal').value.trim();
    const rateRaw = document.getElementById('siRate').value.trim();
    const timeRaw = document.getElementById('siTime').value.trim();
    const interestRaw = document.getElementById('siInterest').value.trim();
    const amountRaw = document.getElementById('siAmount').value.trim();

    // Helper to parse or return null
    const toNum = v => (v === '' ? null : parseFloat(v));
    const P = toNum(principalRaw);
    const R = toNum(rateRaw);
    const T = toNum(timeRaw);
    const SI = toNum(interestRaw);
    const A = toNum(amountRaw);

    // Count how many are missing
    const provided = [P, R, T, SI, A].filter(x => x !== null).length;
    if (provided < 4) {
        showResult('siResult', 'Please provide at least four of the five fields so the missing one can be calculated.', false);
        return;
    }

    // Compute based on which field is missing
    try {
        let resultHTML = '';

        if (SI === null) {
            // Compute simple interest
            if (P !== null && R !== null && T !== null) {
                const si = (P * R * T) / 100;
                const amt = P + si;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(si)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else if (A !== null && P !== null) {
                const si = A - P;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Simple Interest (from Amount - Principal):</strong> ₹${formatResult(si)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(A)}`;
            } else if (A !== null && R !== null && T !== null) {
                const Pcalc = A / (1 + (R * T) / 100);
                const si = A - Pcalc;
                resultHTML = `<strong>Principal (derived):</strong> ₹${formatResult(Pcalc)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(si)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(A)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Simple Interest.', false);
                return;
            }
        } else if (A === null) {
            // Compute amount
            if (P !== null && R !== null && T !== null) {
                const si = (P * R * T) / 100;
                const amt = P + si;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(si)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else if (P !== null && SI !== null) {
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(SI)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Amount.', false);
                return;
            }
        } else if (P === null) {
            // Compute principal
            if (SI !== null && R !== null && T !== null) {
                const Pcalc = (SI * 100) / (R * T);
                const amt = Pcalc + SI;
                resultHTML = `<strong>Principal (derived):</strong> ₹${formatResult(Pcalc)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(SI)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else if (A !== null && SI !== null) {
                const Pcalc = A - SI;
                resultHTML = `<strong>Principal (from Amount - Interest):</strong> ₹${formatResult(Pcalc)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(SI)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(A)}`;
            } else if (A !== null && R !== null && T !== null) {
                const Pcalc = A / (1 + (R * T) / 100);
                const si = A - Pcalc;
                resultHTML = `<strong>Principal (derived):</strong> ₹${formatResult(Pcalc)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(si)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(A)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Principal.', false);
                return;
            }
        } else if (R === null) {
            // Compute rate
            if (SI !== null && P !== null && T !== null && P !== 0 && T !== 0) {
                const Rcalc = (SI * 100) / (P * T);
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Rate (derived):</strong> ${formatResult(Rcalc)}% per annum<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(SI)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Rate.', false);
                return;
            }
        } else if (T === null) {
            // Compute time
            if (SI !== null && P !== null && R !== null && P !== 0 && R !== 0) {
                const Tcalc = (SI * 100) / (P * R);
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                             `<strong>Time (derived):</strong> ${formatResult(Tcalc)} years<br>` +
                             `<strong>Simple Interest:</strong> ₹${formatResult(SI)}<br>` +
                             `<strong>Total Amount:</strong> ₹${formatResult(amt)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Time.', false);
                return;
            }
        } else {
            // All provided: just show consistency
            const si = (P * R * T) / 100;
            const amt = P + si;
            resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>` +
                         `<strong>Simple Interest (calculated):</strong> ₹${formatResult(si)}<br>` +
                         `<strong>Total Amount (calculated):</strong> ₹${formatResult(amt)}`;
        }

        showResult('siResult', resultHTML);
    } catch (err) {
        showResult('siResult', 'An error occurred while computing. Check inputs.', false);
    }
}

function clearSIFields() {
    ['siPrincipal','siRate','siTime','siInterest','siAmount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const res = document.getElementById('siResult');
    if (res) res.classList.remove('show');
}

function calculateCI() {
    const principal = document.getElementById('ciPrincipal').value;
    const rate = document.getElementById('ciRate').value;
    const time = document.getElementById('ciTime').value;
    const frequency = document.getElementById('ciFrequency').value;
    
    if (!validateInputs(principal, rate, time)) {
        showResult('ciResult', 'Please enter valid numbers', false);
        return;
    }
    
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);
    const n = parseFloat(frequency);
    
    const amount = P * Math.pow((1 + R / (100 * n)), n * T);
    const CI = amount - P;
    
    const resultHTML = `<strong>Principal:</strong> ₹${formatResult(P)}<br>
                       <strong>Compound Interest:</strong> ₹${formatResult(CI)}<br>
                       <strong>Total Amount:</strong> ₹${formatResult(amount)}`;
    showResult('ciResult', resultHTML);
}

function clearCIFields() {
    ['ciPrincipal','ciRate','ciTime','ciFrequency','ciInterest','ciAmount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const res = document.getElementById('ciResult'); if (res) res.classList.remove('show');
}

// ========== PROFIT & LOSS, DISCOUNT, RATIO HELPERS ==========
function calculateProfitLoss() {
    const cpRaw = document.getElementById('plCost').value.trim();
    const spRaw = document.getElementById('plSell').value.trim();
    const profitAmtRaw = document.getElementById('plProfitAmt')?.value.trim() || '';
    const profitPctRaw = document.getElementById('plProfitPercent')?.value.trim() || '';
    const toNum = v => (v === '' ? null : parseFloat(v));
    const cp = toNum(cpRaw);
    const sp = toNum(spRaw);
    const profitAmt = toNum(profitAmtRaw);
    const profitPct = toNum(profitPctRaw);

    // We need at least two provided to compute the others
    const provided = [cp, sp, profitAmt, profitPct].filter(x => x !== null).length;
    if (provided < 2) {
        showResult('plResult', 'Please provide at least two of: CP, SP, Profit Amount, Profit %', false);
        return;
    }

    try {
        // Case 1: CP and SP given -> compute profit / loss
        if (cp !== null && sp !== null) {
            if (cp <= 0) { showResult('plResult', 'Cost Price must be > 0', false); return; }
            const diff = sp - cp;
            const pct = (diff / cp) * 100;
            if (diff >= 0) {
                const resultHTML = `<strong>Profit Amount:</strong> ${formatResult(diff)}<br>` +
                                   `<strong>Profit (%):</strong> ${formatResult(pct)}%`;
                showResult('plResult', resultHTML);
                return;
            } else {
                const resultHTML = `<strong>Loss Amount:</strong> ${formatResult(Math.abs(diff))}<br>` +
                                   `<strong>Loss (%):</strong> ${formatResult(Math.abs(pct))}%`;
                showResult('plResult', resultHTML);
                return;
            }
        }

        // Case 2: SP and Profit Amount given -> compute CP
        if (sp !== null && profitAmt !== null && cp === null) {
            if (profitAmt > sp) { showResult('plResult', 'Profit Amount cannot be bigger than Selling Price.', false); return; }
            const cpCalc = sp - profitAmt;
            if (cpCalc <= 0) { showResult('plResult', 'Computed Cost Price is <= 0; check inputs.', false); return; }
            const pct = (profitAmt / cpCalc) * 100;
            const resultHTML = `<strong>Cost Price (derived):</strong> ${formatResult(cpCalc)}<br>` +
                               `<strong>Profit Amount:</strong> ${formatResult(profitAmt)}<br>` +
                               `<strong>Profit (%):</strong> ${formatResult(pct)}%`;
            showResult('plResult', resultHTML);
            return;
        }

        // Case 3: SP and Profit % given -> compute CP
        if (sp !== null && profitPct !== null && cp === null) {
            if (profitPct <= -100) { showResult('plResult', 'Invalid Profit %', false); return; }
            const cpCalc = sp / (1 + profitPct / 100);
            if (!isFinite(cpCalc) || cpCalc <= 0) { showResult('plResult', 'Computed Cost Price invalid; check inputs.', false); return; }
            const profitAmtCalc = sp - cpCalc;
            const resultHTML = `<strong>Cost Price (derived):</strong> ${formatResult(cpCalc)}<br>` +
                               `<strong>Profit Amount:</strong> ${formatResult(profitAmtCalc)}<br>` +
                               `<strong>Profit (%):</strong> ${formatResult(profitPct)}%`;
            showResult('plResult', resultHTML);
            return;
        }

        // Case 4: CP and Profit Amount given -> compute SP
        if (cp !== null && profitAmt !== null && sp === null) {
            if (cp <= 0) { showResult('plResult', 'Cost Price must be > 0', false); return; }
            const spCalc = cp + profitAmt;
            const pct = (profitAmt / cp) * 100;
            const resultHTML = `<strong>Selling Price (derived):</strong> ${formatResult(spCalc)}<br>` +
                               `<strong>Profit Amount:</strong> ${formatResult(profitAmt)}<br>` +
                               `<strong>Profit (%):</strong> ${formatResult(pct)}%`;
            showResult('plResult', resultHTML);
            return;
        }

        // Case 5: CP and Profit % given -> compute SP
        if (cp !== null && profitPct !== null && sp === null) {
            if (cp <= 0) { showResult('plResult', 'Cost Price must be > 0', false); return; }
            const spCalc = cp * (1 + profitPct / 100);
            const profitAmtCalc = spCalc - cp;
            const resultHTML = `<strong>Selling Price (derived):</strong> ${formatResult(spCalc)}<br>` +
                               `<strong>Profit Amount:</strong> ${formatResult(profitAmtCalc)}<br>` +
                               `<strong>Profit (%):</strong> ${formatResult(profitPct)}%`;
            showResult('plResult', resultHTML);
            return;
        }

        // Case 6: Profit Amount and Profit % given -> compute CP and SP
        if (profitAmt !== null && profitPct !== null && cp === null && sp === null) {
            if (profitPct === 0) { showResult('plResult', 'Profit % cannot be zero when deriving CP/SP from profit amount.', false); return; }
            const cpCalc = (profitAmt * 100) / profitPct;
            const spCalc = cpCalc + profitAmt;
            if (cpCalc <= 0) { showResult('plResult', 'Computed Cost Price invalid; check inputs.', false); return; }
            const resultHTML = `<strong>Cost Price (derived):</strong> ${formatResult(cpCalc)}<br>` +
                               `<strong>Selling Price (derived):</strong> ${formatResult(spCalc)}<br>` +
                               `<strong>Profit Amount:</strong> ${formatResult(profitAmt)}<br>` +
                               `<strong>Profit (%):</strong> ${formatResult(profitPct)}%`;
            showResult('plResult', resultHTML);
            return;
        }

        showResult('plResult', 'Unsupported/insufficient combination to compute. Provide any two of CP, SP, Profit Amount, Profit %.', false);
    } catch (err) {
        showResult('plResult', 'An error occurred while computing Profit & Loss. Check inputs.', false);
    }
}

function clearPLFields() {
    ['plCost','plSell','plProfitAmt','plProfitPercent'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const res = document.getElementById('plResult'); if (res) res.classList.remove('show');
}

function calculateDiscount() {
    const mpRaw = document.getElementById('discMP').value.trim();
    const pctRaw = document.getElementById('discPercent').value.trim();
    const amtRaw = document.getElementById('discAmount')?.value.trim() || '';
    const spRaw = document.getElementById('discSP')?.value.trim() || '';
    const toNum = v => (v === '' ? null : parseFloat(v));
    const mp = toNum(mpRaw);
    const pct = toNum(pctRaw);
    const discAmt = toNum(amtRaw);
    const sp = toNum(spRaw);

    const provided = [mp, pct, discAmt, sp].filter(x => x !== null).length;
    if (provided < 2) {
        showResult('discountResult', 'Please provide at least two of: Marked Price, Discount %, Discount Amount, Selling Price', false);
        return;
    }

    try {
        // Case A: MP and % given -> compute amount and SP
        if (mp !== null && pct !== null) {
            if (mp < 0) { showResult('discountResult', 'Marked Price must be non-negative', false); return; }
            if (pct < 0 || pct >= 100) { showResult('discountResult', 'Discount % must be between 0 and 100.', false); return; }
            const disc = (mp * pct) / 100;
            const spCalc = mp - disc;
            const resultHTML = `<strong>Discount (%):</strong> ${formatResult(pct)}%<br>` +
                               `<strong>Discount Amount:</strong> ${formatResult(disc)}<br>` +
                               `<strong>Selling Price:</strong> ${formatResult(spCalc)}`;
            showResult('discountResult', resultHTML);
            return;
        }

        // Case B: MP and Discount Amount given -> compute % and SP
        if (mp !== null && discAmt !== null) {
            if (mp <= 0) { showResult('discountResult', 'Marked Price must be > 0', false); return; }
            if (discAmt < 0) { showResult('discountResult', 'Discount Amount cannot be negative.', false); return; }
            if (discAmt > mp) { showResult('discountResult', 'Discount Amount cannot be bigger than Marked Price.', false); return; }
            const pctCalc = (discAmt / mp) * 100;
            const spCalc = mp - discAmt;
            const resultHTML = `<strong>Discount Amount:</strong> ${formatResult(discAmt)}<br>` +
                               `<strong>Discount (%):</strong> ${formatResult(pctCalc)}%<br>` +
                               `<strong>Selling Price:</strong> ${formatResult(spCalc)}`;
            showResult('discountResult', resultHTML);
            return;
        }

        // Case B2: MP and SP given -> compute discount amount and %
        if (mp !== null && sp !== null) {
            if (mp < 0) { showResult('discountResult', 'Marked Price must be non-negative', false); return; }
            if (sp > mp) { showResult('discountResult', 'Selling Price cannot be bigger than Marked Price.', false); return; }
            const disc = mp - sp;
            const pctCalc = mp === 0 ? 0 : (disc / mp) * 100;
            const resultHTML = `<strong>Marked Price:</strong> ${formatResult(mp)}<br>` +
                               `<strong>Selling Price:</strong> ${formatResult(sp)}<br>` +
                               `<strong>Discount Amount:</strong> ${formatResult(disc)}<br>` +
                               `<strong>Discount (%):</strong> ${formatResult(pctCalc)}%`;
            showResult('discountResult', resultHTML);
            return;
        }

        // Case C: SP and Discount Amount given -> compute MP and %
        if (sp !== null && discAmt !== null) {
            if (discAmt < 0) { showResult('discountResult', 'Discount Amount cannot be negative.', false); return; }
            if (sp <= 0) { showResult('discountResult', 'Selling Price must be > 0.', false); return; }
            const mpCalc = sp + discAmt;
            if (mpCalc <= 0) { showResult('discountResult', 'Computed Marked Price invalid; check inputs.', false); return; }
            const pctCalc = (discAmt / mpCalc) * 100;
            const resultHTML = `<strong>Marked Price (derived):</strong> ${formatResult(mpCalc)}<br>` +
                               `<strong>Discount Amount:</strong> ${formatResult(discAmt)}<br>` +
                               `<strong>Discount (%):</strong> ${formatResult(pctCalc)}%<br>` +
                               `<strong>Selling Price:</strong> ${formatResult(sp)}`;
            showResult('discountResult', resultHTML);
            return;
        }

        // Case D: SP and % given -> compute MP and Discount Amount
        if (sp !== null && pct !== null) {
            if (pct >= 100) { showResult('discountResult', 'Discount % must be < 100', false); return; }
            const mpCalc = sp / (1 - pct / 100);
            if (!isFinite(mpCalc) || mpCalc <= 0) { showResult('discountResult', 'Computed Marked Price invalid; check inputs.', false); return; }
            const discCalc = mpCalc - sp;
            const resultHTML = `<strong>Marked Price (derived):</strong> ${formatResult(mpCalc)}<br>` +
                               `<strong>Discount (%):</strong> ${formatResult(pct)}%<br>` +
                               `<strong>Discount Amount:</strong> ${formatResult(discCalc)}<br>` +
                               `<strong>Selling Price:</strong> ${formatResult(sp)}`;
            showResult('discountResult', resultHTML);
            return;
        }

        // Case E: Discount Amount and % given -> compute MP and SP
        if (discAmt !== null && pct !== null) {
            if (discAmt < 0) { showResult('discountResult', 'Discount Amount cannot be negative.', false); return; }
            if (pct <= 0 || pct >= 100) { showResult('discountResult', 'Discount % must be between 0 and 100.', false); return; }
            const mpCalc = (discAmt * 100) / pct;
            const spCalc = mpCalc - discAmt;
            const resultHTML = `<strong>Marked Price (derived):</strong> ${formatResult(mpCalc)}<br>` +
                               `<strong>Discount Amount:</strong> ${formatResult(discAmt)}<br>` +
                               `<strong>Discount (%):</strong> ${formatResult(pct)}%<br>` +
                               `<strong>Selling Price (derived):</strong> ${formatResult(spCalc)}`;
            showResult('discountResult', resultHTML);
            return;
        }

        showResult('discountResult', 'Unsupported/insufficient combination to compute. Provide two known values.', false);
    } catch (err) {
        showResult('discountResult', 'An error occurred while computing Discount. Check inputs.', false);
    }
}

function clearDiscountFields() {
    ['discMP','discPercent','discAmount','discSP'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const res = document.getElementById('discountResult'); if (res) res.classList.remove('show');
}

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    if (b === 0) return a;
    while (b) {
        const t = b; b = a % b; a = t;
    }
    return a;
}

function calculateRatio() {
    const aRaw = document.getElementById('ratioA').value.trim();
    const bRaw = document.getElementById('ratioB').value.trim();
    const toNum = v => (v === '' ? null : parseInt(v, 10));
    const a = toNum(aRaw);
    const b = toNum(bRaw);
    if (a === null || b === null) {
        showResult('ratioResult', 'Please enter both numbers', false);
        return;
    }
    if (b === 0) { showResult('ratioResult', 'Second number must not be zero', false); return; }
    const g = gcd(a, b) || 1;
    const na = a / g; const nb = b / g;
    showResult('ratioResult', `<strong>Ratio:</strong> ${na} : ${nb}`);
}

function clearRatioFields() {
    ['ratioA','ratioB'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const res = document.getElementById('ratioResult'); if (res) res.classList.remove('show');
}

// ========== 2D SHAPES - AREA ==========

function calculateCircleArea() {
    const radiusRaw = document.getElementById('circleRadius').value.trim();
    const areaRaw = document.getElementById('circleArea')?.value.trim() || '';
    const unit = document.getElementById('circleUnit').value;
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const area = toNum(areaRaw);
    
    if (r !== null) {
        const computedArea = Math.PI * r * r;
        const radiusCm = convertLength(r, unit, 'cm');
        const radiusM = convertLength(r, unit, 'm');
        const areaCm = convertArea(computedArea, unit, 'cm');
        const areaM = convertArea(computedArea, unit, 'm');
        
        const resultHTML = `<strong>Radius:</strong> ${formatResult(radiusCm)} cm / ${formatResult(radiusM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('circleAreaResult', resultHTML);
    } else if (area !== null && area > 0) {
        const computedRadius = Math.sqrt(area / Math.PI);
        const radiusCm = convertLength(computedRadius, unit, 'cm');
        const radiusM = convertLength(computedRadius, unit, 'm');
        const areaCm = convertArea(area, unit, 'cm');
        const areaM = convertArea(area, unit, 'm');
        
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(radiusCm)} cm / ${formatResult(radiusM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('circleAreaResult', resultHTML);
    } else {
        showResult('circleAreaResult', 'Please enter a valid Radius or Area', false);
    }
}

function calculateSquareArea() {
    const sideRaw = document.getElementById('squareSide').value.trim();
    const areaRaw = document.getElementById('squareArea')?.value.trim() || '';
    const unit = document.getElementById('squareUnit').value;
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const s = toNum(sideRaw);
    const area = toNum(areaRaw);
    
    if (s !== null && s > 0) {
        const computedArea = s * s;
        const sideCm = convertLength(s, unit, 'cm');
        const sideM = convertLength(s, unit, 'm');
        const areaCm = convertArea(computedArea, unit, 'cm');
        const areaM = convertArea(computedArea, unit, 'm');
        
        const resultHTML = `<strong>Side:</strong> ${formatResult(sideCm)} cm / ${formatResult(sideM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('squareAreaResult', resultHTML);
    } else if (area !== null && area > 0) {
        const computedSide = Math.sqrt(area);
        const sideCm = convertLength(computedSide, unit, 'cm');
        const sideM = convertLength(computedSide, unit, 'm');
        const areaCm = convertArea(area, unit, 'cm');
        const areaM = convertArea(area, unit, 'm');
        
        const resultHTML = `<strong>Side (computed):</strong> ${formatResult(sideCm)} cm / ${formatResult(sideM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('squareAreaResult', resultHTML);
    } else {
        showResult('squareAreaResult', 'Please enter a valid Side or Area', false);
    }
}

function calculateRectangleArea() {
    const lengthRaw = document.getElementById('rectLength').value.trim();
    const widthRaw = document.getElementById('rectWidth').value.trim();
    const areaRaw = document.getElementById('rectArea')?.value.trim() || '';
    const lengthUnit = document.getElementById('rectLengthUnit').value;
    const widthUnit = document.getElementById('rectWidthUnit').value;

    const toNum = v => (v === '' ? null : parseFloat(v));
    const l = toNum(lengthRaw);
    const w = toNum(widthRaw);
    const area = toNum(areaRaw);

    if (l !== null && w !== null && l > 0 && w > 0) {
        const lM = convertLength(l, lengthUnit, 'm');
        const wM = convertLength(w, widthUnit, 'm');
        const areaM = lM * wM;
        const areaCm = convertArea(areaM, 'm', 'cm');
        const lCm = convertLength(l, lengthUnit, 'cm');
        const wCm = convertLength(w, widthUnit, 'cm');

        const resultHTML = `<strong>Length:</strong> ${formatResult(lCm)} cm / ${formatResult(lM)} m<br>
                           <strong>Width:</strong> ${formatResult(wCm)} cm / ${formatResult(wM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('rectAreaResult', resultHTML);
    } else if (area !== null && l !== null && l > 0) {
        const lM = convertLength(l, lengthUnit, 'm');
        const areaM = convertArea(area, lengthUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedWm = areaM / lM;
        const computedWcm = convertLength(computedWm, 'm', 'cm');
        const lCm = convertLength(l, lengthUnit, 'cm');

        const resultHTML = `<strong>Length:</strong> ${formatResult(lCm)} cm / ${formatResult(lM)} m<br>
                           <strong>Width (computed):</strong> ${formatResult(computedWcm)} cm / ${formatResult(computedWm)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('rectAreaResult', resultHTML);
    } else if (area !== null && w !== null && w > 0) {
        const wM = convertLength(w, widthUnit, 'm');
        const areaM = convertArea(area, widthUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedLm = areaM / wM;
        const computedLcm = convertLength(computedLm, 'm', 'cm');
        const wCm = convertLength(w, widthUnit, 'cm');

        const resultHTML = `<strong>Length (computed):</strong> ${formatResult(computedLcm)} cm / ${formatResult(computedLm)} m<br>
                           <strong>Width:</strong> ${formatResult(wCm)} cm / ${formatResult(wM)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('rectAreaResult', resultHTML);
    } else {
        showResult('rectAreaResult', 'Please enter Length and Width, or Area and one dimension', false);
    }
}

function calculateTriangleArea() {
    const baseRaw = document.getElementById('triBase').value.trim();
    const heightRaw = document.getElementById('triHeight').value.trim();
    const areaRaw = document.getElementById('triArea')?.value.trim() || '';
    const baseUnit = document.getElementById('triBaseUnit').value;
    const heightUnit = document.getElementById('triHeightUnit').value;

    const toNum = v => (v === '' ? null : parseFloat(v));
    const b = toNum(baseRaw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);

    if (b !== null && h !== null && b > 0 && h > 0) {
        const bM = convertLength(b, baseUnit, 'm');
        const hM = convertLength(h, heightUnit, 'm');
        const areaM = 0.5 * bM * hM;
        const areaCm = convertArea(areaM, 'm', 'cm');
        const bCm = convertLength(b, baseUnit, 'cm');
        const hCm = convertLength(h, heightUnit, 'cm');
        const resultHTML = `<strong>Base:</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('triAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const bM = convertLength(b, baseUnit, 'm');
        const areaM = convertArea(area, baseUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedHm = (2 * areaM) / bM;
        const computedHcm = convertLength(computedHm, 'm', 'cm');
        const bCm = convertLength(b, baseUnit, 'cm');
        const resultHTML = `<strong>Base:</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Height (computed):</strong> ${formatResult(computedHcm)} cm / ${formatResult(computedHm)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('triAreaResult', resultHTML);
    } else if (area !== null && h !== null && h > 0) {
        const hM = convertLength(h, heightUnit, 'm');
        const areaM = convertArea(area, heightUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedBm = (2 * areaM) / hM;
        const computedBcm = convertLength(computedBm, 'm', 'cm');
        const hCm = convertLength(h, heightUnit, 'cm');
        const resultHTML = `<strong>Base (computed):</strong> ${formatResult(computedBcm)} cm / ${formatResult(computedBm)} m<br>
                           <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('triAreaResult', resultHTML);
    } else {
        showResult('triAreaResult', 'Please enter Base and Height, or Area and one dimension', false);
    }
}

function calculateEllipseArea() {
    const majorRaw = document.getElementById('ellipseMajor').value.trim();
    const minorRaw = document.getElementById('ellipseMinor').value.trim();
    const areaRaw = document.getElementById('ellipseArea')?.value.trim() || '';
    const majorUnit = document.getElementById('ellipseMajorUnit').value;
    const minorUnit = document.getElementById('ellipseMinorUnit').value;
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const a = toNum(majorRaw);
    const b = toNum(minorRaw);
    const area = toNum(areaRaw);

    if (a !== null && b !== null && a > 0 && b > 0) {
        const aM = convertLength(a, majorUnit, 'm');
        const bM = convertLength(b, minorUnit, 'm');
        const areaM = Math.PI * aM * bM;
        const areaCm = convertArea(areaM, 'm', 'cm');
        const aCm = convertLength(a, majorUnit, 'cm');
        const bCm = convertLength(b, minorUnit, 'cm');
        const resultHTML = `<strong>Semi-Major Axis (a):</strong> ${formatResult(aCm)} cm / ${formatResult(aM)} m<br>
                           <strong>Semi-Minor Axis (b):</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('ellipseAreaResult', resultHTML);
    } else if (area !== null && a !== null && a > 0) {
        const aM = convertLength(a, majorUnit, 'm');
        const areaM = convertArea(area, majorUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedBm = areaM / (Math.PI * aM);
        const computedBcm = convertLength(computedBm, 'm', 'cm');
        const aCm = convertLength(a, majorUnit, 'cm');
        const resultHTML = `<strong>Semi-Major Axis (a):</strong> ${formatResult(aCm)} cm / ${formatResult(aM)} m<br>
                           <strong>Semi-Minor Axis (b) (computed):</strong> ${formatResult(computedBcm)} cm / ${formatResult(computedBm)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('ellipseAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const bM = convertLength(b, minorUnit, 'm');
        const areaM = convertArea(area, minorUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedAm = areaM / (Math.PI * bM);
        const computedAcm = convertLength(computedAm, 'm', 'cm');
        const bCm = convertLength(b, minorUnit, 'cm');
        const resultHTML = `<strong>Semi-Major Axis (a) (computed):</strong> ${formatResult(computedAcm)} cm / ${formatResult(computedAm)} m<br>
                           <strong>Semi-Minor Axis (b):</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('ellipseAreaResult', resultHTML);
    } else {
        showResult('ellipseAreaResult', 'Please enter both axes or Area and one axis', false);
    }
}

function calculateParallelogramArea() {
    const baseRaw = document.getElementById('paraBase').value.trim();
    const heightRaw = document.getElementById('paraHeight').value.trim();
    const areaRaw = document.getElementById('paraArea')?.value.trim() || '';
    const baseUnit = document.getElementById('paraBaseUnit').value;
    const heightUnit = document.getElementById('paraHeightUnit').value;

    const toNum = v => (v === '' ? null : parseFloat(v));
    const b = toNum(baseRaw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);

    if (b !== null && h !== null && b > 0 && h > 0) {
        const bM = convertLength(b, baseUnit, 'm');
        const hM = convertLength(h, heightUnit, 'm');
        const areaM = bM * hM;
        const areaCm = convertArea(areaM, 'm', 'cm');
        const bCm = convertLength(b, baseUnit, 'cm');
        const hCm = convertLength(h, heightUnit, 'cm');
        const resultHTML = `<strong>Base:</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('paraAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const bM = convertLength(b, baseUnit, 'm');
        const areaM = convertArea(area, baseUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedHm = areaM / bM;
        const computedHcm = convertLength(computedHm, 'm', 'cm');
        const bCm = convertLength(b, baseUnit, 'cm');
        const resultHTML = `<strong>Base:</strong> ${formatResult(bCm)} cm / ${formatResult(bM)} m<br>
                           <strong>Height (computed):</strong> ${formatResult(computedHcm)} cm / ${formatResult(computedHm)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('paraAreaResult', resultHTML);
    } else if (area !== null && h !== null && h > 0) {
        const hM = convertLength(h, heightUnit, 'm');
        const areaM = convertArea(area, heightUnit === 'cm' ? 'cm' : 'm', 'm');
        const computedBm = areaM / hM;
        const computedBcm = convertLength(computedBm, 'm', 'cm');
        const hCm = convertLength(h, heightUnit, 'cm');
        const resultHTML = `<strong>Base (computed):</strong> ${formatResult(computedBcm)} cm / ${formatResult(computedBm)} m<br>
                           <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                           <strong>Area:</strong> ${formatResult(convertArea(areaM, 'm', 'cm'))} cm² / ${formatResult(areaM)} m²`;
        showResult('paraAreaResult', resultHTML);
    } else {
        showResult('paraAreaResult', 'Please enter Base and Height, or Area and one dimension', false);
    }
}

function calculateTrapezoidArea() {
    const base1Raw = document.getElementById('trapBase1').value.trim();
    const base2Raw = document.getElementById('trapBase2').value.trim();
    const heightRaw = document.getElementById('trapHeight').value.trim();
    const areaRaw = document.getElementById('trapArea')?.value.trim() || '';
    const unit = document.getElementById('trapUnit').value;
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const b1 = toNum(base1Raw);
    const b2 = toNum(base2Raw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);
    
    if (b1 !== null && b2 !== null && h !== null && b1 > 0 && b2 > 0 && h > 0) {
        const computedArea = ((b1 + b2) * h) / 2;
        const b1Cm = convertLength(b1, unit, 'cm');
        const b1M = convertLength(b1, unit, 'm');
        const b2Cm = convertLength(b2, unit, 'cm');
        const b2M = convertLength(b2, unit, 'm');
        const heightCm = convertLength(h, unit, 'cm');
        const heightM = convertLength(h, unit, 'm');
        const areaCm = convertArea(computedArea, unit, 'cm');
        const areaM = convertArea(computedArea, unit, 'm');
        const resultHTML = `<strong>Base 1:</strong> ${formatResult(b1Cm)} cm / ${formatResult(b1M)} m<br>
                           <strong>Base 2:</strong> ${formatResult(b2Cm)} cm / ${formatResult(b2M)} m<br>
                           <strong>Height:</strong> ${formatResult(heightCm)} cm / ${formatResult(heightM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('trapAreaResult', resultHTML);
    } else if (area !== null && b1 !== null && b2 !== null && b1 > 0 && b2 > 0) {
        const computedH = (2 * area) / (b1 + b2);
        const b1Cm = convertLength(b1, unit, 'cm');
        const b1M = convertLength(b1, unit, 'm');
        const b2Cm = convertLength(b2, unit, 'cm');
        const b2M = convertLength(b2, unit, 'm');
        const heightCm = convertLength(computedH, unit, 'cm');
        const heightM = convertLength(computedH, unit, 'm');
        const areaCm = convertArea(area, unit, 'cm');
        const areaM = convertArea(area, unit, 'm');
        const resultHTML = `<strong>Base 1:</strong> ${formatResult(b1Cm)} cm / ${formatResult(b1M)} m<br>
                           <strong>Base 2:</strong> ${formatResult(b2Cm)} cm / ${formatResult(b2M)} m<br>
                           <strong>Height (computed):</strong> ${formatResult(heightCm)} cm / ${formatResult(heightM)} m<br>
                           <strong>Area:</strong> ${formatResult(areaCm)} cm² / ${formatResult(areaM)} m²`;
        showResult('trapAreaResult', resultHTML);
    } else {
        showResult('trapAreaResult', 'Please enter Base 1, Base 2, and Height, or Area and both bases', false);
    }
}

// ========== 3D SHAPES - VOLUME, TSA, CSA ==========

function calculateSphere() {
    const radiusRaw = document.getElementById('sphereRadius').value.trim();
    const volumeRaw = document.getElementById('sphereVolume')?.value.trim() || '';
    const tsaRaw = document.getElementById('sphereTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const volume = toNum(volumeRaw);
    const tsa = toNum(tsaRaw);
    
    if (r !== null && r > 0) {
        const unit = document.getElementById('sphereUnit').value;
        const compVolume = (4/3) * Math.PI * r * r * r;
        const compTSA = 4 * Math.PI * r * r;
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('sphereResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const unit = document.getElementById('sphereUnit').value;
        const compR = Math.cbrt((3 * volume) / (4 * Math.PI));
        const compTSA = 4 * Math.PI * compR * compR;
        const rCm = convertLength(compR, unit, 'cm');
        const rM = convertLength(compR, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('sphereResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const unit = document.getElementById('sphereUnit').value;
        const compR = Math.sqrt(tsa / (4 * Math.PI));
        const compVolume = (4/3) * Math.PI * compR * compR * compR;
        const rCm = convertLength(compR, unit, 'cm');
        const rM = convertLength(compR, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(tsa, unit, 'cm');
        const tsaM = convertArea(tsa, unit, 'm');
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume (computed):</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('sphereResult', resultHTML);
    } else {
        showResult('sphereResult', 'Please enter Radius, Volume, or TSA', false);
    }
}

function calculateCube() {
    const sideRaw = document.getElementById('cubeSide').value.trim();
    const volumeRaw = document.getElementById('cubeVolume')?.value.trim() || '';
    const tsaRaw = document.getElementById('cubeTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const s = toNum(sideRaw);
    const volume = toNum(volumeRaw);
    const tsa = toNum(tsaRaw);
    
    if (s !== null && s > 0) {
        const unit = document.getElementById('cubeUnit').value;
        const compVolume = s * s * s;
        const compTSA = 6 * s * s;
        const sCm = convertLength(s, unit, 'cm');
        const sM = convertLength(s, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Side:</strong> ${formatResult(sCm)} cm / ${formatResult(sM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cubeResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const unit = document.getElementById('cubeUnit').value;
        const compS = Math.cbrt(volume);
        const compTSA = 6 * compS * compS;
        const sCm = convertLength(compS, unit, 'cm');
        const sM = convertLength(compS, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Side (computed):</strong> ${formatResult(sCm)} cm / ${formatResult(sM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cubeResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const unit = document.getElementById('cubeUnit').value;
        const compS = Math.sqrt(tsa / 6);
        const compVolume = compS * compS * compS;
        const sCm = convertLength(compS, unit, 'cm');
        const sM = convertLength(compS, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(tsa, unit, 'cm');
        const tsaM = convertArea(tsa, unit, 'm');
        const resultHTML = `<strong>Side (computed):</strong> ${formatResult(sCm)} cm / ${formatResult(sM)} m<br>
                   <strong>Volume (computed):</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cubeResult', resultHTML);
    } else {
        showResult('cubeResult', 'Please enter Side, Volume, or TSA', false);
    }
}

function calculateCuboid() {
    const lengthRaw = document.getElementById('cuboidLength').value.trim();
    const widthRaw = document.getElementById('cuboidWidth').value.trim();
    const heightRaw = document.getElementById('cuboidHeight').value.trim();
    const volumeRaw = document.getElementById('cuboidVolume')?.value.trim() || '';
    const tsaRaw = document.getElementById('cuboidTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const l = toNum(lengthRaw);
    const w = toNum(widthRaw);
    const h = toNum(heightRaw);
    const volume = toNum(volumeRaw);
    const tsa = toNum(tsaRaw);
    
    if (l !== null && w !== null && h !== null && l > 0 && w > 0 && h > 0) {
        const unit = document.getElementById('cuboidUnit').value;
        const compVolume = l * w * h;
        const compTSA = 2 * (l*w + w*h + h*l);
        const lCm = convertLength(l, unit, 'cm');
        const lM = convertLength(l, unit, 'm');
        const wCm = convertLength(w, unit, 'cm');
        const wM = convertLength(w, unit, 'm');
        const hCm = convertLength(h, unit, 'cm');
        const hM = convertLength(h, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Length:</strong> ${formatResult(lCm)} cm / ${formatResult(lM)} m<br>
                   <strong>Width:</strong> ${formatResult(wCm)} cm / ${formatResult(wM)} m<br>
                   <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cuboidResult', resultHTML);
    } else {
        const unit = document.getElementById('cuboidUnit').value;
        showResult('cuboidResult', 'Please enter all three dimensions (Length, Width, Height) to compute Volume and TSA', false);
    }
}

function calculateCylinder() {
    const radiusRaw = document.getElementById('cylinderRadius').value.trim();
    const heightRaw = document.getElementById('cylinderHeight').value.trim();
    const volumeRaw = document.getElementById('cylinderVolume')?.value.trim() || '';
    const csaRaw = document.getElementById('cylinderCSA')?.value.trim() || '';
    const tsaRaw = document.getElementById('cylinderTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const h = toNum(heightRaw);
    const volume = toNum(volumeRaw);
    const csa = toNum(csaRaw);
    const tsa = toNum(tsaRaw);
    
    if (r !== null && h !== null && r > 0 && h > 0) {
        const unit = document.getElementById('cylinderUnit').value;
        const compVolume = Math.PI * r * r * h;
        const compCSA = 2 * Math.PI * r * h;
        const compTSA = 2 * Math.PI * r * (r + h);
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const hCm = convertLength(h, unit, 'cm');
        const hM = convertLength(h, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cylinderResult', resultHTML);
    } else if (volume !== null && r !== null && r > 0) {
        const unit = document.getElementById('cylinderUnit').value;
        const compH = volume / (Math.PI * r * r);
        const compCSA = 2 * Math.PI * r * compH;
        const compTSA = 2 * Math.PI * r * (r + compH);
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const hCm = convertLength(compH, unit, 'cm');
        const hM = convertLength(compH, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Height (computed):</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA, computed):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cylinderResult', resultHTML);
    } else if (volume !== null && h !== null && h > 0) {
        const unit = document.getElementById('cylinderUnit').value;
        const compR = Math.sqrt(volume / (Math.PI * h));
        const compCSA = 2 * Math.PI * compR * h;
        const compTSA = 2 * Math.PI * compR * (compR + h);
        const rCm = convertLength(compR, unit, 'cm');
        const rM = convertLength(compR, unit, 'm');
        const hCm = convertLength(h, unit, 'cm');
        const hM = convertLength(h, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA, computed):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('cylinderResult', resultHTML);
    } else {
        const unit = document.getElementById('cylinderUnit').value;
        showResult('cylinderResult', 'Please enter Radius and Height, or Volume and one dimension', false);
    }
}

function calculateCone() {
    const radiusRaw = document.getElementById('coneRadius').value.trim();
    const heightRaw = document.getElementById('coneHeight').value.trim();
    const volumeRaw = document.getElementById('coneVolume')?.value.trim() || '';
    const csaRaw = document.getElementById('coneCSA')?.value.trim() || '';
    const tsaRaw = document.getElementById('coneTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const h = toNum(heightRaw);
    const volume = toNum(volumeRaw);
    const csa = toNum(csaRaw);
    const tsa = toNum(tsaRaw);
    
    if (r !== null && h !== null && r > 0 && h > 0) {
        const unit = document.getElementById('coneUnit').value;
        const slantHeight = Math.sqrt(r * r + h * h);
        const compVolume = (1/3) * Math.PI * r * r * h;
        const compCSA = Math.PI * r * slantHeight;
        const compTSA = Math.PI * r * (r + slantHeight);
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const hCm = convertLength(h, unit, 'cm');
        const hM = convertLength(h, unit, 'm');
        const slantCm = convertLength(slantHeight, unit, 'cm');
        const slantM = convertLength(slantHeight, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Slant Height:</strong> ${formatResult(slantCm)} cm / ${formatResult(slantM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('coneResult', resultHTML);
    } else if (volume !== null && r !== null && r > 0) {
        const unit = document.getElementById('coneUnit').value;
        const compH = (3 * volume) / (Math.PI * r * r);
        const slantHeight = Math.sqrt(r * r + compH * compH);
        const compCSA = Math.PI * r * slantHeight;
        const compTSA = Math.PI * r * (r + slantHeight);
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const hCm = convertLength(compH, unit, 'cm');
        const hM = convertLength(compH, unit, 'm');
        const slantCm = convertLength(slantHeight, unit, 'cm');
        const slantM = convertLength(slantHeight, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Height (computed):</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Slant Height (computed):</strong> ${formatResult(slantCm)} cm / ${formatResult(slantM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA, computed):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('coneResult', resultHTML);
    } else {
        const unit = document.getElementById('coneUnit').value;
        showResult('coneResult', 'Please enter Radius and Height, or Volume and Radius', false);
    }
}

function calculatePyramid() {
    const baseSRaw = document.getElementById('pyramidBase').value.trim();
    const heightRaw = document.getElementById('pyramidHeight').value.trim();
    const volumeRaw = document.getElementById('pyramidVolume')?.value.trim() || '';
    const tsaRaw = document.getElementById('pyramidTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const a = toNum(baseSRaw);
    const h = toNum(heightRaw);
    const volume = toNum(volumeRaw);
    const tsa = toNum(tsaRaw);
    
    if (a !== null && h !== null && a > 0 && h > 0) {
        const unit = document.getElementById('pyramidUnit').value;
        const slantHeight = Math.sqrt(h * h + (a/2) * (a/2));
        const baseArea = a * a;
        const compVolume = (1/3) * baseArea * h;
        const lateralSurfaceArea = 2 * a * slantHeight;
        const compTSA = baseArea + lateralSurfaceArea;
        const aCm = convertLength(a, unit, 'cm');
        const aM = convertLength(a, unit, 'm');
        const hCm = convertLength(h, unit, 'cm');
        const hM = convertLength(h, unit, 'm');
        const slantCm = convertLength(slantHeight, unit, 'cm');
        const slantM = convertLength(slantHeight, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Base Side:</strong> ${formatResult(aCm)} cm / ${formatResult(aM)} m<br>
                   <strong>Height:</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Slant Height:</strong> ${formatResult(slantCm)} cm / ${formatResult(slantM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('pyramidResult', resultHTML);
    } else if (volume !== null && a !== null && a > 0) {
        const unit = document.getElementById('pyramidUnit').value;
        const compH = (3 * volume) / (a * a);
        const slantHeight = Math.sqrt(compH * compH + (a/2) * (a/2));
        const baseArea = a * a;
        const lateralSurfaceArea = 2 * a * slantHeight;
        const compTSA = baseArea + lateralSurfaceArea;
        const aCm = convertLength(a, unit, 'cm');
        const aM = convertLength(a, unit, 'm');
        const hCm = convertLength(compH, unit, 'cm');
        const hM = convertLength(compH, unit, 'm');
        const slantCm = convertLength(slantHeight, unit, 'cm');
        const slantM = convertLength(slantHeight, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Base Side:</strong> ${formatResult(aCm)} cm / ${formatResult(aM)} m<br>
                   <strong>Height (computed):</strong> ${formatResult(hCm)} cm / ${formatResult(hM)} m<br>
                   <strong>Slant Height (computed):</strong> ${formatResult(slantCm)} cm / ${formatResult(slantM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('pyramidResult', resultHTML);
    } else {
        const unit = document.getElementById('pyramidUnit').value;
        showResult('pyramidResult', 'Please enter Base Side and Height, or Volume and Base Side', false);
    }
}

function calculateHemisphere() {
    const radiusRaw = document.getElementById('hemisphereRadius').value.trim();
    const volumeRaw = document.getElementById('hemisphereVolume')?.value.trim() || '';
    const csaRaw = document.getElementById('hemisphereCSA')?.value.trim() || '';
    const tsaRaw = document.getElementById('hemisphereTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const volume = toNum(volumeRaw);
    const csa = toNum(csaRaw);
    const tsa = toNum(tsaRaw);
    
    if (r !== null && r > 0) {
        const unit = document.getElementById('hemisphereUnit').value;
        const compVolume = (2/3) * Math.PI * r * r * r;
        const compCSA = 2 * Math.PI * r * r;
        const compTSA = 3 * Math.PI * r * r;
        const rCm = convertLength(r, unit, 'cm');
        const rM = convertLength(r, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius:</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('hemisphereResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const unit = document.getElementById('hemisphereUnit').value;
        const compR = Math.cbrt((3 * volume) / (2 * Math.PI));
        const compCSA = 2 * Math.PI * compR * compR;
        const compTSA = 3 * Math.PI * compR * compR;
        const rCm = convertLength(compR, unit, 'cm');
        const rM = convertLength(compR, unit, 'm');
        const volCm = convertVolume(volume, unit, 'cm');
        const volM = convertVolume(volume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(compTSA, unit, 'cm');
        const tsaM = convertArea(compTSA, unit, 'm');
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume:</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA, computed):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA, computed):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('hemisphereResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const unit = document.getElementById('hemisphereUnit').value;
        const compR = Math.sqrt(tsa / (3 * Math.PI));
        const compVolume = (2/3) * Math.PI * compR * compR * compR;
        const compCSA = 2 * Math.PI * compR * compR;
        const rCm = convertLength(compR, unit, 'cm');
        const rM = convertLength(compR, unit, 'm');
        const volCm = convertVolume(compVolume, unit, 'cm');
        const volM = convertVolume(compVolume, unit, 'm');
        const csaCm = convertArea(compCSA, unit, 'cm');
        const csaM = convertArea(compCSA, unit, 'm');
        const tsaCm = convertArea(tsa, unit, 'cm');
        const tsaM = convertArea(tsa, unit, 'm');
        const resultHTML = `<strong>Radius (computed):</strong> ${formatResult(rCm)} cm / ${formatResult(rM)} m<br>
                   <strong>Volume (computed):</strong> ${formatResult(volCm)} cm³ / ${formatResult(volM)} m³<br>
                   <strong>Curved Surface Area (CSA, computed):</strong> ${formatResult(csaCm)} cm² / ${formatResult(csaM)} m²<br>
                   <strong>Total Surface Area (TSA):</strong> ${formatResult(tsaCm)} cm² / ${formatResult(tsaM)} m²`;
        showResult('hemisphereResult', resultHTML);
    } else {
        const unit = document.getElementById('hemisphereUnit').value;
        showResult('hemisphereResult', 'Please enter Radius, Volume, or TSA', false);
    }
}

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', function() {
    // set initial background from last used index
    try { document.body.style.background = _bgGradients[_bgIndex]; } catch(e){}

    document.querySelectorAll('.calc-card input, .calc-card select').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const button = this.closest('.calc-card').querySelector('button');
                if (button) {
                    button.click();
                }
            }
        });
    });
});
