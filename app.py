from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

# Function to get the high score from a file
def get_high_score():
    if os.path.exists("highscore.txt"):
        with open("highscore.txt", "r") as file:
            return int(file.read())
    return None

# Function to save the high score to a file
def save_high_score(score):
    with open("highscore.txt", "w") as file:
        file.write(str(score))

# Function to check for achievements
def check_achievements(attempts, correct_guesses):
    achievements = []

    if attempts == 1:
        achievements.append("🏆 Achievement Unlocked: First Try Win!")
    if correct_guesses >= 3:
        achievements.append("🏆 Achievement Unlocked: Hat Trick! (3 correct guesses in a row)")
    if attempts <= 5:
        achievements.append("🏆 Achievement Unlocked: Five Tries or Less!")
    if attempts > 10:
        achievements.append("🏆 Achievement Unlocked: Persistent Player!")

    return achievements

@app.route('/')
def index():
    high_score = get_high_score()
    return render_template('index.html', high_score=high_score if high_score is not None else 0)

@app.route('/guess', methods=['POST'])
def guess():
    user_guess = int(request.form['guess'])
    number = int(request.cookies.get('number'))
    attempts = int(request.cookies.get('attempts')) + 1
    correct_guesses = int(request.cookies.get('correct_guesses', '0'))

    response = {
        'message': '',
        'attempts': attempts,
    }

    if user_guess == number:
        response['message'] = f'Congratulations! You guessed the number in {attempts} attempts.'
        response['status'] = 'correct'
        correct_guesses += 1
        response['achievements'] = check_achievements(attempts, correct_guesses)

        # Check and update high score
        high_score = get_high_score()
        if high_score is None or attempts < high_score:
            save_high_score(attempts)
            response['message'] += ' 🎉 New high score!'

    else:
        response['message'] = 'Too high! Try again.' if user_guess > number else 'Too low! Try again.'
        response['status'] = 'wrong'
        correct_guesses = 0  # Reset correct guesses on a wrong attempt

    resp = jsonify(response)
    resp.set_cookie('attempts', str(attempts))
    resp.set_cookie('correct_guesses', str(correct_guesses))

    if response['status'] == 'correct':
        resp.set_cookie('number', str(random.randint(1, 100)))
        resp.set_cookie('attempts', '0')

    return resp

@app.before_request
def before_request():
    if not request.cookies.get('number'):
        resp = app.make_response(render_template('index.html'))
        resp.set_cookie('number', str(random.randint(1, 100)))
        resp.set_cookie('attempts', '0')
        return resp

@app.route('/reset_highscore', methods=['POST'])
def reset_high_score():
    if os.path.exists("highscore.txt"):
        os.remove("highscore.txt")
    return jsonify({'message': 'High score has been reset!'})

if __name__ == '__main__':
    app.run(debug=True)
