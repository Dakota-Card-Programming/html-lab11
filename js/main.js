//new tone object
const synth = new Tone.synth().toDestination();

//creating a function that automatically plays the tone
function playTone(note){
    //takes 2 arguments --> the note, and duration of note
    synth.triggerAttackRelease(note, "8n");
    Tone.start();  
}

//creating a function that returns a random item from an array
function randomArrayElement(array){
    //Math.floor --> rounds down to a whole number
    //Math.random is never a whole number
    const randomIndex = Math.floor(Math.random() * array.length);
    const randomValue = array[randomIndex];
    return randomValue;
}

//choosing the 4 tones we want for simon says
const tones = ["D5", "A4", "B4", "G4"];

//selecting all the .cell classes
const cells = document.querySelectorAll(".cell");

//the keys for user to press for guessing tones
const keys = ["KeyA", "KeyS", "KeyD", "KeyF"];

//object for gameState (tone order) and playerState (userInput)
const gameState = {
    patternState: [],
    playerState: [],
};

//function that deals with the cell that is clicked
function cellActivated(event){
    //getting the cell
    const currentCell = event.target;         //current cell
    const index = currentCell.dataset.index;  //gives us the index of current cell

    //adding userInput into the array
    gameState.playerState.push(index);
    playTone(tones[index]);                   //playing tones

    //checking if patternState length === playerState length -->completed pattern
    if(gameState.patternState.length === gameState.playerState.length){
        //turns the array into a string (we cant compare arrays)
        //joins have to be identical, or else they will be seen as different
        //checking to see if the patterns match
        if(gameState.patternState.join(",") === gameState.playerState.join(",")){
            gameState.playerState = []; //emptying the array

            //
            selectRandomToneAndPlay();
    
            return true;
        }
        
        //if patternState and playerState != then game over
        alert("GAME OVER")
    }
}

//function to play a random tone
function selectRandomToneAndPlay(){
    const cell = randomArrayElement(Array.from(cells));
    const index = cell.dataset.index;

    //adding the tone to the array
    gameState.patternState.push(index);

    //storing a cloned array to destroy
    const clonedPattern = gameState.patternState.slice(0);

    //function that 'turns on' the cell
    const patternInterval = setInterval(function (){
        const i =clonedPattern.shift();

        //'turns on' our cell, reads class name in css
        cells[i].classList.toggle("on");

        //'turns off' our cell
        setTimeout(function(){
            cells[i].classList.toggle("on");  
        }, 500);

        //playing the tones
        playTone(tones[i]);

        if(clonedPattern.length === 0){
            clearInterval(patternInterval);
        }
    }, 800);
}

cells.forEach(function(cell, index){
    cell.addEventListener("click", cellActivated);
});

document.onkeydown = function(event){
    const index = keys.indexOf(event.code);

    if(index != -1){
        cells[index].click();
        cells[index].classList.toggle("on");
    }
}

document.querySelector("button").onclick = function(){
    gameState.patternState = [];
    gameState.playerState = [];
    selectRandomToneAndPlay();
}