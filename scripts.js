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
    all: transactions,

    add(transaction){
        Transaction.all.push(transaction)

        App.reload();
    },

    incomes() {
        // somar as receitas
        let sumIncomes = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0)
            sumIncomes += transaction.amount
        });
        
        return sumIncomes;
    },
    expenses() {
        // somar as despesas
        let sumExpenses = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0)
            sumExpenses += transaction.amount
        });
        
        return sumExpenses;
    },
    total() {
        // diferença receitas MENOS despesas
        return Transaction.incomes() + Transaction.expenses();
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

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${amountClass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html;
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes());
        
        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses());
        
        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total());
        
    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = "";
    }
}


const Utils = {
    // Formata registro do valor (moeda)
    formatCurrency(value) {
        //Implementa o sinal caso valor seja negativo (despesa)
        const signal = Number(value) < 0 ? "-" : "";

        //Utilizando expressao regular, remove "sujeira" do registro do valor, deixando apenas os numeros
        value = String(value).replace(/\D/g, "");

        //Converte o valor bruto decimal/centavos
        value = Number(value) / 100;

        //Adiciona cifrão no formato brasileiro
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;

    }
    
}


const App = {
    init () {
        //Adiciona cada transacao no HTML
        Transaction.all.forEach(transaction => DOM.addTransaction(transaction))

        DOM.updateBalance();

    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();


Transaction.add({});