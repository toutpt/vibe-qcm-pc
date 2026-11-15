import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/* ---------- Types & données ---------- */

type Question = {
  question: string;
  options: string[];
  answer: number; // index de la bonne réponse
  explication: string;
  emoji: string;
};

type Niveau = {
  titre: string;
  emoji: string;
  couleur: string;
  lecon: string;
  questions: Question[];
};

const NIVEAUX: Niveau[] = [
  {
    titre: "La Souris",
    emoji: "🖱️",
    couleur: "from-sky-500 to-blue-600",
    lecon:
      "La souris sert à pointer, cliquer et déplacer des choses. Clic gauche = sélectionner ou ouvrir. Clic droit = menu d'options. La molette fait défiler la page.",
    questions: [
      {
        emoji: "👆",
        question: "Que fait un simple clic gauche ?",
        options: ["Il éteint l'ordinateur", "Il sélectionne ou ouvre un élément", "Il ferme la fenêtre"],
        answer: 1,
        explication: "Le clic gauche sélectionne ou ouvre ce qu'on pointe.",
      },
      {
        emoji: "📋",
        question: "À quoi sert le clic droit ?",
        options: ["À afficher un menu d'options", "À supprimer un fichier", "À copier automatiquement"],
        answer: 0,
        explication: "Le clic droit ouvre un menu avec des options selon l'élément.",
      },
      {
        emoji: "🌀",
        question: "Que fait la molette de la souris ?",
        options: ["Elle change le volume", "Elle fait défiler la page", "Elle redémarre le PC"],
        answer: 1,
        explication: "La molette fait défiler le contenu vers le haut ou le bas.",
      },
    ],
  },
  {
    titre: "Le Clavier",
    emoji: "⌨️",
    couleur: "from-violet-500 to-purple-600",
    lecon:
      "Le clavier permet d'écrire. Maj (⇧) donne les majuscules, Entrée valide, la touche Suppr/Backspace efface, et Ctrl + C / Ctrl + V copient et collent.",
    questions: [
      {
        emoji: "✍️",
        question: "Quelle touche efface le texte ?",
        options: ["Entrée", "Suppr (Backspace)", "Espace"],
        answer: 1,
        explication: "La touche Suppr / Backspace efface ce qu'on vient d'écrire.",
      },
      {
        emoji: "🅰️",
        question: "Comment écrire une lettre majuscule ?",
        options: ["En maintenant la touche Maj (⇧)", "En cliquant deux fois", "Avec la touche F1"],
        answer: 0,
        explication: "Maj (⇧) + lettre donne une majuscule.",
      },
      {
        emoji: "📄",
        question: "Quel raccourci sert à copier du texte ?",
        options: ["Ctrl + P", "Ctrl + S", "Ctrl + C"],
        answer: 2,
        explication: "Ctrl + C copie, Ctrl + V colle, Ctrl + X coupe.",
      },
    ],
  },
  {
    titre: "Fichiers & Dossiers",
    emoji: "📁",
    couleur: "from-amber-500 to-orange-600",
    lecon:
      "L'ordinateur range les documents comme un meuble : des dossiers (tiroirs) qui contiennent des fichiers (papiers). On peut créer, renommer, déplacer et supprimer des fichiers.",
    questions: [
      {
        emoji: "🗂️",
        question: "Qu'est-ce qu'un dossier ?",
        options: ["Un tiroir qui range des fichiers", "Un jeu vidéo", "Une touche du clavier"],
        answer: 0,
        explication: "Un dossier contient et range des fichiers, comme un tiroir.",
      },
      {
        emoji: "🖼️",
        question: "Un fichier photo ressemble souvent à… ?",
        options: ["photo.jpg", "photo.exe", "photo.dossier"],
        answer: 0,
        explication: ".jpg (ou .png) = image, .docx = document, .mp3 = musique.",
      },
      {
        emoji: "🗑️",
        question: "Si on supprime un fichier par erreur, où va-t-il ?",
        options: ["Il disparaît pour toujours", "Dans la corbeille", "Dans le cloud automatiquement"],
        answer: 1,
        explication: "Le fichier va dans la corbeille : on peut le restaurer !",
      },
    ],
  },
  {
    titre: "Internet & Navigation",
    emoji: "🌐",
    couleur: "from-emerald-500 to-green-600",
    lecon:
      "Un navigateur (Chrome, Firefox…) sert à visiter des sites web. On tape une adresse dans la barre d'adresse, et on utilise des moteurs de recherche comme Google pour trouver des informations.",
    questions: [
      {
        emoji: "🔍",
        question: "Où tape-t-on l'adresse d'un site web ?",
        options: ["Dans la barre d'adresse", "Dans la corbeille", "Dans la touche Entrée"],
        answer: 0,
        explication: "La barre d'adresse, en haut du navigateur, reçoit l'adresse (ex : www.google.com).",
      },
      {
        emoji: "🔎",
        question: "À quoi sert un moteur de recherche ?",
        options: ["À chercher des informations sur le web", "À ranger ses fichiers", "À nettoyer l'écran"],
        answer: 0,
        explication: "Google, Bing… recherchent des pages web à partir de mots-clés.",
      },
      {
        emoji: "🔖",
        question: "Comment garder un site pour le retrouver facilement ?",
        options: ["On le recopie sur papier", "On ajoute un favori / marque-page", "On redémarre le PC"],
        answer: 1,
        explication: "Les favoris (marque-pages) sauvegardent les sites préférés.",
      },
    ],
  },
  {
    titre: "Sécurité",
    emoji: "🔒",
    couleur: "from-rose-500 to-red-600",
    lecon:
      "Ne partage jamais tes mots de passe, méfie-toi des messages étranges (arnaques), et utilise des mots de passe longs et différents pour chaque compte.",
    questions: [
      {
        emoji: "🔑",
        question: "Quel est un bon mot de passe ?",
        options: ["1234", "ton prénom", "Un mot long avec chiffres et symboles"],
        answer: 2,
        explication: "Un bon mot de passe est long, unique et mélange lettres, chiffres et symboles.",
      },
      {
        emoji: "📧",
        question: "Un inconnu écrit : « Gagnez 1000 €, cliquez ici ! ». Que faire ?",
        options: ["Cliquer tout de suite", "Ignorer et supprimer, c'est probablement une arnaque", "Envoyer son mot de passe"],
        answer: 1,
        explication: "C'est du phishing : ne jamais cliquer, supprimer le message.",
      },
      {
        emoji: "🤫",
        question: "À qui peut-on donner son mot de passe ?",
        options: ["À ses amis proches", "À personne", "Au service client qui le demande par mail"],
        answer: 1,
        explication: "Le mot de passe ne se partage avec personne, jamais.",
      },
    ],
  },
];

