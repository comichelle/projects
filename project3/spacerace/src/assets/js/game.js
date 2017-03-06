$(document).ready(function() {
    console.log("YAY!")

    // ==========================
    // =      Game Config       =
    // ==========================
    var gameConfig = {
        difficulties: [
            {
                dificulty: 'Easy', 
                questions: 15
            }, 
            {
                dificulty: 'Normal', 
                questions: 21
            }, 
            {
                dificulty: 'Hard', 
                questions: 30
            }
        ],
        astronauts: [
            'Ryan', 
            'Simon', 
            'Sylvia', 
            'Tiffany'
        ],
        statementValues: [
            50, 
            100, 
            150, 
            200, 
            250, 
            300
        ],
        logicOperators: [
            "||", 
            "&&"
        ],
        comparisonOperators: [
            "<", 
            ">", 
            "===", 
            "<=", 
            ">="
        ]
    }

    // ==========================
    // =      Game Object       =
    // ==========================

    var selectedAstonaut = 0;
    var selectedDifficulty = 0;
    var game;
    var countDownTimer;

    function getRandomFromArray(array) {
        var randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    var startTime = 10;
    var $question = $('.question');
    var $clock = $('.clock');
    var $currentFuel = $('.currentFuel')
    var $maxFuel = $('.maxFuel')
    var $spaceWrapper = $('.spaceWrapper');

    // -------------------------
    // - Setup Countdown Timer -
    // -------------------------
    console.log('[NEW TIMER]');
    countDownTimer = {
        timer: undefined,
        startTime: startTime,
        currentTime: startTime,
        interval: 1000,
        
        updateClockElement: function() {
             $clock.html(this.currentTime);
        },

        countDown: function() {
            if(this.currentTime < 0) {
                this.currentTime = this.startTime;
                game.nextQuestion();
            }
            // Update HTML Element with new time
            this.updateClockElement();
            this.currentTime--;
        },

        initialize: function() {
            console.log('[INIT]');
            this.timer = window.setInterval(function() { countDownTimer.countDown() }, this.interval);
        },

        resume: function() {
            console.log('[RESUME]');
            initialize();
        },

        pause: function() {
            console.log('[PAUSE]');
            window.clearInterval(this.timer);
        },

        restart: function() {
            console.log('[RESTART]');
            this.currentTime = this.startTime;
            this.pause();
            // Update HTML Element with new Time
            this.updateClockElement();
            this.initialize();
        }
    };


    // -------------------------
    // -       Setup Game      -
    // -------------------------
    console.log('[NEW GAME]');
    game = {
        difficulty: 0,
        astronaut: 0,
        fuel: 0,
        currentFuel: 0,
        numberOfQuestions: 0,
        questions: [],
        currentQuestion: 0,

        // Changes to the next question, and updates the question HTML element
        nextQuestion: function(correctAnswer = false) {
            if(this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion += 1;
                this.currentFuel -= (this.questions.length * 0.05);
                // Update HTML Element with new Question
                $question.html(this.questions[this.currentQuestion].question);
                if(correctAnswer) {
                    this.updateFuel();
                }
                
            }
        },

        updateFuel: function() {
            console.log('[length] ' + this.questions.length);
            console.log('[current] ' + this.currentQuestion);

            var maxWrongAnswers = 5;
            var numberOfQuestions = this.questions.length + maxWrongAnswers;
            var currentQuestion = this.currentQuestion;

            $currentFuel.html(
                Math.floor(
                    (((numberOfQuestions - 1) - currentQuestion) / (numberOfQuestions - 1)) * 100
                )
            );
        },

        moveShip: function() {
            var numberOfQuestions = this.questions.length;
            var currentQuestion = this.currentQuestion;

            var spacePosition = Math.floor(
                (((numberOfQuestions - 1) - currentQuestion) / (numberOfQuestions - 1)) * 100
            );

            if(spacePosition > 0) {
                spacePosition = spacePosition - (numberOfQuestions - 1);
            }

            $spaceWrapper.css("background-position", `center ${spacePosition}%`);
        },

        // Generates an array of questions based on the selected game difficulty
        generateQuestions: function(numberOfQuestions) {
            var stepSize = (numberOfQuestions / 3)

            for(var difficultyStep = stepSize; difficultyStep <= numberOfQuestions; difficultyStep = difficultyStep + stepSize) {
                var questionDifficulty = (difficultyStep / stepSize);
                for(var i = 0; i < stepSize; i++) {
                    this.questions.push(this.generateQuestion(questionDifficulty));
                }
            }
        },

        // Returns a randomly generated question with a numeric difficulty parameter (1-3)
        generateQuestion: function(questionDifficulty) {
            var statementValues = [];
            var comparisionOperators = [];
            var logicOperators = [];
            var question = '';
            var answer = '';

            var numberOfValues = questionDifficulty * 2;
            var numberOfComparisonOperators = questionDifficulty;
            var numberOfLogicOperators = questionDifficulty - 1;

            // Get a random values from an array that will be used for comparison in the in logic statement
            for(var i = 0; i <= numberOfValues; i++) {
                statementValues.push(getRandomFromArray(gameConfig.statementValues));
            }

            // Get a random comparison operators from an array that will be used for comparison in the in logic statement
            for(var i = 0; i <= numberOfComparisonOperators; i++) {
                comparisionOperators.push(getRandomFromArray(gameConfig.comparisonOperators));
            }

            // Get a random logic operators from an array, that will be used for comparison in the in logic statement
            for(var i = 0; i <= numberOfLogicOperators; i++) {
                logicOperators.push(getRandomFromArray(gameConfig.logicOperators));
            }

            // TODO(Brian): Dry out this code
            // for(var i = 0; i <= questionDifficulty; i++) {
            //     question += ``
            // }
            if(questionDifficulty === 1) {
                question = `${statementValues[0]} ${comparisionOperators[0]} ${statementValues[1]}`;
            }
            else if(questionDifficulty === 2){
                question = `${statementValues[0]} ${comparisionOperators[0]} ${statementValues[1]} ${logicOperators[0]} ${statementValues[2]} ${comparisionOperators[1]} ${statementValues[3]}`;
            }
            else if(questionDifficulty === 3){
                question = `${statementValues[0]} ${comparisionOperators[0]} ${statementValues[1]} ${logicOperators[0]} ${statementValues[2]} ${comparisionOperators[1]} ${statementValues[3]} ${logicOperators[1]} ${statementValues[4]} ${comparisionOperators[2]} ${statementValues[5]}`;
            }

            answer = eval(question);

            return {question, answer};
        },
        
        initialize: function() {
            this.difficulty = gameConfig.difficulties[selectedDifficulty].dificulty;
            this.astronaut = gameConfig.astronauts[selectedAstonaut];
            this.fuel = gameConfig.difficulties[selectedDifficulty].fuel;
            this.currentFuel = gameConfig.difficulties[selectedDifficulty].fuel;
            this.numberOfQuestions = gameConfig.difficulties[selectedDifficulty].questions;
            this.questions = [];
            this.currentQuestion = 0;

            this.generateQuestions(game.numberOfQuestions);

            $question.html(this.questions[this.currentQuestion].question);
            // $currentFuel.html(this.currentFuel);
            this.updateFuel();
            this.moveShip();
            $maxFuel.html(((this.questions.length) / this.questions.length) * 100);

            console.log(this.currentFuel);
        },

        start: function() {
            this.initialize();
            countDownTimer.initialize();
        }, 

        restart: function() {
            this.initialize();
            countDownTimer.restart();
        }
    }

    game.start();

    // ==========================
    // =     Event Handers      =
    // ==========================

    $('button').on('click', function() {
        // A variable to hold the button that was clicked
        var buttonClicked = $(this);


        if(buttonClicked.val() === 'initGame') {
            game.restart();
            countDownTimer.restart();
        } 
        else if(buttonClicked.val() === 'pause') {
            countDownTimer.pause();
        } 
        else if(buttonClicked.val() === 'start') {
            countDownTimer.resume();
        }
        else if(buttonClicked.val() === 'restart') {
            countDownTimer.restart();
        }
        else if(eval(buttonClicked.val()) === game.questions[game.currentQuestion].answer) {
            // Checks if asnwer is correct, eval converts the .val() value from the button to a boolean
            console.log('CORRECT');
            // $spaceWrapper.css( "background-position", "center 1%" );
            

            game.moveShip();
            // console.log(game.currentQuestion + " / " + (game.questions.length - 1));
            game.nextQuestion(true);
            

        }
        else {
            console.log('WRONG');
        }
    });
});
