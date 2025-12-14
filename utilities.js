import {player, dealer} from './main.js';

export const cardValues = {
  "ACE": 11,  // Ace (can also be 1, handled in game logic)
  "JACK": 10,  
  "QUEEN": 10,  
  "KING": 10, 
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10
};

export function resetObjects(){
    player.deck.length = 0
    player.score = 0
    player.ace11 = false

    dealer.deck.length = 0
    dealer.score = 0
    dealer.ace11 = false
}

export function resetBoard() {
    // Clear card images
    document.getElementById("player-hand").innerHTML = "";
    document.getElementById("dealer-hand").innerHTML = "";

    // Reset scores
    document.getElementById("player-total").textContent = "";
    document.getElementById("dealer-total").textContent = "";

    // Reset winner text + hide winner box
    document.getElementById("winner-text").textContent = "";
    document.getElementById("winner").style.display = "none";

    // Show hit/stand again
    document.getElementById("hit-stand").style.display = "flex";
}


export function displayCard(id, source){
    let cardDiv = document.createElement("div")
    cardDiv.className = "card-div"
    let cardImg = document.createElement("img")
    cardImg.src = source

    if(source.endsWith('.svg')){
        cardImg.classList = "svg-img"
    }
    cardDiv.appendChild(cardImg)
    document.getElementById(id).appendChild(cardDiv)
}

export function displayHoleCard(){
    const container = document.getElementById("dealer-hand")
    const secondChild = container.children[1]
    container.removeChild(secondChild)
    const source = dealer.deck[1].images.svg
    displayCard("dealer-hand", source)
}


export function disableHitStand() {
    document.getElementById("hit-stand").style.display = "none";
    document.getElementById("winner").style.display = "flex"; 
}