/* ---------- Composants ---------- */

function EcranAccueil({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-950 via-slate-900 to-black p-6 text-center text-white">
      <div className="animate-bounce text-7xl">🖥️</div>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Aventure Ordinateur</h1>
      <p className="mt-3 max-w-md text-lg text-white/70">
        Un jeu pour apprendre à utiliser un ordinateur, étape par étape.
        Réponds aux questions, gagne des étoiles et deviens une pro ! ⭐
      </p>
      <Button
        onClick={onStart}
        size="lg"
        className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-10 py-6 text-xl hover:scale-105 transition-transform"
      >
        🎮 Jouer
      </Button>
      <p className="mt-6 text-sm text-white/40">5 niveaux · 15 questions · plein d'étoiles</p>
    </div>
  );
}

function EcranLecon({ niveau, onGo }: { niveau: Niveau; onGo: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-6 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-6xl">{niveau.emoji}</div>
        <h2 className="mt-3 text-3xl font-bold">Niveau : {niveau.titre}</h2>
        <p className="mt-4 text-left text-lg leading-relaxed text-white/80">{niveau.lecon}</p>
        <Button
          onClick={onGo}
          size="lg"
          className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-lg"
        >
          C'est compris, aux questions ! ➡️
        </Button>
      </div>
    </div>
  );
}

