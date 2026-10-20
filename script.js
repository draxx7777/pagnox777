let balance = 1000.00;
let currentBet = 10.00;
let isSpinning = false;

// Banco de emoticons temáticos do jogo
const poolSymbols = ['🐯', '🍊', '🧧', '🪙', '💎', '🔥', '🍒'];

// Mapeia todas as 9 células da grade 3x3 do HTML
const gridIds = [
    ['c00', 'c01', 'c02'],
    ['c10', 'c11', 'c12'],
    ['c20', 'c21', 'c22']
];

function changeBet(amount) {
    if (isSpinning) return;
    currentBet += amount;
    if (currentBet < 2) currentBet = 2; // Aposta mínima
    if (currentBet > 100) currentBet = 100; // Aposta máxima
    document.getElementById('bet-display').innerText = currentBet.toFixed(2);
}

function triggerSpin() {
    if (isSpinning) return;
    
    if (balance < currentBet) {
        updateStatus("❌ SALDO INSUFICIENTE!", "#ff3333");
        return;
    }

    isSpinning = true;
    balance -= currentBet;
    document.getElementById('balance-display').innerText = balance.toFixed(2);
    document.getElementById('win-display-val').innerText = "0.00";
    updateStatus("BOBINAS GIRANDO...", "#ffe066");
    
    // Efeito Visual de Pulo do Tigre
    document.getElementById('tiger-emoji').style.transform = "scale(1.3) translateY(-10px)";
    document.getElementById('bubble-speech').innerText = "MANDA BUSCAR! 🐯🚀";

    // Adiciona classe CSS de desfoque/giro nas células
    for(let r=0; r<3; r++) {
        for(let c=0; c<3; c++) {
            document.getElementById(gridIds[r][c]).classList.add('blur-spin');
        }
    }

    // Executa a parada sequencial dos rolos após 1.2 segundos
    setTimeout(() => {
        stopSlotAndCheck();
    }, 1200);
}

function stopSlotAndCheck() {
    // Matriz para guardar os resultados sorteados
    let matrix = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Remove efeito visual de desfoque e preenche com símbolos aleatórios
    for(let r=0; r<3; r++) {
        for(let c=0; c<3; c++) {
            let cell = document.getElementById(gridIds[r][c]);
            cell.classList.remove('blur-spin');
            
            // Dá mais chance de sair o Tigre ('🐯') para manter emocionante
            let randomSymbol = Math.random() < 0.22 ? '🐯' : poolSymbols[Math.floor(Math.random() * poolSymbols.length)];
            matrix[r][c] = randomSymbol;
            cell.innerText = randomSymbol;
        }
    }

    // Volta o tamanho do tigre ao normal
    document.getElementById('tiger-emoji').style.transform = "scale(1)";

    // Lógica Matemática de Verificação de Linhas de Ganho (Horizontal e Diagonal)
    let totalWinMultiplier = 0;
    let hitLines = 0;

    // 1. Linhas Horizontais (Superior, Meio, Inferior)
    for (let r = 0; r < 3; r++) {
        if (matrix[r][0] === matrix[r][1] && matrix[r][1] === matrix[r][2]) {
            totalWinMultiplier += getSymbolWeight(matrix[r][0]);
            hitLines++;
        }
    }

    // 2. Diagonais (Cruzamento)
    if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
        totalWinMultiplier += getSymbolWeight(matrix[0][0]);
        hitLines++;
    }
    if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
        totalWinMultiplier += getSymbolWeight(matrix[0][2]);
        hitLines++;
    }

    // Calcula premiação financeira
    if (totalWinMultiplier > 0) {
        let finalPrize = currentBet * totalWinMultiplier;
        balance += finalPrize;
        
        document.getElementById('balance-display').innerText = balance.toFixed(2);
        document.getElementById('win-display-val').innerText = finalPrize.toFixed(2);
        
        updateStatus(`GANHOU R$ ${finalPrize.toFixed(2)} (x${totalWinMultiplier})! 🎉`, "#4cd964");
        document.getElementById('bubble-speech').innerText = "O TIGRE SOLTOU A CARTA! 💰🐅";
    } else {
        updateStatus("NENHUMA COMBINAÇÃO. TENTE DE NOVO!", "#ffe066");
        document.getElementById('bubble-speech').innerText = "Mais um giro, amigo! 🧧";
    }

    isSpinning = false;
}

// Retorna multiplicadores diferentes dependendo do símbolo que alinhar
function getSymbolWeight(symbol) {
    switch(symbol) {
        case '🐯': return 10; // O Tigre paga o valor máximo (10x a aposta)
        case '💎': return 5;
        case '🪙': return 3;
        case '🧧': return 2;
        default: return 1.5;   // Frutas e outros pagam menos
    }
}

function updateStatus(text, color) {
    const el = document.getElementById('status-text');
    el.innerText = text;
    el.style.color = color;
}
