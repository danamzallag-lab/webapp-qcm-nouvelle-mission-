/**
 * Application de gestion des entretiens pharmaceutiques à distance
 * Gestion multi-étapes avec validation et envoi des données
 */

// Configuration de l'URL du webhook (à modifier selon votre backend)
const WEBHOOK_URL = "https://votre-webhook-url.com/entretien"; // Remplacer par votre URL n8n ou Google Apps Script

// Définition des questions d'évaluation pour chaque type d'entretien
const evaluationQuestions = {
  aod: [
    { q: "Quel anticoagulant oral direct prenez-vous ?", type: "text", id: "q_aod_medicament" },
    { q: "Connaissez-vous la dose que vous prenez ?", type: "select", options: ["Oui", "Non"], id: "q_aod_connaitDose" },
    { q: "Si oui, quelle dose ?", type: "text", id: "q_aod_dose" },
    { q: "Pour quelle raison prenez-vous ce traitement ?", type: "text", id: "q_aod_indication" },
    { q: "Depuis combien de temps prenez-vous ce traitement ?", type: "text", id: "q_aod_duree" },
    { q: "Connaissez-vous les effets indésirables possibles ?", type: "select", options: ["Oui", "Non"], id: "q_aod_effetsConnus" }
  ],
  avk: [
    { q: "Quel anti-vitamine K prenez-vous ?", type: "text", id: "q_avk_medicament" },
    { q: "Quel est votre INR cible ?", type: "text", id: "q_avk_inrCible" },
    { q: "Quelle était votre dernière valeur d'INR ?", type: "text", id: "q_avk_dernierINR" },
    { q: "Date du dernier contrôle INR", type: "date", id: "q_avk_dateDernierINR" },
    { q: "Avez-vous un carnet de suivi INR ?", type: "select", options: ["Oui", "Non"], id: "q_avk_carnetSuivi" },
    { q: "À quelle fréquence faites-vous contrôler votre INR ?", type: "text", id: "q_avk_frequenceControles" }
  ],
  asthme: [
    { q: "Quel type d'asthme avez-vous ?", type: "text", id: "q_asthme_typeAsthme" },
    { q: "Depuis combien de temps êtes-vous asthmatique ?", type: "text", id: "q_asthme_duree" },
    { q: "Avez-vous un traitement de fond ?", type: "select", options: ["Oui", "Non"], id: "q_asthme_traitementFond" },
    { q: "Si oui, quel(s) traitement(s) de fond ?", type: "text", id: "q_asthme_quelTraitementFond" },
    { q: "Avez-vous un traitement de crise ?", type: "select", options: ["Oui", "Non"], id: "q_asthme_traitementCrise" },
    { q: "Si oui, lequel ?", type: "text", id: "q_asthme_quelTraitementCrise" },
    { q: "Fréquence des crises d'asthme", type: "text", id: "q_asthme_frequenceCrises" }
  ]
};

// Thématiques disponibles par type d'entretien
const thematiquesOptions = {
  aod: [
    { label: "Observance", key: "observance" },
    { label: "Surveillance biologique", key: "surveillance_biologique" },
    { label: "Effets du traitement", key: "effets_traitement" },
    { label: "Vie quotidienne", key: "vie_quotidienne" }
  ],
  avk: [
    { label: "Observance", key: "observance" },
    { label: "Surveillance biologique", key: "surveillance_biologique" },
    { label: "Effets du traitement", key: "effets_traitement" },
    { label: "Vie quotidienne", key: "vie_quotidienne" }
  ],
  asthme: [
    { label: "Effets du traitement", key: "effets_traitement" },
    { label: "Principe du traitement", key: "principe_traitement" },
    { label: "Facteurs déclenchants", key: "facteurs_declenchants" }
  ]
};

