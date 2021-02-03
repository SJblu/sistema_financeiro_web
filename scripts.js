const Modal = {
    toogle() {
        document
        .querySelector(".modal-overlay")
        .classList
        .toggle("active")
    }
}

const transactions = [
    {
        id: 1,
        description: 'Energia',
        amount: -50000,
        date: '23/02/2021'
    },
    {
        id: 2,
        description: 'Criação Website',
        amount: 500000,
        date: '23/02/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/02/2021'
    }
]

const Transaction = {
    incomes() {
        // somar as receitas
    },
    expenses() {
        // somar as despesas
    },
    total() {
        // resultado receitas MENOS despesas
    }
}


const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {

        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);

        DOM.transactionContainer.appendChild(tr);

    },
    innerHTMLTransaction(transaction) {
        const amountClass = transaction.amount > 0 ? "income" : "expense";

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${amountClass}>${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html;
    }
}


const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
    }
}


transactions.forEach(transaction => DOM.addTransaction(transaction))