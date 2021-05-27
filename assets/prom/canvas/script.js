/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 *
 */

 var script = (function(window, document){

    //Title Animation
    var title = document.getElementsByTagName('h1');
    title[0].addEventListener('mouseenter', function(){ this.classList.toggle('animate__bounce'); });
    title[0].addEventListener('animationend', function(){ this.classList.toggle('animate__bounce'); });

    var btn_iniciar = document.getElementById('btn_iniciar');
    var h1 = document.querySelector('h1.animate__animated');

    
    btn_iniciar.addEventListener('click', toggleDisplay);
    btn_detener.addEventListener('click', toggleDisplay);

    function toggleDisplay()
    {
        var element = document.getElementById('form_game_data');

        if (element.style.display === "none") {
            element.style.display = "flex";
            document.getElementsByTagName('canvas')[0].style.display = "none";
            btn_iniciar.style.display = "block";
            btn_detener.style.display = "none";
        } 
        else {
            element.style.display = "none";
            document.getElementsByTagName('canvas')[0].style.display = "block";
            btn_iniciar.style.display = "none";
            btn_detener.style.display = "block";
        }
    }

    //CANVAS
    let canvas;
    let ctx;
    let width;
    let height;
    let player1; //Clase Player --> player.name, player.points
    let player2; //Clase Player --> player.name, player.points
    let paddle1; //Clase Paddle --> paddle.x, paddle.y
    let paddle2; //Clase Paddle --> paddle.x, paddle.y
    let ball; //Clase Ball
    let velocity;
    let offsetX = 30;
    let paddleMovement = 6;
    let S_key;
    let W_key;
    let ArrowUp_key;
    let ArrowDown_key;


    window.onload = loadCanvas;
    document.addEventListener('keydown', keyDownEvent);
    document.addEventListener('keyup', keyUpEvent);
    var btn = document.getElementById('btn_iniciar');
    btn.addEventListener('click', loadDataGame);

    function loadCanvas(){

        canvas = document.getElementById('canvas');
        window.addEventListener('click', function(event) {
          console.log("Window", event);
        });
        canvas.addEventListener('click', function(event) {
          console.log("Canvas", event);
        });
        ctx = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;

        drawMidLine();

    }

    function loadDataGame(event){
        event.preventDefault();
        player1 = new Player(document.getElementById('player1').value, 0, "red");
        player2 = new Player(document.getElementById('player2').value, 0, "blue");

        var paddleSize = document.getElementById('paddleSize').value;
        velocity = document.getElementById('velocity').value;

        paddle1 = new Paddle(paddleSize, offsetX, height/2, "red");
        paddle2 = new Paddle(paddleSize, width - offsetX, height/2, "blue");

        ball = new Ball(width/2, height/2, 14, "black");

        S_key = false;
        W_key = false;
        ArrowUp_key = false;
        ArrowDown_key = false;

        initGame();
    }

    function drawPlayersData(){
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        player1.drawData(ctx, width/4, 20);
        player2.drawData(ctx, width - width/4, 20);
    }

    function drawMidLine(){
        ctx.save();
        ctx.setLineDash([20,10]);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 5;
        ctx.beginPath();
            ctx.moveTo(width/2, 0);
            ctx.lineTo(width/2, height);
            ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function movePaddles(){

        if (ArrowUp_key && (paddle2.y - paddle2.size/2 >= 0)){
            paddle2.incY(-paddleMovement);
        }
        if (ArrowDown_key && (paddle2.y + paddle2.size/2 <= height)){
            paddle2.incY(paddleMovement);
        }
        if (W_key && (paddle1.y - paddle1.size/2 >= 0)){
            paddle1.incY(-paddleMovement);
        }
        if (S_key && (paddle1.y + paddle1.size/2 <= height)){
            paddle1.incY(paddleMovement);
        }
    }

    function keyDownEvent(event){
        switch(event.key)
        {
            case "ArrowUp":
                ArrowUp_key = true;
                break;
            case "ArrowDown":
                ArrowDown_key = true;
                break;
            case 'w':
            case 'W':
                W_key = true;
                break;
            case's':
            case 'S':
                S_key = true;
                break;
        }
    }

    function keyUpEvent(event){
        switch(event.key)
        {
            case "ArrowUp":
                ArrowUp_key = false;
                break;
            case "ArrowDown":
                ArrowDown_key = false;
                break;
            case 'w':
            case 'W':
                W_key = false;
                break;
            case's':
            case 'S':
                S_key = false;
                break;
        }

    }

    function resetCanvas(){
        ctx.clearRect(0,0,width, height);
    }

    function drawPaddles() {
        ctx.lineWidth = "10";
        paddle1.draw(ctx);
        paddle2.draw(ctx);
    }

    function checkScore(score, ball_x){
        
        if (score){
            if (ball_x < 0)
            {
                player2.setPoints(player2.getPoints() + 1);
                ball.resetBall();
                paddle1.resetCoordinates();
                paddle2.resetCoordinates();
            }
            else if (ball_x > width)
            {
                player1.setPoints(player1.getPoints() + 1);
                ball.resetBall();
                paddle1.resetCoordinates();
                paddle2.resetCoordinates();
            }
        }
    }

    function draw() {
        resetCanvas();
        drawPlayersData();
        drawMidLine();
        movePaddles();
        drawPaddles();
        checkScore(ball.draw(ctx), ball.getX());            
        window.requestAnimationFrame(draw);
    }

    function initGame(){

        player1.setPoints(0);
        player2.setPoints(0);
        window.requestAnimationFrame(draw);
    }

    //-------------------------------------------------------
    //
    //
    //                        CLASES
    //
    //
    //-------------------------------------------------------


    class Player{

        constructor(_name, _points, _color){
            this.name = _name;
            this.points = _points;
            this.color = _color;
        }

        drawData(context, x, y){
            context.beginPath();
            context.fillStyle = this.color;
            context.fillText(this.name + ": " + this.points + " puntos", x, y);
            context.fill();
            context.closePath();
        }

        setPoints(p){
            this.points = p;
        }

        getPoints(){
            return this.points;
        }
    }

    class Ball{

        constructor(_x, _y, _size, _color){
            this.x_ini = _x;
            this.y_ini = _y;
            this.x = _x;
            this.y = _y;
            this.v = {
                x: 0,
                y: 0,
              }
            this.initVelocity();
            this.size = _size;
            this.color = _color;
        }

        initVelocity()
        {
            let random = Math.floor(Math.random() * 4) + 1;
            let angle;

            switch (random) {
                case 1:
                    angle = 35 * Math.PI / 180;
                    break;
                case 2:
                    angle = 145 * Math.PI / 180;
                    break;
                case 3:
                    angle = 215 * Math.PI / 180;
                    break;
                case 4:
                    angle = 325 * Math.PI / 180;
                    break;
            }
            
            this.v.x = Math.cos(angle) * velocity;
            this.v.y = Math.sin(angle) * velocity;
        }

        draw(context) {
            var score = this.updatePosition();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, 2*Math.PI);
            context.fill();
            context.closePath();

            return score;
        }
        resetBall(){
            var vel_x_anterior = this.v.x;
            this.x = this.x_ini;
            this.y = this.y_ini;
            this.initVelocity();

            if(vel_x_anterior < 0 && this.v.x < 0)
                this.v.x = -this.v.x;
            else if (vel_x_anterior > 0 && this.v.x > 0)
                this.v.x = -this.v.x;
        }   

        updatePosition(){
            
            var score = false;
            this.x += this.v.x;
            this.y += this.v.y;

            if (this.y - this.size < 0 || this.y + this.size > canvas.height)
            {
              this.v.y = -this.v.y;
            }

            if ((this.x - this.size <= paddle1.getX() && paddle1.checkCollision(this.y)) || (this.x + this.size >= paddle2.getX() && paddle2.checkCollision(this.y)))
            {
                this.v.x = -this.v.x;
            }

            if(this.x < 0 || this.x > width)
                score = true;
            
            return score;
        }

        getX(){
            return this.x;
        }

        getSize(){
            return this.size
        }
    }

    class Paddle{

        constructor(_s, _x, _y, _color)
        {
            this.x_ini = _x;
            this.y_ini = _y;
            this.x = _x;
            this.y = _y;
            this.size = _s;
            this.color = _color;
        }

        checkCollision(coord_y){
            
            return(coord_y > (this.y - this.size/2) && coord_y < (this.y + this.size/2))
        }

        resetCoordinates(){
            this.x = this.x_ini;
            this.y = this.y_ini;
        }

        draw(context)
        {
            context.strokeStyle = this.color;
            context.beginPath();
            context.moveTo(this.x, this.y + this.size/2);
            context.lineTo(this.x, this.y - this.size/2);
            context.stroke();
            context.closePath();
        }

        incY(inc){
            this.y += inc;
        }

        getX() {
          return this.x;
        }

        getY() {
          return this.y;
        }

        getSize(){
            return this.size;
        }
    }

    // Se puede devolver un objeto con funciones / atributos
    return {};
})(window, document);
