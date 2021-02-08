// BOTAO DENTRO DO MODAL PARA SELECIONAR SE O LANCAMENTO É UMA RECEITA OU DESPESA
// AO CLICAR NO BOTAO REMOVER, PERGUNTAR PARA USUARIO CONFIRMACAO
// IMPLEMENTAR TEMA DARK
// BOTAO PARA EDITAR LANCAMENTO NO MODAL
// ANIMACAO NA ABERTURA DA JANELA DO MODAL
// BOTAO SALVAR DO MODAL FICAR DESABILITADO ATÉ QUE OS CAMPOS OBRIGATORIOS ESTEJAM PREENCHIDOS
// AUTOMATICAMENTE PREENCHER OS VALORES APOS A VIRGULA NA HORA DE LANCAR


const Modal = {
    toogle() {
        document
        .querySelector(".modal-overlay")
        .classList
        .toggle("active")

        Form.clearFormFields();
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload();
    },
    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionContainer.appendChild(tr);

    },

    innerHTMLTransaction(transaction, index) {
        const amountClass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const note = Utils.checkNote(transaction.note)

        let html
        
        if (note) { html =
            `
            <td class="description">${transaction.description}</td>
            <td class=${amountClass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td class="info-btn">
                <div class="tooltip">
                    <img class="btn-note" src="./assets/note_icon.svg" alt="Observações" />
                    <span class="tooltiptext">${transaction.note}</span>
                </div>
                <img class="btn-minus" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
            `
        } else { html =
            `
            <td class="description">${transaction.description}</td>
            <td class=${amountClass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img class="btn-note-disable" src="./assets/note_icon.svg" />
                <img class="btn-minus" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
            `
        }
            console.log(transaction)
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
    },

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

    },

    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100;

        return value;
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    checkNote(note) {
        if (note === "") {
            return false
        } else {
            return true
        }
    }
    
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    note: document.querySelector('input#note'),

    getValues(){
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value,
            note: this.note.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();

        if (description.trim() === "") { throw new Error ("A Descrição é obrigatória*") }
        if (amount.trim() === "") { throw new Error ("O Valor é obrigatório*") }
        if (date.trim() === "") { throw new Error ("A Data é obrigatória*") }
            // amount.trim() === "" ||
            // date.trim() === "") {
            //     throw new Error("Preencha todos os campos");
        

    },

    formatValues() {
        let { description, amount, date, note } = Form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        
        return {
            description,
            amount,
            date,
            note
        };
    },

    saveTransaction(transaction) {
        Transaction.add(transaction);
        // Modal.toogle();
    },

    clearFormFields() {
        this.description.value = "";
        this.amount.value = "";
        this.date.value = "";
        this.note.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            this.validateFields();
            const formatedTransaction = this.formatValues();
            this.saveTransaction(formatedTransaction);
            
            Modal.toogle();

        } catch (err) {
            alert(err.message)
        }

    }
}

const App = {
    init () {
        //Adiciona cada transacao no HTML
        Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index))

        DOM.updateBalance();

        Storage.set(Transaction.all);
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();
