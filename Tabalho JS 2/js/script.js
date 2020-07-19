let input = null;
let inputTarget = null;
let inputBtn = null;
let cardTitleLeft = null;
let cardTitleRight = null;
let userCard = null;
let mapCard = null;
let allUsers = null;
let preLoad = null;
let resFilter = null;
let totalAge = null;
let totalUser = null;
let sexMasc = null;
let sexFem = null;
let mediaAge = null;
let rowStatics = null;
let numberFormat = null;
let totalAgeFor = null;
let mediaAgeFor = null;

window.addEventListener("load", () => {
  preLoad = document.querySelector("#pre-load");
  input = document.querySelector("#inputarea");
  inputBtn = document.querySelector("#btn");
  cardTitleLeft = document.querySelector("#return-user");
  userCard = document.querySelector("#usercard");
  cardTitleRight = document.querySelector("#title-estatistica");
  mapCard = document.querySelector("#mapcard");
  rowStatics = document.querySelector("#row-statics");
  numberFormat = Intl.NumberFormat('pt-BR');
  

  fetchUsers();
  activateImput();
  clickBtn();
  setTimeout(() => {
    preLoad.classList.add('d-none');
    input.removeAttribute("disabled");
    input.focus();
  }, 1000);
});



async function fetchUsers() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  allUsers = json.results.map(user => {
    const { picture, name, gender, dob } = user;

    return {
      picture: picture.medium,
      name: name.first+ ' ' + name.last,
      gender,
      age: dob.age,
    };
  });
  console.log(allUsers.name);
}

function filterInput(inputUser){
  if (inputUser !== ''){
    resFilter = allUsers.filter(user => {
      let userCase = user.name;
      let userCaseConv = userCase.toLowerCase();
      return userCaseConv.includes(inputUser);    
    });
    console.log(resFilter);
    totalAge = resFilter.reduce((acc, curent) => {
      return acc + curent.age;
    }, 0);
    console.log(totalAge);
    sexMasc = resFilter.reduce((acc, curent) => {
      return acc + (curent.gender === 'male' );
    }, 0);
    console.log(sexMasc);
    sexFem = resFilter.reduce((acc, curent) => {
      return acc + (curent.gender === 'female' );
    }, 0);
    console.log(sexFem);
    totalUser = resFilter.length;  
    mediaAge = totalAge / totalUser;
    console.log(mediaAge);
    totalAgeFor = formatNumber(totalAge);
    console.log(totalAgeFor);
    mediaAgeFor = formatNumber(mediaAge);
    console.log(mediaAgeFor);
  if (totalUser > 1){
    cardTitleLeft.textContent = `${totalUser} usuários encontrados`;
    cardTitleRight.textContent = `Estatísticas dos Usuários`;
    renderStatics(); 
  }else if (totalUser === 1){
    cardTitleLeft.textContent = `${totalUser} usuário encontrado`;
    cardTitleRight.textContent = `Estatística do Usuário`; 
    renderStatics();   
  }else{
    cardTitleLeft.textContent = `Nenhum usuário encontrado`;    
  }
  renderUser();
}else{
  return;   
}
}



function renderUser(){
  let usersHTML = "<div>";
  if (resFilter !== ''){
  resFilter.forEach(user =>{
    const {picture, name, age} = user;

    const userHTML = `
      <div class="row res-row-user z-depth-4">      
      <div class="col s4 right-align"><img class="responsive-img" id="img" src="${picture}"/></div>
      <div class="col s8"  id="names"><span>${name}, ${age} anos.</span></div>
      </div>
    `;
    usersHTML += userHTML;
  });
  usersHTML += "</div>";
  userCard.innerHTML = usersHTML;
}
}

function clickBtn(){
  function mouseUp(){
    let inputCase = input.value;
    let inputCaseConv = inputCase.toLowerCase();
   filterInput(inputCaseConv);
   input.focus();
  }
  inputBtn.addEventListener('mouseup', mouseUp);
}

function activateImput(){
  function handleTyping(event){
    let inputCase = event.target.value;
    let inputCaseConv = inputCase.toLowerCase();
    if (event.key === 'Enter'){
      filterInput(inputCaseConv);
    }else if (event.target.value !== ''){
      inputBtn.classList.remove('disabled');
    }    
    else{
      inputBtn.classList.add('disabled');
      resFilter = '';
      userCard.innerHTML = '';      
      cardTitleLeft.textContent = `Aguardando pesquisa`;
      cardTitleRight.textContent = `Aguardando pesquisa`;
      mapCard.innerHTML = '';
    }
  }

  input.focus();
  input.addEventListener('keyup', handleTyping);
}

function renderStatics(){
  const mapCardTest = `
  <ul>
  <li class="bold">Sexo masculino: ${sexMasc} pessoas.</li>
  <li class="bold">Sexo feminino: ${sexFem} pessoas.</li>
  <li class="bold">Soma das idades: ${totalAgeFor} anos.</li>
  <li class="bold">Media das idades: ${mediaAgeFor} anos.</li>      
  </ul>
`;
  mapCard.innerHTML = mapCardTest;
}


function formatNumber(number){
  return numberFormat.format(number);
}