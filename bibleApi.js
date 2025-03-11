'use strict'

async function buscarVersiculo() {
    const referencia = document.getElementById('versiculo').value;
    if (!referencia) {
        alert('Digite uma referência válida!');
        return;
    }
    
    try {
        const url = `https://bible-api.com/${encodeURIComponent(referencia)}?translation=almeida`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error('Versículo não encontrado');
        }
        
        sessionStorage.setItem('versiculo', JSON.stringify(data));
        window.location.href = 'resultado.html';
    } catch (error) {
        alert('Erro ao buscar o versículo.');
    }
}

async function buscarVersiculoAleatorioLivro() {
    const livro = document.getElementById('livro').value.trim();
    if (!livro) {
        alert('Digite um nome de livro válido!');
        return;
    }
    
    try {
        // Passo 1: Buscar um capítulo aleatório do livro
        const totalCapitulos = {
            "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
            "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
            "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
            "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
            "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
            "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
            "Obadias": 1, "Jonas": 4, "Miqueias": 7, "Naum": 3, "Habacuque": 3,
            "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4, "Mateus": 28,
            "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28, "Romanos": 16,
            "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6,
            "Filipenses": 4, "Colossenses": 4, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3,
            "1 Timóteo": 6, "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13,
            "Tiago": 5, "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1,
            "3 João": 1, "Judas": 1, "Apocalipse": 22
        };

        if (!totalCapitulos[livro]) {
            alert("Nome do livro inválido. Tente novamente.");
            return;
        }

        const capituloAleatorio = Math.floor(Math.random() * totalCapitulos[livro]) + 1;

        // Passo 2: Buscar os versículos do capítulo aleatório
        const url = `https://bible-api.com/${encodeURIComponent(livro + " " + capituloAleatorio)}?translation=almeida`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.verses || data.verses.length === 0) {
            throw new Error('Erro ao obter versículo aleatório do livro.');
        }

        // Passo 3: Escolher um versículo aleatório
        const versiculoAleatorio = data.verses[Math.floor(Math.random() * data.verses.length)];

        sessionStorage.setItem('versiculo', JSON.stringify({
            reference: `${livro} ${versiculoAleatorio.chapter}:${versiculoAleatorio.verse}`,
            text: versiculoAleatorio.text
        }));

        window.location.href = 'versiculoaleatorio.html';
    } catch (error) {
        alert('Erro ao buscar um versículo aleatório do livro.');
    }
}

function mostrarResultado() {
    const data = JSON.parse(sessionStorage.getItem('versiculo'));
    
    if (!data || !data.reference || !data.text) {
        document.getElementById('resultado').innerHTML = '<p>Nenhum versículo encontrado.</p>';
        return;
    }
    
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<h2>${data.reference}</h2><p>${data.text}</p>`;
}
 
document.addEventListener('DOMContentLoaded', () => {
    const pesquisarBtn = document.getElementById('pesquisar');
    const aleatorioLivroBtn = document.getElementById('buscarAleatorioLivro');

    if (pesquisarBtn) {
        pesquisarBtn.addEventListener('click', buscarVersiculo);
    }

    if (aleatorioLivroBtn) {
        aleatorioLivroBtn.addEventListener('click', buscarVersiculoAleatorioLivro);
    }

    if (document.getElementById('resultado')) {
        mostrarResultado();
    }
});
