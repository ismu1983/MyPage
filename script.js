// Load saved expenses or start with an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM Element references
const expenseForm = document.getElementById('expense-form');
const descInput = document.getElementById('desc-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const filterSelect = document.getElementById('filter-select');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

// Default date input to today's date
dateInput.value = new Date().toISOString().split('T')[0];

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Get filtered list based on user selection
function getFilteredExpenses() {
  const filterValue = filterSelect.value;
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // "YYYY-MM"

  return expenses.filter(expense => {
    if (filterValue === 'today') {
      return expense.date === todayStr;
    } else if (filterValue === 'month') {
      return expense.date.startsWith(currentMonthStr);
    }
    return true; // 'all'
  });
}

// Function 1: Add a new expense
function addExpense(event) {
  event.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;

  if (description !== '' && !isNaN(amount) && date !== '') {
    const expense = {
      id: Date.now(),
      description: description,
      amount: amount,
      date: date
    };

    expenses.push(expense);
    saveExpenses();
    updateUI();

    // Reset input fields
    descInput.value = '';
    amountInput.value = '';
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

// Function 2: Delete an expense by ID
function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  updateUI();
}

// Function 3: Calculate total spent for filtered items
function calculateTotal(filteredExpenses) {
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

// Function 4: Render the list of filtered expenses
function renderExpenses(filteredExpenses) {
  expenseList.innerHTML = '';

  if (filteredExpenses.length === 0) {
    expenseList.innerHTML = '<li style="text-align: center; color: #888;">No expenses found.</li>';
    return;
  }

  filteredExpenses.forEach(expense => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="expense-details">
        <span>${expense.description} - <strong>$${expense.amount.toFixed(2)}</strong></span>
        <span class="expense-date">${expense.date}</span>
      </div>
      <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
    `;
    expenseList.appendChild(li);
  });
}

// Function 5: Master UI update function
function updateUI() {
  const filtered = getFilteredExpenses();
  renderExpenses(filtered);
  calculateTotal(filtered);
}

// Event Listeners
expenseForm.addEventListener('submit', addExpense);
filterSelect.addEventListener('change', updateUI);

// Initial Render
updateUI();