function EcranQuestion({
  niveau,
  questionIndex,
  onAnswer,
  stars,
  temps,
}: {
  niveau: Niveau;
  questionIndex: number;
  onAnswer: (juste: boolean) => void;
  stars: number;
  temps: number;
}) {
  const q = niveau.questions[questionIndex];
  const [choisi, setChoisi] = useState<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Réinitialise la sélection (et annule tout minuteur en retard)
  // à chaque nouvelle question.
  useEffect(() => {
    setChoisi(null);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [questionIndex]);

  const choisir = (i: number) => {
    if (choisi !== null) return;
    setChoisi(i);
    timerRef.current = setTimeout(() => onAnswer(i === q.answer), 1400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-6 text-white">
      <div className="w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <Badge className="bg-white/10 text-white">
            {niveau.emoji} {niveau.titre} — Question {questionIndex + 1}/{niveau.questions.length}
          </Badge>
          <span className="text-xl">⭐ {stars}</span>
          <span className="text-xl">⏱️ {Math.floor(temps / 60)}:{(temps % 60).toString().padStart(2, "0")}</span>
        </div>
        <Progress value={(questionIndex / niveau.questions.length) * 100} className="mb-6" />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-center text-5xl">{q.emoji}</div>
          <h2 className="mt-4 text-center text-xl font-semibold">{q.question}</h2>
          <div className="mt-6 flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const estBonne = i === q.answer;
              let style = "border-white/20 bg-white/5 hover:bg-white/15";
              if (choisi !== null) {
                if (estBonne) style = "border-emerald-400 bg-emerald-500/30";
                else if (i === choisi) style = "border-rose-400 bg-rose-500/30";
                else style = "border-white/10 bg-white/5 opacity-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => choisir(i)}
                  className={`rounded-xl border px-5 py-4 text-left text-lg transition-all ${style}`}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded bg-rose-500 align-middle text-sm font-bold text-white">
                    {["A", "B", "C"][i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {choisi !== null && (
            <p className={`mt-5 text-center font-medium ${choisi === q.answer ? "text-emerald-300" : "text-rose-300"}`}>
              {choisi === q.answer ? "🎉 Bravo !" : "😅 Presque !"} {q.explication}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EcranFin({
  stars,
  maxStars,
  tempsSecondes,
  onRestart,
}: {
  stars: number;
  maxStars: number;
  tempsSecondes: number;
  onRestart: () => void;
}) {
  const minutes = Math.floor(tempsSecondes / 60);
  const secondes = tempsSecondes % 60;
  const tempsAffiche = `${minutes} min ${secondes.toString().padStart(2, "0")} s`;

  let verdict = { emoji: "💪", texte: "Recommence pour battre ton record !", couleur: "text-rose-300" };
  if (tempsSecondes <= 5 * 60) {
    verdict = { emoji: "👑", texte: "Tu es la meilleure ! Quel rapidité !", couleur: "text-yellow-300" };
  } else if (tempsSecondes <= 7 * 60) {
    verdict = { emoji: "🌟", texte: "Très bien ! Excellente vitesse !", couleur: "text-emerald-300" };
  } else if (tempsSecondes <= 10 * 60) {
    verdict = { emoji: "🙂", texte: "C'est bien ! Recommence pour aller plus vite.", couleur: "text-sky-300" };
  }

  const message =
    stars === maxStars
      ? "Incroyable, un sans-faute ! Tu es une experte de l'ordinateur !"
      : stars >= maxStars * 0.7
        ? "Super travail ! Tu maîtrises déjà beaucoup de choses !"
        : "Bien joué ! Refais le jeu pour gagner encore plus d'étoiles !";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-black p-6 text-center text-white">
      <div className="text-7xl">🏆</div>
      <h2 className="mt-4 text-4xl font-bold">Partie terminée !</h2>
      <p className="mt-3 text-2xl text-yellow-300">
        {"⭐".repeat(stars)}
        <span className="opacity-30">{"⭐".repeat(maxStars - stars)}</span>
        <span className="ml-2 text-white">{stars} / {maxStars}</span>
      </p>
      <p className="mt-2 text-xl text-white/80">⏱️ Temps : {tempsAffiche}</p>
      <p className={`mt-3 max-w-md text-lg font-semibold ${verdict.couleur}`}>
        {verdict.emoji} {verdict.texte}
      </p>
      <p className="mt-2 max-w-md text-lg text-white/70">{message}</p>
      <Button
        onClick={onRestart}
        size="lg"
        className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-8 text-lg"
      >
        🔁 Rejouer
      </Button>
    </div>
  );
}

/* ---------- Exercice 1 : Copier-coller ---------- */

function ExerciceCopyPaste({ onDone }: { onDone: (etoiles: number) => void }) {
  const PHRASE = "Je sais utiliser un ordinateur !";
  const [selectionne, setSelectionne] = useState(false);
  const [copie, setCopie] = useState(false);
  const [zoneActive, setZoneActive] = useState(false);
  const [colle, setColle] = useState(false);
  const [message, setMessage] = useState("");

  // On accepte aussi les vraies touches Ctrl+C / Ctrl+V !
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") copier();
      if (e.ctrlKey && e.key.toLowerCase() === "v") coller();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const copier = () => {
    if (!selectionne) {
      setMessage("D'abord, sélectionne le texte ! 👆");
      return;
    }
    setCopie(true);
    setMessage("Texte copié ! Maintenant, clique dans la zone blanche. 📋");
  };

  const coller = () => {
    if (!copie) {
      setMessage("Tu n'as encore rien copié ! Commence par copier le texte.");
      return;
    }
    if (!zoneActive) {
      setMessage("Clique d'abord dans la zone blanche pour y placer le curseur. 🎯");
      return;
    }
    setColle(true);
    setMessage("Bravo ! Tu maîtrises le copier-coller ! 🎉");
    setTimeout(() => onDone(2), 1600);
  };

  const etape = !selectionne ? 1 : !copie ? 2 : !zoneActive ? 3 : !colle ? 4 : 5;

  return (
    <div className="w-full max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <Badge className="bg-white/10 text-white">✂️ Exercice : le copier-coller</Badge>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-white/70">
          1. Sélectionne le texte ci-dessous en cliquant dessus.
          2. Copie-le (bouton ou <b>Ctrl + C</b>).
          3. Clique dans la zone blanche.
          4. Colle-le (bouton ou <b>Ctrl + V</b>).
        </p>

        <div
          onClick={() => setSelectionne(true)}
          className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-lg transition-all ${
            selectionne
              ? "border-sky-400 bg-sky-500/20 text-sky-200"
              : "border-dashed border-white/30 bg-white/5 hover:bg-white/10"
          }`}
        >
          {selectionne ? "✅ " : ""}{PHRASE}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={copier} className="bg-sky-600 hover:bg-sky-500">📋 Copier (Ctrl+C)</Button>
          <Button onClick={coller} className="bg-emerald-600 hover:bg-emerald-500">📥 Coller (Ctrl+V)</Button>
        </div>

        <div
          onClick={() => setZoneActive(true)}
          className={`mt-4 flex min-h-[70px] items-center justify-center rounded-xl border-2 px-4 text-center text-lg transition-all ${
            colle
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
              : zoneActive
                ? "border-yellow-400 bg-yellow-500/10 text-white/40"
                : "border-dashed border-white/30 bg-white/5 text-white/30"
          }`}
        >
          {colle ? PHRASE : zoneActive ? "Curseur ici — colle maintenant !" : "Zone de destination (clique ici)"}
        </div>

        {message && <p className="mt-4 text-center font-medium text-yellow-300">{message}</p>}

        <p className="mt-4 text-center text-sm text-white/40">Étape {etape} / 4</p>
      </div>
    </div>
  );
}

/* ---------- Exercice 2 : Créer un fichier/dossier ---------- */

function ExerciceCreerFichier({ onDone }: { onDone: (etoiles: number) => void }) {
  const [etape, setEtape] = useState(0); // 0:clic droit 1:nouveau 2:dossier 3:nom 4:entrée 5:fini
  const [message, setMessage] = useState("");
  const [nom, setNom] = useState("");

  const mauvais = () => setMessage("Hmm, ce n'est pas ça. Suis les étapes indiquées ! 🙂");

  const avancer = (msg: string) => {
    setMessage(msg);
    setEtape((e) => e + 1);
  };

  const validerNom = () => {
    if (nom.trim() === "") {
      setMessage("Écris d'abord un nom pour le dossier !");
      return;
    }
    setMessage("Dossier créé avec succès ! 🎉");
    setEtape(5);
    setTimeout(() => onDone(2), 1600);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <Badge className="bg-white/10 text-white">📁 Exercice : créer un dossier</Badge>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-white/70">
          Crée un dossier nommé « Mes photos » sur le bureau, étape par étape.
        </p>

        {/* Faux bureau */}
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            if (etape === 0) avancer("Le menu s'est ouvert ! Choisis « Nouveau ».");
            else setMessage("Le menu est déjà ouvert — continue les étapes ! 🙂");
          }}
          className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-900 to-indigo-950"
        >
          <div className="absolute left-3 top-3 text-3xl">🖥️</div>
          {etape === 0 && (
            <div className="px-6 text-center text-white/70">
              <p className="text-lg">Fais un vrai <b>clic droit</b> sur ce bureau 🖱️</p>
              <p className="mt-1 text-sm text-white/40">(bouton droit de la souris)</p>
            </div>
          )}
          {etape >= 1 && (
            <div className="flex flex-col gap-2 rounded-lg border border-white/20 bg-slate-800 p-2">
              {etape === 1 ? (
                <>
                  <button onClick={() => avancer("Parfait ! Maintenant choisis « Dossier ».")} className="rounded px-4 py-2 text-left hover:bg-white/10">🆕 Nouveau ▸</button>
                  <button onClick={mauvais} className="rounded px-4 py-2 text-left hover:bg-white/10">🔤 Trier par nom</button>
                  <button onClick={mauvais} className="rounded px-4 py-2 text-left hover:bg-white/10">🔄 Actualiser</button>
                </>
              ) : etape === 2 ? (
                <>
                  <button onClick={() => avancer("Un nouveau dossier est apparu ! Donne-lui un nom.")} className="rounded px-4 py-2 text-left hover:bg-white/10">📁 Dossier</button>
                  <button onClick={mauvais} className="rounded px-4 py-2 text-left hover:bg-white/10">📄 Document texte</button>
                  <button onClick={mauvais} className="rounded px-4 py-2 text-left hover:bg-white/10">🖼️ Image</button>
                </>
              ) : etape >= 3 ? (
                <div className="flex items-center gap-2 px-2 py-1">
                  <span>📁</span>
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && validerNom()}
                    placeholder="Mes photos"
                    className="rounded border border-white/20 bg-white/10 px-2 py-1 text-white outline-none focus:border-sky-400"
                  />
                  <Button onClick={validerNom} size="sm" className="bg-emerald-600 hover:bg-emerald-500">Entrée ⏎</Button>
                </div>
              ) : null}
            </div>
          )}
          {etape >= 5 && <div className="text-center"><div className="text-5xl">📁✨</div><p className="mt-2 font-semibold text-emerald-300">Dossier « {nom || "Mes photos"} » créé !</p></div>}
        </div>

        {message && <p className="mt-4 text-center font-medium text-yellow-300">{message}</p>}

        <p className="mt-4 text-center text-sm text-white/40">
          Étape {Math.min(etape + 1, 5)} / 5 — clic droit → Nouveau → Dossier → nom → Entrée
        </p>
      </div>
    </div>
  );
}

/* ---------- Écran Pratique ---------- */

function EcranPratique({ onFinished }: { onFinished: (etoiles: number) => void }) {
  const [phase, setPhase] = useState<"intro" | "copie" | "fichier" | "fini">("intro");
  const [etoiles, setEtoiles] = useState(0);

  if (phase === "intro")
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-6xl">🏋️</div>
          <h2 className="mt-3 text-3xl font-bold">Niveau bonus : Pratique !</h2>
          <p className="mt-4 text-lg text-white/80">
            Maintenant, à toi de jouer pour de vrai : tu vas copier-coller un texte,
            puis créer un dossier, comme sur un vrai ordinateur.
          </p>
          <Button
            onClick={() => setPhase("copie")}
            size="lg"
            className="mt-8 w-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-lg"
          >
            Commencer l'entraînement 💪
          </Button>
        </div>
      </div>
    );

  if (phase === "copie")
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-black p-6 text-white">
        <ExerciceCopyPaste
          onDone={(n) => {
            setEtoiles((e) => e + n);
            setPhase("fichier");
          }}
        />
      </div>
    );

  if (phase === "fichier")
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-black p-6 text-white">
        <ExerciceCreerFichier
          onDone={(n) => {
            setEtoiles((e) => e + n);
            setPhase("fini");
            setTimeout(() => onFinished(etoiles + n), 100);
          }}
        />
      </div>
    );

  return null;
}

export default function App() {
  const [etape, setEtape] = useState<"accueil" | "lecon" | "question" | "pratique" | "fin">("accueil");
  const [niveauIndex, setNiveauIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [tempsSecondes, setTempsSecondes] = useState(0);

  // Chronomètre : démarre à la première question, s'arrête à la fin du quiz.
  React.useEffect(() => {
    if (etape !== "question") return;
    const id = setInterval(() => setTempsSecondes((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [etape]);

  const niveau = NIVEAUX[niveauIndex];

  const repondre = (juste: boolean) => {
    if (juste) setStars((s) => s + 1);
    if (questionIndex + 1 < niveau.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else if (niveauIndex + 1 < NIVEAUX.length) {
      setNiveauIndex(niveauIndex + 1);
      setQuestionIndex(0);
      setEtape("lecon");
    } else {
      setEtape("pratique");
    }
  };

  const restart = () => {
    setNiveauIndex(0);
    setQuestionIndex(0);
    setStars(0);
    setTempsSecondes(0);
    setEtape("accueil");
  };

  const maxStars = NIVEAUX.reduce((n, nv) => n + nv.questions.length, 0) + 4;

  if (etape === "accueil") return <EcranAccueil onStart={() => setEtape("lecon")} />;
  if (etape === "lecon")
    return <EcranLecon niveau={niveau} onGo={() => setEtape("question")} />;
  if (etape === "question")
    return (
      <EcranQuestion
        key={`${niveauIndex}-${questionIndex}`}
        niveau={niveau}
        questionIndex={questionIndex}
        onAnswer={repondre}
        stars={stars}
        temps={tempsSecondes}
      />
    );
  if (etape === "pratique")
    return (
      <EcranPratique
        onFinished={(n) => {
          setStars((s) => s + n);
          setEtape("fin");
        }}
      />
    );
  return <EcranFin stars={stars} maxStars={maxStars} tempsSecondes={tempsSecondes} onRestart={restart} />;
}
