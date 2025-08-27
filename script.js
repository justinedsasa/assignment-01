const $id = (id) => document.getElementById(id);

const amountInput = $id('amount_input');
const sortBySelect = $id('sort_by');
const bodyContainer = $id('body');

const apiUrl = 'https://randomuser.me/api/';
const maxUsers = 1000;
const minUsers = 0;
const timeout = 3000;

let currentUsers = [];

amountInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    await generateUsers();
  }
});

sortBySelect.addEventListener('change', () => {
  if (currentUsers.length > 0) renderUsers(currentUsers, sortBySelect.value);
});

async function generateUsers() {
  const count = Number(amountInput.value.trim());
  const nameDisplay = sortBySelect.value;

  if (!validateInput(count)) return;

  if (count === 0) {
    clearUserRows();
    showTempMessage('No users to generate.', 'info');
    return;
  }

  clearUserRows();

  try {
    const users = await fetchRandomUsers(count);
    displayNewUsers(users, nameDisplay);
  } catch (error) {
    showTempMessage(error.message, 'danger');
  }
}

async function fetchRandomUsers(count) {
  try {
    const response = await fetch(`${apiUrl}?results=${count}`);
    if (!response.ok) throw new Error('Failed to fetch data from API.');
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) throw new Error('Invalid API response.');
    return data.results;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error: Please check your internet connection.');
    }
    throw error;
  }
}

function renderUsers(users, nameDisplay) {
  clearUserRows();

  users.forEach(user => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row mb-2';

    const nameCol = document.createElement('div');
    nameCol.className = 'col-md-3 text-center';
    nameCol.textContent = (nameDisplay === 'first_name') ? user.name.first : user.name.last;

    const genderCol = document.createElement('div');
    genderCol.className = 'col-md-3 text-center';
    genderCol.textContent = capitalizeFirst(user.gender);

    const emailCol = document.createElement('div');
    emailCol.className = 'col-md-3 text-center text-truncate';
    emailCol.textContent = user.email;

    const countryCol = document.createElement('div');
    countryCol.className = 'col-md-3 text-center';
    countryCol.textContent = user.location.country;

    rowDiv.append(nameCol, genderCol, emailCol, countryCol);
    bodyContainer.appendChild(rowDiv);
  });
}

function displayNewUsers(users, nameDisplay) {
  currentUsers = users;
  renderUsers(currentUsers, nameDisplay);
}

function showTempMessage(message, type) {
  clearUserRows();
  const msgDiv = document.createElement('div');
  msgDiv.className = `alert alert-${type} text-center`;
  msgDiv.innerText = message;
  bodyContainer.parentElement.insertBefore(msgDiv, bodyContainer);
  setTimeout(() => msgDiv.remove(), timeout);
}

function validateInput(amount) {
  if (Number.isNaN(amount) || amount === '') {
    showTempMessage('Please enter a valid number.', 'danger');
    return false;
  }
  if (amount < minUsers || amount > maxUsers) {
    showTempMessage(`Please enter a number between ${minUsers} and ${maxUsers}.`, 'danger');
    return false;
  }
  return true;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function clearUserRows() {
  while (bodyContainer.children.length > 1) {
    bodyContainer.removeChild(bodyContainer.lastChild);
  }
}
