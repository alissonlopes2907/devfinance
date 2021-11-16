//Configuração para adicionar novas transações no sistema
const Modal = {
  open() {
    //Abrir modal
    //Para abrir modal, tem que adicionar a classe active ao modal
    document.querySelector('.modal-overlay').classList.add('active') //selecionando a classe modal-overlay e atribuindo a classa active junto a ela
    document.querySelector('.footer').classList.add('Transparent')
  },

  close() {
    //Fechar Modal
    //Para fechar modal, tem que remover a classe active do Modal
    document.querySelector('.modal-overlay').classList.remove('active') //removendo active de modal-overlay

    document.querySelector('.footer').classList.remove('Transparent')
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    )
  }
}
//Fazer as operações matematica na calculadora
const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    //Somar todas as entradas
    //para cada transação
    let income = 0

    Transaction.all.forEach(transaction => {
      // se ela for maior que zero
      if (transaction.amount > 0) {
        // somar a uma variavel e retornar a variavel
        income += transaction.amount
      }
    })
    return income
  },
  expenses() {
    //somas as saídas
    let expense = 0

    Transaction.all.forEach(transaction => {
      // se ela for maior que zero
      if (transaction.amount < 0) {
        // somar a uma variavel e retornar a variavel
        expense += transaction.amount
      }
    })

    return expense
  },
  total() {
    //entradas - saídas
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr') //Criou uma variavel chamada tr e adicionou um elemento html chamado tr

    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //adicionou dentro do elemento dessa variavel a constante que foi criada em innerHTMLTransaction(), ficando como <tr>html</tr>
    tr.dataset.index = index
    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    //Trata-se de um ternario, que irá identificar se o valor é maior que zero, se for, ele acrescentará income, caso contrario, colocará expense
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = utils.formatCurrency(transaction.amount)
    /*Função que tem uma variavel constante chamada html, ela será retornada para uma outra função dentro desse object*/
    const html = `
   
    <td class="description">${transaction.description}</td> 
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick=" Transaction.remove(${index})" src="./images/minus.svg" alt="Remover transação" />
    </td>
    ` // Como o array transactions foi atribuido no transaction da função, podemos selecionar ele com transaction.description
    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(
      Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(
      Transaction.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(
      Transaction.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ' '
  }
}
const utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos.')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = utils.formatAmount(amount)
    date = utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction) {
    Transaction.add(transaction)
  },
  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },
  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Modal.close()
      Form.clearFields()
      Form.saveTransaction(transaction)

      App.reload()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)

    //Usando a mesma lógica do for, o forEach irá contar quantos objetos há dentro do vetor e executara com base na quantidade uma funcionalidade, colocando dentro do transction da linha 37 o um dos objects
    Storage.set(Transaction.all)
    DOM.updateBalance()
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
