const url = 'https://api.gameofthronesquotes.xyz/v1/random';

axios.get(url).then(response => {
    console.log('firing');

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

    // Add event listener here after the button is added to the DOM
    console.log(gotButton)
    gotButton.addEventListener("click", function(event){
        axios.get(url).then(response => {
            console.log('click');
            let character = response.data.character.name; 
            let gotCharacter = document.querySelector(".got__character");
            gotCharacter.innerText = character; 

            let characterQuote = response.data.sentence; 
            let quoteContainer = document.querySelector(".got__quote");
            quoteContainer.innerText = characterQuote;
        });
    });

})

.catch(error => {
    console.error('Error fetching the data:', error);
});
