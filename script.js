const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// Criando Variáveis
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // definindo o fundo da tela inteira como branco, para que o fundo da imagem baixada seja branco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // definindo estilo de preenchimento de volta para a cor selecionada, será a cor do pincel
}

window.addEventListener("load", () => {
    // configurando largura/altura da tela largura de deslocamento/height retorna largura/altura visível de um elemento
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // se a cor de preenchimento não estiver selecionado desenhe um retângulo com borda senão desenhe um retângulo com fundo
    if(!fillColor.checked) {
        // criando círculo de acordo com o ponteiro do mouse
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // criando novo caminho para desenhar círculo
    // obtendo raio para círculo de acordo com o ponteiro do mouse
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // criando círculo de acordo com o ponteiro do mouse
    fillColor.checked ? ctx.fill() : ctx.stroke(); // se cor de preenchimento estiver marcado, preencha o círculo, caso contrário, desenhe o círculo de borda

}

const drawTriangle = (e) => {
    ctx.beginPath(); // criando novo caminho para desenhar círculo
    ctx.moveTo(prevMouseX, prevMouseY); //movendo o triângulo para o ponteiro do mouse
    ctx.lineTo(e.offsetX, e.offsetY); // criando a primeira linha de acordo com o ponteiro do mouse
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // criando a linha inferior do triângulo
    ctx.closePath(); // caminho de fechamento de um triângulo para que a terceira linha seja desenhada automaticamente
    fillColor.checked ? ctx.fill() : ctx.stroke(); // se a cor de preenchimento estiver assinalada preencha o triângulo caso contrário desenhe a borda

}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passando a posição atual do mouse como valor prevMouseX
    prevMouseY = e.offsetY; // passando a posição atual do mouse como valor anterior
    ctx.beginPath(); // criando novo caminho para desenhar
    ctx.lineWidth = brushWidth; // pincel de passagem Tamanho como largura da linha
    ctx.strokeStyle = selectedColor; // passando a cor selecionada como estilo de traçado
    ctx.fillStyle = selectedColor; // passando a cor selecionada como estilo de preenchimento
    // copiando os dados da tela e passando como valor instantâneo .. isso evita arrastar a imagem
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // se o desenho for falso, retorne daqui
    ctx.putImageData(snapshot, 0, 0); // adicionando dados de tela copiados a esta tela
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // se a ferramenta selecionada for borracha, defina StrokeStyle como branco
        // para pintar a cor branca no conteúdo da tela existente, caso contrário, defina a cor do traçado para a cor selecionada
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // criando linha de acordo com o ponteiro do mouse
        ctx.stroke(); // desenhar/preencher linha com cor
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adicionando evento de clique a todas as opções de ferramentas
        // removendo a classe ativa da opção anterior e adicionando a opção atual clicada
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passando o valor do controle deslizante como Tamanho do pincel
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adicionando evento de clique a todos os botões de cor
        // removendo a classe selecionada da opção anterior e adicionando a opção atual clicada
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passando a cor de fundo do botão selecionado como valor de cor selecionado
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passando o valor da cor escolhida do seletor de cores para a última cor btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpando toda a tela
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // criando elemento <a>
    link.download = `${Date.now()}.jpg`; // passando a data atual como valor de download do link
    link.href = canvas.toDataURL(); // passando dados da tela como valor de link href
    link.click(); // clicando no link para baixar a imagem

});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);