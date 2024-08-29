let maxNumber = 100;
let randomNumber = Math.floor(Math.random() * maxNumber) + 1;
let attempts = 0;
let timeLeft = 60; // 60 seconds countdown
let timerInterval;
let level = 1; // Start at level 1

function setDifficulty() {
    // Increase the maxNumber based on the current level
    maxNumber = document.getElementById("difficulty").value * level;
    randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    document.getElementById("maxNumber").textContent = maxNumber;

    resetGame();
}

function submitGuess() {
    const userGuess = parseInt(document.getElementById("guess").value);
    const message = document.getElementById("message");
    const emoji = document.getElementById("emoji");
    const attemptsDisplay = document.getElementById("attempts");
    const resetBtn = document.getElementById("resetBtn");

    attempts++;

    if (userGuess === randomNumber) {
        message.textContent = `🎉 Congratulations! You guessed the number in ${attempts} attempts.`;
        message.style.color = "green";
        emoji.textContent = "🥳";
        emoji.style.animation = "bounce 0.5s ease";
        resetBtn.style.display = "block";
        document.getElementById("submitBtn").style.display = "none";
        document.getElementById("guess").disabled = true;
        document.body.style.backgroundColor = "hsl(120, 100%, 85%)"; // Set background to green on correct guess

        clearInterval(timerInterval);

        checkAchievements();

        // Proceed to the next level if there are more levels
        if (level < 5) {
            setTimeout(() => {
                level++;
                alert(`Level ${level} - Get ready for a new challenge!`);
                setDifficulty();
            }, 2000);
        } else {
            alert("🏆 Congratulations! You've completed all levels!");
        }

    } else {
        if (userGuess > randomNumber) {
            message.textContent = "📉 Too high! Try again.";
        } else {
            message.textContent = "📈 Too low! Try again.";
        }
        message.style.color = "red";
        emoji.textContent = "😅";
        emoji.style.animation = "shake 0.5s ease";
    }

    attemptsDisplay.textContent = `Attempts: ${attempts}`;

    setTimeout(() => {
        emoji.style.animation = ""; // Reset animation to allow it to re-trigger on the next guess
    }, 500);
}

function checkAchievements() {
    if (attempts === 1) {
        alert("🏆 Achievement Unlocked: First Try Win!");
    } else if (attempts <= 5) {
        alert("🏆 Achievement Unlocked: Five Tries or Less!");
    } else if (attempts > 10) {
        alert("🏆 Achievement Unlocked: Persistent Player!");
    }
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    timeLeft = 60; // Reset timer to 60 seconds

    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = "Attempts: 0";
    document.getElementById("guess").value = "";
    document.getElementById("guess").disabled = false;
    document.getElementById("submitBtn").style.display = "block";
    document.getElementById("resetBtn").style.display = "none";
    document.getElementById("emoji").textContent = "🤔"; // Reset emoji to thinking face
    document.body.style.backgroundColor = "hsl(60, 100%, 85%)"; // Reset background to neutral color

    clearInterval(timerInterval);
    startTimer();
}

function startTimer() {
    document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("message").textContent = "⏰ Time's up! You lose!";
            document.getElementById("guess").disabled = true;
            document.getElementById("submitBtn").style.display = "none";
            document.getElementById("resetBtn").style.display = "block";
            document.body.style.backgroundColor = "hsl(0, 100%, 85%)"; // Set background to red on loss
        }
    }, 1000);
}

document.getElementById("guess").addEventListener("input", function() {
    document.getElementById("message").textContent = "";
    document.getElementById("emoji").textContent = "🤔"; // Reset emoji when typing
    document.body.style.backgroundColor = "hsl(60, 100%, 85%)"; // Reset background to neutral while typing
});

// Initialize the game with the selected difficulty level
setDifficulty();
