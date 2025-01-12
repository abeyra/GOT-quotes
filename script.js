const randomQuoteUrl = 'https://api.gameofthronesquotes.xyz/v1/random';
const houses = "https://api.gameofthronesquotes.xyz/v1/houses";
const characters = "https://api.gameofthronesquotes.xyz/v1/characters";

try {
    axios.get(randomQuoteUrl).then(response => {
        // console.log("random quote path response", response);
        const character = response.data.character.name; 
        const characterQuote = response.data.sentence; 
    
        document.querySelector(".got__character").innerText = character; 
        document.querySelector(".got__quote").innerText = characterQuote;
        let gotButton = document.querySelector(".got__button"); 
    
        gotButton.addEventListener("click", function(event){
            axios.get(randomQuoteUrl).then(response => {
    
                let character = response.data.character.name; 
                let gotCharacter = document.querySelector(".got__character");
                gotCharacter.innerText = character; 
    
                let characterQuote = response.data.sentence; 
                let quoteContainer = document.querySelector(".got__quote");
                quoteContainer.innerText = characterQuote;
            });
        });
    
    })
}

catch{
    console.error('Error fetching the data:', error);
};
