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
    
    // Mark the clicked button as active
    event.target.classList.add('active');
    
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
    
    // Mark the clicked button as active
    event.target.classList.add('active');
}

// Utility function to display results
function showResult(elementId, message, isSuccess = true) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = message;
    resultDiv.classList.add('show');
    resultDiv.classList.toggle('success', isSuccess);
    resultDiv.classList.toggle('error', !isSuccess);
}

// Validation function
function validateInputs(...values) {
    for (let val of values) {
        if (val === '' || val === null || isNaN(val)) {
            return false;
        }
    }
    return true;
}

// ========== ADDITION WITH MULTIPLE FIELDS ==========

let additionTerms = [];

function addAdditionTerm() {
    const input = document.getElementById('addNewInput');
    const value = input.value.trim();
    
    if (!value || isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (additionTerms.length >= 100) {
        alert('Maximum 100 terms allowed');
        return;
    }
    
    additionTerms.push(parseFloat(value));
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
        const principalRaw = document.getElementById('ciPrincipal').value.trim();
        const rateRaw = document.getElementById('ciRate').value.trim();
        const timeRaw = document.getElementById('ciTime').value.trim();
        const freqRaw = document.getElementById('ciFrequency').value.trim();
        const interestRaw = document.getElementById('ciInterest').value.trim();
        const amountRaw = document.getElementById('ciAmount').value.trim();

        const toNum = v => (v === '' ? null : parseFloat(v));
        const P = toNum(principalRaw);
        const R = toNum(rateRaw);
        const T = toNum(timeRaw);
        const n = toNum(freqRaw);
        const CI = toNum(interestRaw);
        const A = toNum(amountRaw);

        const provided = [P, R, T, n, CI, A].filter(x => x !== null).length;
        if (provided < 5) {
            showResult('ciResult', 'Please provide at least five of the six fields so the missing one can be calculated.', false);
            return;
        }

        try {
            let resultHTML = '';

            if (A === null) {
                // Compute amount
                if (P !== null && R !== null && T !== null && n !== null) {
                    const amt = P * Math.pow((1 + R / (100 * n)), n * T);
                    const ci = amt - P;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
                } else if (P !== null && CI !== null) {
                    const amt = P + CI;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${CI.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Amount.', false);
                    return;
                }
            } else if (CI === null) {
                // Compute compound interest
                if (A !== null && P !== null) {
                    const ci = A - P;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                } else if (P !== null && R !== null && T !== null && n !== null) {
                    const amt = P * Math.pow((1 + R / (100 * n)), n * T);
                    const ci = amt - P;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Compound Interest.', false);
                    return;
                }
            } else if (P === null) {
                // Compute principal
                if (A !== null && R !== null && T !== null && n !== null) {
                    const Pcalc = A / Math.pow((1 + R / (100 * n)), n * T);
                    const ci = A - Pcalc;
                    resultHTML = `<strong>Principal (derived):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                } else if (A !== null && CI !== null) {
                    const Pcalc = A - CI;
                    resultHTML = `<strong>Principal (from Amount - Interest):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                                 `<strong>Compound Interest:</strong> ₹${CI.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Principal.', false);
                    return;
                }
            } else if (R === null) {
                // Compute rate via inverse of compound formula if possible
                if (A !== null && P !== null && T !== null && n !== null && P > 0 && A > 0) {
                    const base = Math.pow(A / P, 1 / (n * T));
                    const Rcalc = (base - 1) * 100 * n;
                    const ci = A - P;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Rate (derived):</strong> ${Rcalc.toFixed(6)}% per annum<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Rate.', false);
                    return;
                }
            } else if (T === null) {
                // Compute time via logs
                if (A !== null && P !== null && R !== null && n !== null && P > 0 && A > 0) {
                    const base = 1 + R / (100 * n);
                    if (base <= 0) {
                        showResult('ciResult', 'Invalid rate/frequency combination for logarithm.', false);
                        return;
                    }
                    const Tcalc = Math.log(A / P) / (n * Math.log(base));
                    const ci = A - P;
                    resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                 `<strong>Time (derived):</strong> ${Tcalc.toFixed(6)} years<br>` +
                                 `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                 `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Time.', false);
                    return;
                }
            } else if (n === null) {
                // Try to guess integer frequency n (common values) by search
                if (A !== null && P !== null && R !== null && T !== null && P > 0 && A > 0) {
                    let found = null;
                    for (let candidate = 1; candidate <= 365; candidate++) {
                        const amt = P * Math.pow((1 + R / (100 * candidate)), candidate * T);
                        if (Math.abs(amt - A) / Math.max(1, A) < 1e-9) {
                            found = candidate;
                            break;
                        }
                    }
                    if (found !== null) {
                        const ci = A - P;
                        resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                                     `<strong>Frequency (derived):</strong> ${found} times/year<br>` +
                                     `<strong>Compound Interest:</strong> ₹${ci.toFixed(2)}<br>` +
                                     `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
                    } else {
                        showResult('ciResult', 'Could not determine compounding frequency from the provided values. Please provide `n` (times per year).', false);
                        return;
                    }
                } else {
                    showResult('ciResult', 'Insufficient/invalid combination to compute Frequency.', false);
                    return;
                }
            } else {
                // All provided: show calculated CI/A for consistency
                const amt = P * Math.pow((1 + R / (100 * n)), n * T);
                const ci = amt - P;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Compound Interest (calculated):</strong> ₹${ci.toFixed(2)}<br>` +
                             `<strong>Total Amount (calculated):</strong> ₹${amt.toFixed(2)}`;
            }

            showResult('ciResult', resultHTML);
        } catch (err) {
            showResult('ciResult', 'An error occurred while computing. Check inputs.', false);
        }
    

    function clearCIFields() {
        ['ciPrincipal','ciRate','ciTime','ciFrequency','ciInterest','ciAmount'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const res = document.getElementById('ciResult');
        if (res) res.classList.remove('show');
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
    const termsList = multiplicationTerms.join(' × ');
    showResult('mulResult', `${termsList} = <strong>${result.toFixed(2)}</strong>`);
}

function clearMultiplication() {
    multiplicationTerms = [];
    document.getElementById('mulNewInput').value = '';
    updateMultiplicationDisplay();
    document.getElementById('mulResult').classList.remove('show');
}

// ========== DIVISION WITH MULTIPLE FIELDS ==========

let divisionTerms = [];

function addDivisionTerm() {
    const input = document.getElementById('divNewInput');
    const value = input.value.trim();
    
    if (!value || isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (divisionTerms.length >= 100) {
        alert('Maximum 100 terms allowed');
        return;
    }
    
    divisionTerms.push(parseFloat(value));
    input.value = '';
    input.focus();
    updateDivisionDisplay();
}

function removeDivisionTerm(index) {
    divisionTerms.splice(index, 1);
    updateDivisionDisplay();
}

function updateDivisionDisplay() {
    const display = document.getElementById('divTermsDisplay');
    
    if (divisionTerms.length === 0) {
        display.innerHTML = '<span style="color: #999;">Enter numbers to divide...</span>';
        return;
    }
    
    let html = '';
    divisionTerms.forEach((term, index) => {
        if (index > 0) {
            html += '<span class="plus-sign">÷</span>';
        }
        html += `<span class="term">
                    <span class="term-value">${term}</span>
                    <button class="term-delete" onclick="removeDivisionTerm(${index})">✕</button>
                </span>`;
    });
    
    display.innerHTML = html;
}

function calculateDivision() {
    if (divisionTerms.length === 0) {
        showResult('divResult', 'Please enter at least one number', false);
        return;
    }
    
    // Check for zero division
    for (let i = 1; i < divisionTerms.length; i++) {
        if (divisionTerms[i] === 0) {
            showResult('divResult', 'Cannot divide by zero', false);
            return;
        }
    }
    
    const result = divisionTerms.reduce((quotient, num, index) => {
        return index === 0 ? num : quotient / num;
    });
    const termsList = divisionTerms.join(' ÷ ');
    showResult('divResult', `${termsList} = <strong>${result.toFixed(2)}</strong>`);
}

function clearDivision() {
    divisionTerms = [];
    document.getElementById('divNewInput').value = '';
    updateDivisionDisplay();
    document.getElementById('divResult').classList.remove('show');
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
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${si.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else if (A !== null && P !== null) {
                const si = A - P;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Simple Interest (from Amount - Principal):</strong> ₹${si.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
            } else if (A !== null && R !== null && T !== null) {
                const Pcalc = A / (1 + (R * T) / 100);
                const si = A - Pcalc;
                resultHTML = `<strong>Principal (derived):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${si.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Simple Interest.', false);
                return;
            }
        } else if (A === null) {
            // Compute amount
            if (P !== null && R !== null && T !== null) {
                const si = (P * R * T) / 100;
                const amt = P + si;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${si.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else if (P !== null && SI !== null) {
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${SI.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Amount.', false);
                return;
            }
        } else if (P === null) {
            // Compute principal
            if (SI !== null && R !== null && T !== null) {
                const Pcalc = (SI * 100) / (R * T);
                const amt = Pcalc + SI;
                resultHTML = `<strong>Principal (derived):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${SI.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else if (A !== null && SI !== null) {
                const Pcalc = A - SI;
                resultHTML = `<strong>Principal (from Amount - Interest):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${SI.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
            } else if (A !== null && R !== null && T !== null) {
                const Pcalc = A / (1 + (R * T) / 100);
                const si = A - Pcalc;
                resultHTML = `<strong>Principal (derived):</strong> ₹${Pcalc.toFixed(2)}<br>` +
                             `<strong>Simple Interest:</strong> ₹${si.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${A.toFixed(2)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Principal.', false);
                return;
            }
        } else if (R === null) {
            // Compute rate
            if (SI !== null && P !== null && T !== null && P !== 0 && T !== 0) {
                const Rcalc = (SI * 100) / (P * T);
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Rate (derived):</strong> ${Rcalc.toFixed(4)}% per annum<br>` +
                             `<strong>Simple Interest:</strong> ₹${SI.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Rate.', false);
                return;
            }
        } else if (T === null) {
            // Compute time
            if (SI !== null && P !== null && R !== null && P !== 0 && R !== 0) {
                const Tcalc = (SI * 100) / (P * R);
                const amt = P + SI;
                resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                             `<strong>Time (derived):</strong> ${Tcalc.toFixed(4)} years<br>` +
                             `<strong>Simple Interest:</strong> ₹${SI.toFixed(2)}<br>` +
                             `<strong>Total Amount:</strong> ₹${amt.toFixed(2)}`;
            } else {
                showResult('siResult', 'Insufficient/invalid combination to compute Time.', false);
                return;
            }
        } else {
            // All provided: just show consistency
            const si = (P * R * T) / 100;
            const amt = P + si;
            resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>` +
                         `<strong>Simple Interest (calculated):</strong> ₹${si.toFixed(2)}<br>` +
                         `<strong>Total Amount (calculated):</strong> ₹${amt.toFixed(2)}`;
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
    
    const resultHTML = `<strong>Principal:</strong> ₹${P.toFixed(2)}<br>
                       <strong>Compound Interest:</strong> ₹${CI.toFixed(2)}<br>
                       <strong>Total Amount:</strong> ₹${amount.toFixed(2)}`;
    showResult('ciResult', resultHTML);
}

// ========== 2D SHAPES - AREA ==========

function calculateCircleArea() {
    const radiusRaw = document.getElementById('circleRadius').value.trim();
    const areaRaw = document.getElementById('circleArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const area = toNum(areaRaw);
    
    if (r !== null) {
        const computedArea = Math.PI * r * r;
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('circleAreaResult', resultHTML);
    } else if (area !== null && area > 0) {
        const computedRadius = Math.sqrt(area / Math.PI);
        const resultHTML = `<strong>Radius (computed):</strong> ${computedRadius.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('circleAreaResult', resultHTML);
    } else {
        showResult('circleAreaResult', 'Please enter a valid Radius or Area', false);
    }
}

function calculateSquareArea() {
    const sideRaw = document.getElementById('squareSide').value.trim();
    const areaRaw = document.getElementById('squareArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const s = toNum(sideRaw);
    const area = toNum(areaRaw);
    
    if (s !== null && s > 0) {
        const computedArea = s * s;
        const resultHTML = `<strong>Side:</strong> ${s.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('squareAreaResult', resultHTML);
    } else if (area !== null && area > 0) {
        const computedSide = Math.sqrt(area);
        const resultHTML = `<strong>Side (computed):</strong> ${computedSide.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('squareAreaResult', resultHTML);
    } else {
        showResult('squareAreaResult', 'Please enter a valid Side or Area', false);
    }
}

function calculateRectangleArea() {
    const lengthRaw = document.getElementById('rectLength').value.trim();
    const widthRaw = document.getElementById('rectWidth').value.trim();
    const areaRaw = document.getElementById('rectArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const l = toNum(lengthRaw);
    const w = toNum(widthRaw);
    const area = toNum(areaRaw);
    
    if (l !== null && w !== null && l > 0 && w > 0) {
        const computedArea = l * w;
        const resultHTML = `<strong>Length:</strong> ${l.toFixed(4)}<br>
                           <strong>Width:</strong> ${w.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('rectAreaResult', resultHTML);
    } else if (area !== null && l !== null && l > 0) {
        const computedW = area / l;
        const resultHTML = `<strong>Length:</strong> ${l.toFixed(4)}<br>
                           <strong>Width (computed):</strong> ${computedW.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('rectAreaResult', resultHTML);
    } else if (area !== null && w !== null && w > 0) {
        const computedL = area / w;
        const resultHTML = `<strong>Length (computed):</strong> ${computedL.toFixed(4)}<br>
                           <strong>Width:</strong> ${w.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('rectAreaResult', resultHTML);
    } else {
        showResult('rectAreaResult', 'Please enter Length and Width, or Area and one dimension', false);
    }
}

function calculateTriangleArea() {
    const baseRaw = document.getElementById('triBase').value.trim();
    const heightRaw = document.getElementById('triHeight').value.trim();
    const areaRaw = document.getElementById('triArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const b = toNum(baseRaw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);
    
    if (b !== null && h !== null && b > 0 && h > 0) {
        const computedArea = (b * h) / 2;
        const resultHTML = `<strong>Base:</strong> ${b.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('triAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const computedH = (2 * area) / b;
        const resultHTML = `<strong>Base:</strong> ${b.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${computedH.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('triAreaResult', resultHTML);
    } else if (area !== null && h !== null && h > 0) {
        const computedB = (2 * area) / h;
        const resultHTML = `<strong>Base (computed):</strong> ${computedB.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('triAreaResult', resultHTML);
    } else {
        showResult('triAreaResult', 'Please enter Base and Height, or Area and one dimension', false);
    }
}

function calculateEllipseArea() {
    const majorRaw = document.getElementById('ellipseMajor').value.trim();
    const minorRaw = document.getElementById('ellipseMinor').value.trim();
    const areaRaw = document.getElementById('ellipseArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const a = toNum(majorRaw);
    const b = toNum(minorRaw);
    const area = toNum(areaRaw);
    
    if (a !== null && b !== null && a > 0 && b > 0) {
        const computedArea = Math.PI * a * b;
        const resultHTML = `<strong>Semi-Major Axis (a):</strong> ${a.toFixed(4)}<br>
                           <strong>Semi-Minor Axis (b):</strong> ${b.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('ellipseAreaResult', resultHTML);
    } else if (area !== null && a !== null && a > 0) {
        const computedB = area / (Math.PI * a);
        const resultHTML = `<strong>Semi-Major Axis (a):</strong> ${a.toFixed(4)}<br>
                           <strong>Semi-Minor Axis (b, computed):</strong> ${computedB.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('ellipseAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const computedA = area / (Math.PI * b);
        const resultHTML = `<strong>Semi-Major Axis (a, computed):</strong> ${computedA.toFixed(4)}<br>
                           <strong>Semi-Minor Axis (b):</strong> ${b.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('ellipseAreaResult', resultHTML);
    } else {
        showResult('ellipseAreaResult', 'Please enter both axes or Area and one axis', false);
    }
}

function calculateParallelogramArea() {
    const baseRaw = document.getElementById('paraBase').value.trim();
    const heightRaw = document.getElementById('paraHeight').value.trim();
    const areaRaw = document.getElementById('paraArea')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const b = toNum(baseRaw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);
    
    if (b !== null && h !== null && b > 0 && h > 0) {
        const computedArea = b * h;
        const resultHTML = `<strong>Base:</strong> ${b.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('paraAreaResult', resultHTML);
    } else if (area !== null && b !== null && b > 0) {
        const computedH = area / b;
        const resultHTML = `<strong>Base:</strong> ${b.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${computedH.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
        showResult('paraAreaResult', resultHTML);
    } else if (area !== null && h !== null && h > 0) {
        const computedB = area / h;
        const resultHTML = `<strong>Base (computed):</strong> ${computedB.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
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
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const b1 = toNum(base1Raw);
    const b2 = toNum(base2Raw);
    const h = toNum(heightRaw);
    const area = toNum(areaRaw);
    
    if (b1 !== null && b2 !== null && h !== null && b1 > 0 && b2 > 0 && h > 0) {
        const computedArea = ((b1 + b2) * h) / 2;
        const resultHTML = `<strong>Base 1:</strong> ${b1.toFixed(4)}<br>
                           <strong>Base 2:</strong> ${b2.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Area:</strong> ${computedArea.toFixed(2)} sq units`;
        showResult('trapAreaResult', resultHTML);
    } else if (area !== null && b1 !== null && b2 !== null && b1 > 0 && b2 > 0) {
        const computedH = (2 * area) / (b1 + b2);
        const resultHTML = `<strong>Base 1:</strong> ${b1.toFixed(4)}<br>
                           <strong>Base 2:</strong> ${b2.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${computedH.toFixed(4)}<br>
                           <strong>Area:</strong> ${area.toFixed(2)} sq units`;
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
        const compVolume = (4/3) * Math.PI * r * r * r;
        const compTSA = 4 * Math.PI * r * r;
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('sphereResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const compR = Math.cbrt((3 * volume) / (4 * Math.PI));
        const compTSA = 4 * Math.PI * compR * compR;
        const resultHTML = `<strong>Radius (computed):</strong> ${compR.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('sphereResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const compR = Math.sqrt(tsa / (4 * Math.PI));
        const compVolume = (4/3) * Math.PI * compR * compR * compR;
        const resultHTML = `<strong>Radius (computed):</strong> ${compR.toFixed(4)}<br>
                           <strong>Volume (computed):</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Surface Area (TSA):</strong> ${tsa.toFixed(2)} sq units`;
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
        const compVolume = s * s * s;
        const compTSA = 6 * s * s;
        const resultHTML = `<strong>Side:</strong> ${s.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cubeResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const compS = Math.cbrt(volume);
        const compTSA = 6 * compS * compS;
        const resultHTML = `<strong>Side (computed):</strong> ${compS.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cubeResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const compS = Math.sqrt(tsa / 6);
        const compVolume = compS * compS * compS;
        const resultHTML = `<strong>Side (computed):</strong> ${compS.toFixed(4)}<br>
                           <strong>Volume (computed):</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA):</strong> ${tsa.toFixed(2)} sq units`;
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
        const compVolume = l * w * h;
        const compTSA = 2 * (l*w + w*h + h*l);
        const resultHTML = `<strong>Length:</strong> ${l.toFixed(4)}<br>
                           <strong>Width:</strong> ${w.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cuboidResult', resultHTML);
    } else {
        showResult('cuboidResult', 'Please enter all three dimensions (Length, Width, Height) to compute Volume and TSA', false);
    }
}

function calculateCylinder() {
    const radiusRaw = document.getElementById('cylRadius').value.trim();
    const heightRaw = document.getElementById('cylHeight').value.trim();
    const volumeRaw = document.getElementById('cylVolume')?.value.trim() || '';
    const csaRaw = document.getElementById('cylCSA')?.value.trim() || '';
    const tsaRaw = document.getElementById('cylTSA')?.value.trim() || '';
    
    const toNum = v => (v === '' ? null : parseFloat(v));
    const r = toNum(radiusRaw);
    const h = toNum(heightRaw);
    const volume = toNum(volumeRaw);
    const csa = toNum(csaRaw);
    const tsa = toNum(tsaRaw);
    
    if (r !== null && h !== null && r > 0 && h > 0) {
        const compVolume = Math.PI * r * r * h;
        const compCSA = 2 * Math.PI * r * h;
        const compTSA = 2 * Math.PI * r * (r + h);
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cylinderResult', resultHTML);
    } else if (volume !== null && r !== null && r > 0) {
        const compH = volume / (Math.PI * r * r);
        const compCSA = 2 * Math.PI * r * compH;
        const compTSA = 2 * Math.PI * r * (r + compH);
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${compH.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA, computed):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cylinderResult', resultHTML);
    } else if (volume !== null && h !== null && h > 0) {
        const compR = Math.sqrt(volume / (Math.PI * h));
        const compCSA = 2 * Math.PI * compR * h;
        const compTSA = 2 * Math.PI * compR * (compR + h);
        const resultHTML = `<strong>Radius (computed):</strong> ${compR.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA, computed):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('cylinderResult', resultHTML);
    } else {
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
        const slantHeight = Math.sqrt(r * r + h * h);
        const compVolume = (1/3) * Math.PI * r * r * h;
        const compCSA = Math.PI * r * slantHeight;
        const compTSA = Math.PI * r * (r + slantHeight);
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Slant Height:</strong> ${slantHeight.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('coneResult', resultHTML);
    } else if (volume !== null && r !== null && r > 0) {
        const compH = (3 * volume) / (Math.PI * r * r);
        const slantHeight = Math.sqrt(r * r + compH * compH);
        const compCSA = Math.PI * r * slantHeight;
        const compTSA = Math.PI * r * (r + slantHeight);
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${compH.toFixed(4)}<br>
                           <strong>Slant Height (computed):</strong> ${slantHeight.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA, computed):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('coneResult', resultHTML);
    } else {
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
        const slantHeight = Math.sqrt(h * h + (a/2) * (a/2));
        const baseArea = a * a;
        const compVolume = (1/3) * baseArea * h;
        const lateralSurfaceArea = 2 * a * slantHeight;
        const compTSA = baseArea + lateralSurfaceArea;
        const resultHTML = `<strong>Base Side:</strong> ${a.toFixed(4)}<br>
                           <strong>Height:</strong> ${h.toFixed(4)}<br>
                           <strong>Slant Height:</strong> ${slantHeight.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('pyramidResult', resultHTML);
    } else if (volume !== null && a !== null && a > 0) {
        const compH = (3 * volume) / (a * a);
        const slantHeight = Math.sqrt(compH * compH + (a/2) * (a/2));
        const baseArea = a * a;
        const lateralSurfaceArea = 2 * a * slantHeight;
        const compTSA = baseArea + lateralSurfaceArea;
        const resultHTML = `<strong>Base Side:</strong> ${a.toFixed(4)}<br>
                           <strong>Height (computed):</strong> ${compH.toFixed(4)}<br>
                           <strong>Slant Height (computed):</strong> ${slantHeight.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('pyramidResult', resultHTML);
    } else {
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
        const compVolume = (2/3) * Math.PI * r * r * r;
        const compCSA = 2 * Math.PI * r * r;
        const compTSA = 3 * Math.PI * r * r;
        const resultHTML = `<strong>Radius:</strong> ${r.toFixed(4)}<br>
                           <strong>Volume:</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('hemisphereResult', resultHTML);
    } else if (volume !== null && volume > 0) {
        const compR = Math.cbrt((3 * volume) / (2 * Math.PI));
        const compCSA = 2 * Math.PI * compR * compR;
        const compTSA = 3 * Math.PI * compR * compR;
        const resultHTML = `<strong>Radius (computed):</strong> ${compR.toFixed(4)}<br>
                           <strong>Volume:</strong> ${volume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA, computed):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA, computed):</strong> ${compTSA.toFixed(2)} sq units`;
        showResult('hemisphereResult', resultHTML);
    } else if (tsa !== null && tsa > 0) {
        const compR = Math.sqrt(tsa / (3 * Math.PI));
        const compVolume = (2/3) * Math.PI * compR * compR * compR;
        const compCSA = 2 * Math.PI * compR * compR;
        const resultHTML = `<strong>Radius (computed):</strong> ${compR.toFixed(4)}<br>
                           <strong>Volume (computed):</strong> ${compVolume.toFixed(2)} cubic units<br>
                           <strong>Curved Surface Area (CSA, computed):</strong> ${compCSA.toFixed(2)} sq units<br>
                           <strong>Total Surface Area (TSA):</strong> ${tsa.toFixed(2)} sq units`;
        showResult('hemisphereResult', resultHTML);
    } else {
        showResult('hemisphereResult', 'Please enter Radius, Volume, or TSA', false);
    }
}

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', function() {
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
