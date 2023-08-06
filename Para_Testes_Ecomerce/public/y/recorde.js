findtransactions();

//Capturar via banco dados local a variável da página anterior
const pontuacao = parseInt(localStorage.getItem("textvalue"));
const orderedList = document.getElementById('jogadores');
var transaction = [];
var usuarios = [];
//Criando trasação

function saveTransaction(){
    if (pontuacao >0 && form.jogador().value.length >0 && usuarios.includes(form.jogador().value) == false ){
        transaction = createTransaction();

    firebase.firestore()
        
        .collection('jogadores')
        .add(transaction)
        .then(()=>{
            console.log("Criando transação");
            document.location.reload();
        })
        .catch(()=>{
            alert('Erro ao salvar transação');
        })
    }
    else{
        alert('Campo em Branco ou Zero Pontos');
       
    }
}

function createTransaction(){
    return{
        jogador: form.jogador().value,
        pontos: pontuacao   
    };
}

const form = {
 
    jogador: () => document.getElementById('nome'),

}

function findtransactions(){
    
    firebase.firestore()
        .collection('jogadores')
        .orderBy('pontos','desc')
        .get()
        .then(snapshot=>{
                const transaction = snapshot.docs.map(doc => doc.data());
                usuarios = snapshot.docs.map(doc => doc.data().jogador);
                console.log(transaction);
                console.log(usuarios);
                console.log(form.jogador().value);
                addTransactionsToScreen(transaction);      
                
    })
    .catch(error => {
        console.log(error);
        alert('Erro ao recuperar transações');
    })
}


function addTransactionsToScreen(transaction){
    
        transaction.forEach(transaction=>{
        
        const li = document.createElement('li');
        const jogador = document.createElement('p');
        const pontos = document.createElement('p');
        jogador.innerHTML = transaction.jogador+"  -- "+transaction.pontos+" Pontos";
        li.appendChild(jogador);
            
        orderedList.appendChild(li);  
    });
}
