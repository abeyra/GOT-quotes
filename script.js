const url ='https://game-of-thrones-quotes.herokuapp.com/v1/random';

axios.get(url).then(response => {
    console.log(response.data);
    console.log(response.data.character.name); 
    console.log(response.data.sentence);

    const character = response.data.character.name; 
    const characterQuote = response.data.sentence; 

    let gotContainer = document.querySelector(".got__container"); 

    let gotCharacter = document.createElement("h1"); 
    gotCharacter.classList.add("got__character"); 
    gotCharacter.innerText = character; 

    let quoteContainer = document.createElement("p"); 
    quoteContainer.classList.add("got__quote"); 
    quoteContainer.innerText = characterQuote; 

    let gotButton = document.createElement("button"); 
    gotButton.classList.add("got__button"); 
    gotButton.innerText = "Get New Quote"; 

    gotContainer.appendChild(gotCharacter); 
    gotContainer.appendChild(quoteContainer);
    gotContainer.appendChild(gotButton); 
    
}).then(response =>{
    let gotButton = document.querySelector(".got__button"); 

    gotButton.addEventListener("click", function(event){
    // event.preventDefault(); 
    console.log("button clicked!");
    axios.get(url).then(response => {
            let character = response.data.character.name; 
            let gotCharacter = document.querySelector(".got__character");
            gotCharacter.innerText = character; 

            let characterQuote = response.data.sentence; 
            let quoteContainer = document.querySelector(".got__quote");
            quoteContainer.innerText = characterQuote;
        });
    });
}); 
