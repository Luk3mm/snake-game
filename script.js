const play = document.querySelector(".jogo");
const scoreElemento = document.querySelector(".score");
const highScoreElemento = document.querySelector(".high-score");
const controles = document.querySelectorAll(".controles i");

let gameOver = false;
let comidaX, comidaY;
let cobraX = 5,
  cobraY = 5;
let velocidadeX = 0,
  velocidadeY = 0;
let corpoCobra = [];
let intervaloID;
let score = 0;

//pegando o highscore
let highScore = localStorage.getItem("high-score") || 0;
highScoreElemento.innerHTML = `High Score: ${highScore}`;

//posicao da comida
const updatePosicaoComida = function () {
  comidaX = Math.floor(Math.random() * 30) + 1;
  comidaY = Math.floor(Math.random() * 30) + 1;
};

//Game over
const gameOverOpcoes = function () {
  clearInterval(intervaloID);
  alert("Game Over!!! Pressione OK para jogar novamente");
  location.reload();
};

//Mudando a Velocidade
const mudandoDirecao = function (e) {
  if (e.key === "ArrowUp" && velocidadeY != 1) {
    velocidadeX = 0;
    velocidadeY = -1;
  } else if (e.key === "ArrowDown" && velocidadeY != -1) {
    velocidadeX = 0;
    velocidadeY = 1;
  } else if (e.key === "ArrowLeft" && velocidadeX != 1) {
    velocidadeX = -1;
    velocidadeY = 0;
  } else if (e.key === "ArrowRight" && velocidadeX != -1) {
    velocidadeX = 1;
    velocidadeY = 0;
  }
};

//mudando a direção
controles.forEach((button) =>
  button.addEventListener("click", () =>
    mudandoDirecao({ key: button.dataset.key })
  )
);

//inicializando
const inicializandoJogo = function () {
  if (gameOver) return gameOverOpcoes();
  let html = `<div class="comida" style="grid-area: ${comidaY} / ${comidaX}"></div>`;

  //cobra comendo
  if (cobraX === comidaX && cobraY === comidaY) {
    updatePosicaoComida();
    corpoCobra.push([comidaY, comidaX]);
    score++;
    highScore = score >= highScore ? score : highScore; //if(score >= highscore) highscore = score else highscore

    localStorage.setItem("high-score", highScore);
    scoreElemento.innerText = `Score: ${score}`;
    highScoreElemento.innerText = `High Score: ${highScore}`;
  }

  cobraX += velocidadeX;
  cobraY += velocidadeY;

  for (let i = corpoCobra.length - 1; i > 0; i--) {
    corpoCobra[i] = corpoCobra[i - 1];
  }

  corpoCobra[0] = [cobraX, cobraY];

  //verificando a cobra caso saia da tela
  if (cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
    return (gameOver = true);
  }

  for (let i = 0; i < corpoCobra.length; i++) {
    html += `<div class="cobra" style="grid-area: ${corpoCobra[i][1]} / ${corpoCobra[i][0]}"></div>`;

    //checando se a cobra bateu no corpo
    if (
      i !== 0 &&
      corpoCobra[0][1] === corpoCobra[i][1] &&
      corpoCobra[0][0] === corpoCobra[i][0]
    ) {
      gameOver = true;
    }
  }

  play.innerHTML = html;
};

updatePosicaoComida();
intervaloID = setInterval(inicializandoJogo, 100);
document.addEventListener("keyup", mudandoDirecao);
