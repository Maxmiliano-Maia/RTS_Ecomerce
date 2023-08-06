window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    let comecou = false;
    let Quest = false;
    var speed = 0;
    const fullScreenButton = document.getElementById('fullScreenButton');
    const sim = document.getElementById('sim');
    const nao = document.getElementById('nao');
    const sair = document.getElementById('sair');
    const botaoCerto = document.getElementById('botaoCerto');
    const botaoErrado = document.getElementById('botaoErrado');
    const botaoMute = this.document.getElementById('mute');
    let x = document.getElementById('myAudio');
    let press_mute = false;
    let elem1 = document.querySelector("body");

    const myKeysValues = window.location.search;

    const urlParams = new URLSearchParams(myKeysValues);

    const param1 = urlParams.get('resposta');

    console.log(window.location.search);

    function playAudio(){
       
        press_mute = !press_mute
        if (press_mute){
            
            x.play();
            x.volume = 0.05;
        }
        else
        {
            x.pause();
        }
   
    }

    //-----Tela de perguntas as demais Tela1, Tela2... são os demais eventos  -----
       
    //const Tela =  document.getElementById("Tela");
    const Tela = document.querySelector('.modal');
    const Tela3 = document.querySelector('.modal3');
       
    class InputHandler{
        constructor(){
            this.keys = [];
            this.touchY = '';
            this.touchX = '';
            this.touchTreshold = 1;
            this.touchTresholdX = 30;
            window.addEventListener('keydown', e => {
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key=== 'ArrowLeft' || 
                        e.key === 'ArrowRight') 
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }else if (e.key === 'Enter') document.location.reload();
               
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight'){
                this.keys.splice(this.keys.indexOf(e.key), 1);
                
            }
                
            });
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY
                this.touchX = e.changedTouches[0].pageX
            });
            window.addEventListener('touchmove', e => {  
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) 
                    this.keys.push('swipe up');
                else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1){
                    this.keys.push('swipe down'); 
                   if (gameOver) document.location.reload();
                }
                else if (swipeDistanceX > this.touchTresholdX && this.keys.indexOf('swipe right') === -1){
                    this.keys.push('swipe right');
                    console.log("Indo para frente");
                }
                        
                else if (swipeDistanceX < -this.touchTresholdX && this.keys.indexOf('swipe left') === -1){
                    this.keys.push('swipe left'); 
                    console.log("Tentando ir para tras");
                }
                         
            });
            
            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
                this.keys.splice(this.keys.indexOf('swipe right'),1);
                this.keys.splice(this.keys.indexOf('swipe left'),1);
            });
        }
    }

    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context){
            // ----------------Comandos para desenhar o box colider ---------------
            // context.lineWidth = 5;
            // context.strokeStyle = 'white';
            // context.beginPath();
            // ---------// Reposiocionar o box colider           --Aqui--
            // context.arc(this.x + this.width/2, this.y + this.height/2+20, this.
            // width/3, 0, Math.PI * 2);
            // context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.
            height, this.x, this.y, this.width, this.height );
        }
        
        update(input, deltaTime, enemies){
            //calculate Collision detection
            
            //srpite animation
                    if (this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame) this.frameX = 0;
                    else this.frameX++;
                    this.frameTimer = 0;
                }else{
                    this.frameTimer += deltaTime;
                }
        
            //controls
            if (input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('swipe right') > -1){
                speed = 5;
            }
            else if (input.keys.indexOf('ArrowLeft') > -1 || input.keys.indexOf('swipe left') > -1){
                speed = -5;
            }
            else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()){
                this.vy -= 32;
              
            }    
            else{
                speed = 0;
            }
            // horizontal movement
            this.x += speed;
            if(this.x<0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            //vertical movement
            this.y += this.vy;
            if (!this.onGround()){
                this.vy += this.weight;
                this.maxFrame = 5
                this.frameY = 1;
            }else{
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height

     }
     onGround(){
        return this.y >= this.gameHeight - this.height;
     }
}

    class Background{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;   
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        
        } 
        update(){
            this.x -= this.speed;
            if (this.x<0 - this.width) this.x = 0;
        } 
        restart(){
            this.x = 0;
        } 
    }


    function displayStatusText(context){
      
        if(gameOver){
            // Chamando o modal da tela de GameOver
            Tela3.classList.add('visivel3');
            passvalues();

        }
     
    }
   
    function toggleFullScreen(){
        playAudio();
        comecou = !comecou;     
        animate(0);
        if (!document.fullscreenElement){
            elem1.requestFullscreen().catch(err => {
               // --------------------------------------------->>>> Usou a crase so pra concatenar ?!
                alert(`Erro, Tela cheia não permitida: ${err.message}`);
            })
        
        }else{
            document.exitFullscreen();
        } 
     }

     function fechar(){
        comecou = !comecou;          
        document.exitFullscreen();
        x.pause();       
     }

     function tela_recorde(){
        window.location = "recorde.html";
     }

     function reiniciar(){
        document.location.reload();
     }
          
    function RespostaCerta(){
        Quest = !Quest;    
        Tela.classList.remove('visivel');
        botaoCerto.classList.remove('visivel4');
        botaoErrado.classList.remove('visivel4');
        animate(0);
        resposta = true;
        score += 20;
        x.play();
        x.volume = 0.05;                          
    }


    //Enviar via banco de dados local a variavel para outra página
    function passvalues(){
        var pontos = score;
        localStorage.setItem("textvalue",pontos);
        return false;
    }
    
    //----------------------Botões-------------------------
    fullScreenButton.addEventListener('click', toggleFullScreen);
    sim.addEventListener('click', tela_recorde);
    nao.addEventListener('click', reiniciar);
    sair.addEventListener('click', fechar);
    botaoCerto.addEventListener('click',RespostaCerta);
   
    botaoMute.addEventListener('click',playAudio);
           
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    
    let lastTime = 0;
    
    lastTimeInteiro = 0;
    
    function animate(timeStamp){
        //Decidirá de forma aleatória a posição da resposta correta ------------------
        posicao_Resposta = Math.round(Math.random()*10);
        
        // Atualizar posntos 
        document.getElementById("score").innerHTML =score;
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
          
          if (lastTime>5000){
            console.log(lastTime);
            speed += -50;
          }
        ctx.clearRect(0,0,canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
      
        displayStatusText(ctx);
       
        if(!gameOver && !Quest && comecou) requestAnimationFrame(animate);
           
    }
    animate(0);
    
});
    
