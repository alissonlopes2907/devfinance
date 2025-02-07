

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
} //parte de fechamento e abertura do modal


//Fazer as operações matematica na calculadora
const Transaction = {
  
  async remove(id) {
  //  Transaction.all.splice(index, 1) //remove as transações

    const response = await fetch(`http://localhost:3333/transactions/${id}`, {
      method: 'DELETE'
    })

    App.reload()
  },

 async incomes() {
       
  const response = await fetch('http://localhost:3333/transactions')

  if (!response.ok) {
   throw new Error('Erro na requisição: ' + response.status);

  }
 let transactions = await response.json();

 
    let income = 0
    transactions.forEach(transaction => {
      transaction.amount = Number(transaction.amount)
      // se ela for maior que zero
      if (transaction.amount > 0) {
        // somar a uma variavel e retornar a variavel
        income += transaction.amount
      }
    })
    console.log(income)
    return income 
  },
  async expenses() {
    const response = await fetch('http://localhost:3333/transactions')

    if (!response.ok) {
     throw new Error('Erro na requisição: ' + response.status);
  
    }
   let transactions = await response.json();


    let expense = 0
    transactions.forEach(transaction => {
      transaction.amount = Number(transaction.amount)
      // se ela for maior que zero
      if (transaction.amount < 0) {
        // somar a uma variavel e retornar a variavel
        expense += transaction.amount
        
      }
    })
        console.log(expense)
    return expense
  },
  async total() {
    const income = await Transaction.incomes()  
    const expense = await Transaction.expenses()
    //entradas - saídas
    return income + expense
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  transactionsData: transaction,
  addTransaction(transaction, index) {
    const tr = document.createElement('tr') //Criou uma variavel chamada tr e adicionou um elemento html chamado tr

    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //adicionou dentro do elemento dessa variavel a constante que foi criada em innerHTMLTransaction(), ficando como <tr>html</tr>
    tr.dataset.index = index
    DOM.transactionsContainer.appendChild(tr)
  },
  removeData(id) {
    console.log('Data do dom: ', id)

 },
  innerHTMLTransaction(transaction) {
    console.log("tESTE: ",transaction)
    //Trata-se de um ternario, que irá identificar se o valor é maior que zero, se for, ele acrescentará income, caso contrario, colocará expense
    const id = transaction.id

    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'
   
    const amount = transaction.amount

    /*Função que tem uma variavel constante chamada html, ela será retornada para uma outra função dentro desse object*/ 

    let icone =
      transaction.amount > 0 ? './images/plus.svg' : './images/minus.svg'

    const html = `
    <td class="description">${transaction.description}</td> 
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove('${id}')" src="${icone}" alt="Remover transação" />
    </td>
    `
    //Como fazer o icone das transações ser factivel com os valores de entrada e saída??????

    // Como o array transactions foi atribuido no transaction da função, podemos selecionar ele com transaction.description
    return html
  },

  async updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(
      await Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(
     await Transaction.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(
    await Transaction.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ' '
  }
}
const utils = {
  formatAmount(value) {
    value = Number(value) 

    return value
  },

  formatDate(date) {
     
    const data = new Date(date)

    const day = String(data.getUTCDate()).padStart(2, "0");
    const month = String(data.getUTCMonth() + 1).padStart(2, "0");
    const year = data.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) 

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

  async saveTransaction(transaction) {
    const result = await fetch('http://localhost:3333/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    })
    console.log(result)
  
  },
  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },
  async submit(event) {
    event.preventDefault()



    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Modal.close()
      Form.clearFields()
      await Form.saveTransaction(transaction)

      App.reload()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
 async init() {
      
    const response = await fetch('http://localhost:3333/transactions')

     if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);

     }
    let transactions = await response.json();

    

   for ( let i =0 ; i< transactions.length ; i++) {
          transactions[i].date = utils.formatDate(transactions[i].date)
    }
    

    
    transactions.forEach(DOM.addTransaction)
    
    //Usando a mesma lógica do for, o forEach irá contar quantos objetos há dentro do vetor e executara com base na quantidade uma funcionalidade, colocando dentro do transction da linha 37 o um dos objects
   // transactions.set(Transaction.all)
    DOM.updateBalance()
    
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
