const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const generateBtn = document.getElementById("generateBtn");

let step = 0;
let latexContent = "";
let chapterCount = 0;

// ================= AFFICHAGE CHAT =================
function bot(msg) {
chatBox.innerHTML += `<div class="message bot">${msg}</div>`;
chatBox.scrollTop = chatBox.scrollHeight;
}

function user(msg) {
chatBox.innerHTML += `<div class="message user">${msg}</div>`;
chatBox.scrollTop = chatBox.scrollHeight;
}

// ================= MESSAGE INITIAL =================
bot(
"Salut 👋<br>" +
"Je suis un <b>chat bot guidé</b> conçu pour vous accompagner dans la rédaction " +
"de votre <b>rapport académique</b> étape par étape.<br><br>" +
"<i>Pour faciliter la rédaction, la zone de saisie peut être agrandie selon vos besoins.</i><br><br>" +
"Êtes-vous prêt(e) à commencer ? <b>(oui / non)</b>"
);

// ================= BOUTON ENVOYER =================
sendBtn.onclick = () => {
const text = userInput.value.trim();
if (!text) return;

user(text);
userInput.value = "";

// ---- Confirmation ----
if (step === 0) {
if (text.toLowerCase() === "oui") {
step = 1;
bot(
"Parfait ✅<br>" +
"Nous allons commencer par la <b>page de garde</b>.<br><br>" +
"Nom de la faculté ?"
);
} else {
bot("Quand vous serez prêt(e), répondez par <b>oui</b> 🙂");
}
}

// ================= PAGE DE GARDE =================
else if (step === 1) {
latexContent += "\\begin{titlepage}\n\\centering\n";
latexContent += `{\\Large ${text} \\par}\n\\vspace{1cm}\n`;
step++;
bot("Nom de l’école ?");
}

else if (step === 2) {
latexContent += `{\\large ${text} \\par}\n\\vspace{1cm}\n`;
step++;
bot("Spécialité ?");
}

// ===== SPÉCIALITÉ (CENTRÉE) =====
else if (step === 3) {
latexContent += `{\\large\\textbf{Spécialité :} ${text} \\par}\n\\vspace{1.5cm}\n`;
step++;
bot("Titre du projet ?");
}

else if (step === 4) {
latexContent += `{\\Huge\\bfseries ${text} \\par}\n\\vspace{2cm}\n`;
step++;
bot("Projet réalisé dans le cadre de quel projet / module ?");
}

else if (step === 5) {
latexContent += `\\textbf{Projet :} ${text} \\par\\vspace{1cm}\n`;
step++;
bot("Nom et prénom de l’étudiant ?");
}

else if (step === 6) {
latexContent += `\\textbf{Réalisé par :} ${text} \\par\n`;
step++;
bot("Nom et prénom de l’encadrant ?");
}

else if (step === 7) {
latexContent += `\\textbf{Encadré par :} ${text} \\par\n\\vfill\n`;
step++;
bot("Année universitaire ?");
}

else if (step === 8) {
latexContent += `Année universitaire : ${text}\n\\end{titlepage}\n\\newpage\n`;
step = 100;
generateBtn.classList.remove("hidden");

bot(
"✅ <b>Page de garde validée</b>.<br><br>" +
"Que souhaitez-vous ajouter ?<br><br>" +
"1️⃣ Titre + paragraphe<br>" +
"2️⃣ Titre + tableau<br>" +
"3️⃣ Chapitre + titre de chapitre<br>" +
"4️⃣ Paragraphe libre"
);
}

// ================= MENU =================
else if (step === 100) {
if (text === "1") {
step = 200;
bot("Titre de la page ?");
} else if (text === "2") {
step = 300;
bot("Titre de la page ?");
} else if (text === "3") {
step = 400;
bot("Titre du chapitre ?");
} else if (text === "4") {
step = 500;
bot("Entrez le paragraphe :");
} else {
bot("Veuillez choisir 1, 2, 3 ou 4.");
}
}

// -------- TITRE + PARAGRAPHE --------
else if (step === 200) {
latexContent += `\\section*{\\centering\\bfseries ${text}}\n`;
step++;
bot("Paragraphe ?");
}

else if (step === 201) {
latexContent += `${text}\n\\newpage\n`;
step = 100;
bot("✅ Page ajoutée. Choisissez une autre option.");
}

// -------- TITRE + TABLEAU --------
else if (step === 300) {
latexContent += `\\section*{\\centering\\bfseries ${text}}\n`;
step++;
bot("Nombre de colonnes ?");
}

else if (step === 301) {
window.cols = parseInt(text);
step++;
bot("Nombre de lignes ?");
}

else if (step === 302) {
const rows = parseInt(text);
latexContent += `\\begin{tabular}{|${"c|".repeat(window.cols)}}\\hline\n`;
for (let i = 0; i < rows; i++) {
latexContent += `${" & ".repeat(window.cols - 1)} \\\\ \\hline\n`;
}
latexContent += "\\end{tabular}\n\\newpage\n";
step = 100;
bot("✅ Tableau ajouté. Choisissez une autre option.");
}

// -------- CHAPITRE --------
else if (step === 400) {
chapterCount++;
latexContent +=
`\\chapter*{\\centering\\bfseries\\underline{CHAPITRE ${chapterCount}} \\quad ${text}}\n` +
`\\addcontentsline{toc}{chapter}{Chapitre ${chapterCount} : ${text}}\n\\newpage\n`;
step = 100;
bot("✅ Chapitre ajouté. Choisissez une autre option.");
}

// -------- PARAGRAPHE LIBRE --------
else if (step === 500) {
latexContent += `${text}\n\\newpage\n`;
step = 100;
bot("✅ Paragraphe ajouté. Choisissez une autre option.");
}
};

// ================= GÉNÉRATION =================
generateBtn.onclick = () => {
latexContent += "\\tableofcontents\n";

const fullLatex =
"\\documentclass[12pt]{report}\n" +
"\\usepackage[utf8]{inputenc}\n" +
"\\usepackage[T1]{fontenc}\n" +
"\\usepackage{geometry}\n" +
"\\usepackage{array}\n" +
"\\geometry{margin=2.5cm}\n\n" +
"\\begin{document}\n\n" +
latexContent +
"\n\\end{document}";

const blob = new Blob([fullLatex], { type: "text/plain;charset=utf-8" });
const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.download = "rapport.tex";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);

bot(
"🎉 <b>Félicitations !</b><br><br>" +
"Votre fichier <b>rapport.tex</b> a été généré avec succès.<br>" +
"👉 Compilez-le avec <b>MiKTeX</b> ou importez-le sur <b>Overleaf</b> 📘"
);
};