// Questions spécifiques pour chaque thématique
const thematiqueQuestions = {
  observance: [
    { q: "Prenez-vous régulièrement votre traitement tel que prescrit ?", type: "select", options: ["Oui", "Non"], id: "t_observance_regulier" },
    { q: "Quelles difficultés rencontrez-vous pour suivre votre traitement ?", type: "text", id: "t_observance_difficultes" }
  ],
  surveillance_biologique: [
    { q: "À quelle fréquence effectuez-vous des analyses de sang de suivi ?", type: "text", id: "t_surveillance_frequence" },
    { q: "Interprétez-vous ou suivez-vous les résultats de vos analyses (ex : INR) ?", type: "select", options: ["Oui", "Non"], id: "t_surveillance_interpretation" }
  ],
  effets_traitement: [
    { q: "Avez-vous constaté des effets indésirables depuis le début du traitement ?", type: "select", options: ["Oui", "Non"], id: "t_effets_constates" },
    { q: "Si oui, lesquels ?", type: "text", id: "t_effets_lequels" }
  ],
  vie_quotidienne: [
    { q: "Votre traitement impacte-t-il votre vie quotidienne (alimentation, activités, etc.) ?", type: "select", options: ["Oui", "Non"], id: "t_vie_impact" },
    { q: "Si oui, de quelle manière ?", type: "text", id: "t_vie_comment" }
  ],
  principe_traitement: [
    { q: "Comprenez-vous comment fonctionne votre traitement de fond ?", type: "select", options: ["Oui", "Non"], id: "t_principe_compris" },
    { q: "Expliquez ce que vous avez compris du rôle de votre traitement :", type: "text", id: "t_principe_explanation" }
  ],
  facteurs_declenchants: [
    { q: "Connaissez-vous les facteurs déclenchants de vos crises d'asthme ?", type: "select", options: ["Oui", "Non"], id: "t_facteurs_connaissance" },
    { q: "Si oui, quels facteurs avez-vous identifiés ?", type: "text", id: "t_facteurs_list" }
  ]
};

// Variables d'état de l'application
let currentStep = 1;
let currentType = null;
let selectedThemes = [];

// ========== FONCTIONS DE NAVIGATION ==========

/**
 * Affiche une étape spécifique du formulaire
 */
