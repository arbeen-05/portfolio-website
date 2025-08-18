let stocks = JSON.parse(localStorage.getItem('stocks')) || [];
let companyDetails = JSON.parse(localStorage.getItem('companyDetails')) || {};

document.getElementById('companyForm')?.addEventListener('submit', e => {
  e.preventDefault();
  companyDetails = {
    name: document.getElementById('companyName').value,
    pan: document.getElementById('companyPAN').value,
    address: document.getElementById('companyAddress').value,
    contact: document.getElementById('companyContact').value,
  };
  localStorage.setItem('companyDetails', JSON.stringify(companyDetails));
  alert('Company details saved!');
});

document.getElementById('stockForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const stock = {
    code: document.getElementById('itemCode').value,
    name: document.getElementById('productName').value,
    rate: parseFloat(document.getElementById('rate').value),
  };
  stocks.push(stock);
  localStorage.setItem('stocks', JSON.stringify(stocks));
  alert('Product added to stock!');
  displayStocks();
});

function displayStocks() {
  const stockList = document.getElementById('stockList');
  if (!stockList) return;
  stockList.innerHTML = '<h3>Available Stocks:</h3>';
  stocks.forEach(s => {
    stockList.innerHTML += `<p>${s.code} - ${s.name} @ ${s.rate}</p>`;
  });
}
displayStocks();

document.getElementById('billingForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const code = document.getElementById('billItemCode').value;
  const qty = parseInt(document.getElementById('quantity').value);
  const product = stocks.find(s => s.code === code);
  if (!product) {
    alert('Invalid item code');
    return;
  }
  const billDiv = document.getElementById('bill');
  let table = document.getElementById('billTable');
  if (!table) {
    billDiv.innerHTML = `<div id="printArea">
      <h3>${companyDetails.name || ''}</h3>
      <p>PAN: ${companyDetails.pan || ''}</p>
      <p>${companyDetails.address || ''}</p>
      <p>${companyDetails.contact || ''}</p>
      <table border="1" id="billTable">
        <tr><th>Code</th><th>Name</th><th>Rate</th><th>Qty</th><th>Total</th></tr>
      </table>
      <p id="grandTotal">Grand Total: 0</p>
    </div>`;
    table = document.getElementById('billTable');
  }
  const row = table.insertRow();
  row.innerHTML = `<td>${product.code}</td><td>${product.name}</td><td>${product.rate}</td><td>${qty}</td><td>${product.rate * qty}</td>`;
  updateGrandTotal();
  autoDownloadBill();
});

function updateGrandTotal() {
  const rows = document.querySelectorAll('#billTable tr');
  let total = 0;
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    total += parseFloat(row.cells[4].innerText);
  });
  document.getElementById('grandTotal').innerText = 'Grand Total: ' + total;
}

function printBill() {
  window.print();
}

function autoDownloadBill() {
  const transId = Date.now();
  const billText = document.getElementById('printArea').innerText;
  const blob = new Blob([billText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = transId + '.txt';
  link.click();
}
