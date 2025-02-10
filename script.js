class Storage {
  constructor() {
    this._id = {};
    this._transactions = {}; // Agora é um array para armazenar várias transações
  }

  getID() {
    return this._id['id'];
  }

  setID(idData) {
    console.log('ID dentro do storage: ', idData);
    this._id['id'] = idData; // Agora armazena o ID diretamente
    return 'Salvo com sucesso';
  }

  deleteID() {
    this._id['id'] = null;
    return 'Deletado com sucesso';
  }

  getTransactions() {
    return this._transactions['transactions'];
  }

  setTransactions(description, amount, date) {
    console.log('Dados da transação no storage:', description, '-', amount, '-', date);
    const transaction = { description, amount, date };
    this._transactions['transactions'] = transaction; // Adiciona a nova transação ao array
    return 'Salvo com sucesso';
  }

  deleteTransactions() {
    this._transactions['transactions'] = {}; // Limpa todas as transações
    return 'Deletado com sucesso';
  }
}


let storageID = new Storage()

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

const ModalUpdate = { //Atualizar algum dados da transação
  async openUpdate(id) {

    console.log('Dados de id dentro do modal: ', id)

    const response = await fetch(`http://localhost:3000/transactionsid/${id}`)

    if (!response.ok) {
     throw new Error('Erro na requisição: ' + response);
    }

    let transaction = await response.json()
    console.log('Dados de transação dentro do modal: ', transaction)

    //tratamento de datas
    transaction[0].date = new Date(transaction[0].date).toISOString().slice(0, 10)

    //Abrir modal
    //Para abrir modal, tem que adicionar a classe active ao modal
    document.querySelector('.modal-overlayUpdate').classList.add('activeUpdate') //selecionando a classe modal-overlay e atribuindo a classa active junto a ela
    document.querySelector('.footer').classList.add('Transparent')

   
    document.querySelector('input#descriptionUpdate').value = transaction[0].description
    document.querySelector('input#amountUpdate').value = transaction[0].amount 
    document.querySelector('input#dateUpdate').value = transaction[0].date
   
   
   await storageID.setID(id)




  },

  closeUpdate() {
    //Fechar Modal
    //Para fechar modal, tem que remover a classe active do Modal
    document.querySelector('.modal-overlayUpdate').classList.remove('activeUpdate') //removendo active de modal-overlay

    document.querySelector('.footer').classList.remove('Transparent')
  }
} //parte de fechamento e abertura do modal
//Fazer as operações matematica na calculadora
const Transaction = {
  
  async remove(id) {
  //  Transaction.all.splice(index, 1) //remove as transações

      await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE'
    })

    App.reload()
  },

 async incomes() {
       
  const response = await fetch('http://localhost:3000/transactions')

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
    const response = await fetch('http://localhost:3000/transactions')

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
  transactionsData: Transaction,
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
    
    //Trata-se de um ternario, que irá identificar se o valor é maior que zero, se for, ele acrescentará income, caso contrario, colocará expense
    const id = transaction.id
    console.log('ID: ', id)

    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'
   
    const amount = transaction.amount

    /*Função que tem uma variavel constante chamada html, ela será retornada para uma outra função dentro desse object*/ 

    let icone =
      transaction.amount > 0 ? './images/plus.svg' : './images/minus.svg'

    const html = `
    <td class="description" onclick="ModalUpdate.openUpdate('${id}')">${transaction.description}</td> 
    <td class="${CSSclass}">${amount}</td>
    <td class="date" >${transaction.date}</td>
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

  getValues() {
    let description = document.querySelector('input#description').value 
    let amount = document.querySelector('input#amount').value
    let date = document.querySelector('input#date').value 
 ///   await storageID.setTransaction(description, amount, date)
    storageID.setTransactions(description, amount, date)
    return 'Salvo com sucesso!'
  },
   getValuesUpdate() {
    let descriptionUp = document.querySelector('input#descriptionUpdate').value 
    let amountUp = document.querySelector('input#amountUpdate').value
    let dateUp = document.querySelector('input#dateUpdate').value 
   console.log('Dados do update depois: ', descriptionUp, amountUp, dateUp)
   
   if (descriptionUp === '' || amountUp === '' || dateUp === '') {
    throw new Error('Preencha todos os campos')}
    
   storageID.setTransactions(descriptionUp, amountUp, dateUp)


 
 //  storageID.setTransaction(descriptionUp, amountUp, dateUp)
   return 'Salvo update com sucesso!'
  

  },
  

  async saveTransaction(transaction) {
   

    const result = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    })


    console.log(result)

    return 
  
  },
  clearFields() {
   document.querySelector('input#description').value = ''
   document.querySelector('input#amount').value = ''
   document.querySelector('input#date').value =''
  },

  clearFieldsUpdate() {
    document.querySelector('input#descriptionUpdate').value = ''
    document.querySelector('input#amountUpdate').value = ''
    document.querySelector('input#dateUpdate').value =''
  },
 async saveTransactionUpdate(transaction, id) {

 


    console.log('Dados do update: ', transaction, id)
    
    transaction.amount = Number(transaction.amount)
    console.log(transaction)
    

    const bodyOptions = {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date  
    }

    console.log( 'Dados do bodyOptions: ',bodyOptions)
    
    try {    
      
      const result = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyOptions)
    })

    console.log(result)
   return result
  } catch (error) {
      console.log(error)
    }

  
    
    
 },
 
   async submit(event) {
    event.preventDefault()
    


    try {
      
      console.log(Form.getValues())

        
      Modal.close()
      Form.clearFields()
 
      let transaction = storageID.getTransactions()
   //   let  transaction =  storageID.getTransaction()
      console.log('DADOS DO UPDATE DENTRO DO SAVE: ',transaction)

       await Form.saveTransaction(transaction)

   
   
      storageID.deleteTransactions()

      App.reload()
    } catch (error) {
      alert(error.message)
    }
  },

  async submitUpdate(event) {
    event.preventDefault()
    
    console.log('Dados do submitUpdate: ', event)
    

    try {
      console.log( Form.getValuesUpdate())    


      let  id =   storageID.getID()
      console.log('ID DO UPDATE DENTRO DO SAVE: ',id)
    //  let  transaction =  storageID.getTransaction()
      let transaction = storageID.getTransactions()
      console.log('TRANSACTION DO UPDATE DENTRO DO SAVE: ',Transaction)
     await Form.saveTransactionUpdate(transaction, id)

       ModalUpdate.closeUpdate()
       Form.clearFields()

       storageID.deleteID()
       storageID.deleteTransactions()
 
      App.reload()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
 async init() {
      
    const response = await fetch('http://localhost:3000/transactions')

     if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);

     }
    let transactions = await response.json();

    
   console.log('Transactions: ', transactions)
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