function showStep(step) {
  document.querySelectorAll('.step').forEach(div => div.classList.remove('active'));
  const stepElement = document.getElementById('step-' + step);
  if (stepElement) {
    stepElement.classList.add('active');
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ========== GESTIONNAIRES D'ÉVÉNEMENTS POUR LA NAVIGATION ==========

// Étape 1 → Étape 2
document.getElementById('next-1').addEventListener('click', () => {
  const nomVal = document.getElementById('nomPrenom').value.trim();
  const dobVal = document.getElementById('dateNaissance').value;

  if (!nomVal || !dobVal) {
    alert('Veuillez renseigner le nom et la date de naissance du patient.');
    return;
  }

  const typeRadio = document.querySelector('input[name="typeEntretien"]:checked');
  if (!typeRadio) {
    alert("Veuillez sélectionner un type d'entretien.");
    return;
  }

  currentType = typeRadio.value;
  renderThemeOptions(currentType);
  showStep(2);
});

// Étape 2 → Étape 1
document.getElementById('prev-2').addEventListener('click', () => {
  showStep(1);
});

// Étape 2 → Étape 3
document.getElementById('next-2').addEventListener('click', () => {
  if (!document.getElementById('dejaParticipe').value ||
      !document.getElementById('accepteParticipation').value ||
      !document.getElementById('dateEntretien').value) {
    alert('Veuillez remplir tous les champs obligatoires de la section Adhésion.');
    return;
  }

  renderEvaluationQuestions(currentType);
  showStep(3);
});

// Étape 3 → Étape 2
document.getElementById('prev-3').addEventListener('click', () => {
  showStep(2);
});

// Étape 3 → Étape 4
document.getElementById('next-3').addEventListener('click', () => {
  showStep(4);
});

// Étape 4 → Étape 3
document.getElementById('prev-4').addEventListener('click', () => {
  showStep(3);
});

// Étape 4 → Étape 5
document.getElementById('next-4').addEventListener('click', () => {
  selectedThemes = [];
  document.querySelectorAll('input[name="thematique"]:checked').forEach(cb => {
    selectedThemes.push(cb.value);
  });

  renderThematicQuestions(selectedThemes);
  showStep(5);
});

// Étape 5 → Étape 4
document.getElementById('prev-5').addEventListener('click', () => {
  showStep(4);
});

// Étape 5 → Étape 6
document.getElementById('next-5').addEventListener('click', () => {
  showStep(6);
});

// Étape 6 → Étape 5
document.getElementById('prev-6').addEventListener('click', () => {
  showStep(5);
});

// Contrôle du nombre de thématiques sélectionnées (min 2, max 4)
document.getElementById('themes-options').addEventListener('change', () => {
  const checkedCount = document.querySelectorAll('input[name="thematique"]:checked').length;
  const nextBtn = document.getElementById('next-4');

  nextBtn.disabled = checkedCount < 2;

  const maxAllowed = Math.min(thematiquesOptions[currentType].length, 4);
  if (checkedCount >= maxAllowed) {
    document.querySelectorAll('input[name="thematique"]:not(:checked)').forEach(cb => cb.disabled = true);
  } else {
    document.querySelectorAll('input[name="thematique"]').forEach(cb => cb.disabled = false);
  }
});

// ========== FONCTIONS DE RENDU DYNAMIQUE ==========

/**
 * Génère et affiche les questions d'évaluation selon le type d'entretien
 */
function renderEvaluationQuestions(type) {
  const container = document.getElementById('evaluation-questions');
  container.innerHTML = "";

  evaluationQuestions[type].forEach(item => {
    const qLabel = document.createElement('label');
    qLabel.textContent = item.q;
    qLabel.htmlFor = item.id;
    container.appendChild(qLabel);

    let inputEl;
    if (item.type === "select") {
      inputEl = document.createElement('select');
      inputEl.id = item.id;
      inputEl.name = item.id;
      inputEl.innerHTML = '<option value="">--Sélectionnez--</option>';
      item.options.forEach(opt => {
        const optEl = document.createElement('option');
        optEl.value = opt;
        optEl.textContent = opt;
        inputEl.appendChild(optEl);
      });
    } else if (item.type === "text") {
      inputEl = document.createElement('input');
      inputEl.type = "text";
      inputEl.id = item.id;
      inputEl.name = item.id;
    } else if (item.type === "date") {
      inputEl = document.createElement('input');
      inputEl.type = "date";
      inputEl.id = item.id;
      inputEl.name = item.id;
    }
    container.appendChild(inputEl);
  });

  // Gestion de l'affichage conditionnel des questions "Si oui..."
  setupConditionalQuestions(container, evaluationQuestions[type]);
}

/**
 * Génère les options de thématiques à cocher
 */
function renderThemeOptions(type) {
  const container = document.getElementById('themes-options');
  container.innerHTML = "";

  thematiquesOptions[type].forEach(opt => {
    const labelEl = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = "checkbox";
    cb.name = "thematique";
    cb.value = opt.key;
    labelEl.appendChild(cb);
    labelEl.appendChild(document.createTextNode(" " + opt.label));
    container.appendChild(labelEl);
  });
}

/**
 * Génère les questions pour les thématiques sélectionnées
 */
function renderThematicQuestions(themes) {
  const container = document.getElementById('thematique-questions');
  container.innerHTML = "";

  themes.forEach(themeKey => {
    if (thematiqueQuestions[themeKey]) {
      const themeTitle = document.createElement('h3');
      const opt = thematiquesOptions[currentType].find(o => o.key === themeKey);
      themeTitle.textContent = opt ? opt.label : themeKey;
      container.appendChild(themeTitle);

      thematiqueQuestions[themeKey].forEach(qObj => {
        const qLabel = document.createElement('label');
        qLabel.textContent = qObj.q;
        qLabel.htmlFor = qObj.id;
        container.appendChild(qLabel);

        let inputEl;
        if (qObj.type === "select") {
          inputEl = document.createElement('select');
          inputEl.id = qObj.id;
          inputEl.name = qObj.id;
          inputEl.innerHTML = '<option value="">--Sélectionnez--</option>';
          qObj.options.forEach(opt => {
            const optEl = document.createElement('option');
            optEl.value = opt;
            optEl.textContent = opt;
            inputEl.appendChild(optEl);
          });
        } else if (qObj.type === "text") {
          inputEl = document.createElement('input');
          inputEl.type = "text";
          inputEl.id = qObj.id;
          inputEl.name = qObj.id;
        }
        container.appendChild(inputEl);
      });
    }
  });

  // Gestion de l'affichage conditionnel pour les thématiques
  themes.forEach(themeKey => {
    if (thematiqueQuestions[themeKey]) {
      setupConditionalQuestions(container, thematiqueQuestions[themeKey]);
    }
  });
}

/**
 * Configure l'affichage conditionnel des questions "Si oui..."
 */
function setupConditionalQuestions(container, questions) {
  questions.forEach((item, idx) => {
    if (item.q.toLowerCase().startsWith("si oui")) {
      const label = container.querySelector('label[for="' + item.id + '"]');
      const input = document.getElementById(item.id);
      if (label) label.style.display = 'none';
      if (input) input.style.display = 'none';
    }
  });

  questions.forEach((item, idx) => {
    if ((item.q.toLowerCase().includes("avez-vous") || item.q.toLowerCase().includes("connaissez-vous"))
        && item.type === "select"
        && idx < questions.length - 1) {
      const nextItem = questions[idx + 1];
      if (nextItem.q.toLowerCase().startsWith("si oui")) {
        const triggerSelect = document.getElementById(item.id);
        const dependentLabel = container.querySelector('label[for="' + nextItem.id + '"]');
        const dependentInput = document.getElementById(nextItem.id);

        if (triggerSelect) {
          triggerSelect.addEventListener('change', () => {
            if (triggerSelect.value === "Oui") {
              if (dependentLabel) dependentLabel.style.display = 'block';
              if (dependentInput) {
                dependentInput.style.display = 'block';
                dependentInput.focus();
              }
            } else {
              if (dependentLabel) dependentLabel.style.display = 'none';
              if (dependentInput) {
                dependentInput.style.display = 'none';
                dependentInput.value = "";
              }
            }
          });
        }
      }
    }
  });
}

// ========== SOUMISSION DU FORMULAIRE ==========

/**
 * Collecte et envoie les données du formulaire
 */
document.getElementById('submit-btn').addEventListener('click', async () => {
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Envoi en cours...';

  try {
    const data = collectFormData();
    console.log("Données collectées:", data);

    // Envoi vers le webhook (décommenter et configurer l'URL)
    // await sendToWebhook(data);

    // Pour le moment, afficher la page de confirmation
    showStep('confirmation');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Soumettre l\'entretien';
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    alert("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Soumettre l\'entretien';
  }
});

/**
 * Collecte toutes les données du formulaire
 */
function collectFormData() {
  const data = {
    patient: {
      nomPrenom: document.getElementById('nomPrenom').value,
      dateNaissance: document.getElementById('dateNaissance').value,
      numSecu: document.getElementById('numSecu').value,
      adresse1: document.getElementById('adresse1').value,
      adresse2: document.getElementById('adresse2').value,
      codePostal: document.getElementById('codePostal').value,
      ville: document.getElementById('ville').value,
      telephone: document.getElementById('telephone').value,
      email: document.getElementById('email').value
    },
    type: currentType,
    adhesion: {
      dejaParticipe: document.getElementById('dejaParticipe').value,
      accepteParticipation: document.getElementById('accepteParticipation').value,
      objectifs: document.getElementById('objectifs').value,
      nomPharmacie: document.getElementById('nomPharmacie').value,
      adressePharmacie1: document.getElementById('adressePharmacie1').value,
      adressePharmacie2: document.getElementById('adressePharmacie2').value,
      dateEntretien: document.getElementById('dateEntretien').value,
      pharmacienReferent: document.getElementById('pharmacienReferent').value
    },
    evaluation: {},
    thematiques: selectedThemes,
    questionsThematiques: {},
    synthese: {
      modeContact: document.getElementById('modeContact').value,
      presenceAccompagnant: document.getElementById('presenceAccompagnant').value,
      orientationNecessaire: document.getElementById('orientationNecessaire').value,
      syntheseEntretien: document.getElementById('syntheseEntretien').value,
      appreciationNiveau: document.getElementById('appreciationNiveau').value,
      remarques: document.getElementById('remarques').value
    },
    timestamp: new Date().toISOString()
  };

  // Remplir les réponses de la section évaluation
  evaluationQuestions[currentType].forEach(item => {
    const value = document.getElementById(item.id)?.value || '';
    data.evaluation[item.id.replace('q_' + currentType + '_', '')] = value;
  });

  // Remplir les réponses des questions thématiques
  selectedThemes.forEach(themeKey => {
    if (thematiqueQuestions[themeKey]) {
      thematiqueQuestions[themeKey].forEach(qObj => {
        const answer = document.getElementById(qObj.id)?.value || '';
        if (answer && answer !== "Non concerné") {
          const themeLabel = thematiquesOptions[currentType].find(o => o.key === themeKey)?.label || themeKey;
          data.questionsThematiques["[" + themeLabel + "] " + qObj.q] = answer;
        }
      });
    }
  });

  return data;
}

/**
 * Envoie les données vers un webhook
 */
async function sendToWebhook(data) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'envoi vers le webhook");
  }

  return await response.json();
}

// ========== RÉINITIALISATION ==========

/**
 * Réinitialise le formulaire pour un nouvel entretien
 */
document.getElementById('reset-btn')?.addEventListener('click', () => {
  if (confirm('Voulez-vous vraiment recommencer un nouvel entretien ?')) {
    location.reload();
  }
});

// ========== INITIALISATION ==========
console.log("Application d'entretien pharmaceutique initialisée");
