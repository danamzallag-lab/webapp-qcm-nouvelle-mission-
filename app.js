/**
 * Application de gestion des entretiens pharmaceutiques à distance
 * Gestion multi-étapes avec validation et envoi des données
 */

/**
 * ========== CONFIGURATION MULTI-CLIENTS ==========
 * Chaque client a son propre webhook Google Apps Script
 * L'URL du client est déterminée par le paramètre ?client=XXX
 */

// Table de correspondance : ID client → URL webhook
// Utiliser notre proxy interne Vercel pour éviter les problèmes CORS
const CLIENT_WEBHOOKS = {
  // Client Ouazanan - Pharmacie (via proxy interne)
  "ouazanan": "/api/webhook",

  // Ajouter vos autres clients ici :
  // "martin": "/api/webhook-martin",
  // "dupont": "/api/webhook-dupont",

  // Webhook par défaut (utilisé si aucun client spécifié)
  "default": "/api/webhook"
};

// Récupérer le paramètre "client" depuis l'URL (?client=ouazanan)
const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get('client') || 'default';

// Sélectionner le webhook correspondant au client
const WEBHOOK_URL = CLIENT_WEBHOOKS[clientId] || CLIENT_WEBHOOKS['default'];

// Logs pour le debug (visible dans la console du navigateur)
console.log('🏥 Client actif :', clientId);
console.log('🔗 Webhook configuré :', WEBHOOK_URL ? '✅ Oui' : '❌ Non');

// Afficher un avertissement si le client n'est pas configuré
if (!CLIENT_WEBHOOKS[clientId] && clientId !== 'default') {
  console.warn('⚠️ ATTENTION : Client "' + clientId + '" non configuré ! Utilisation du webhook par défaut.');
}

// Base de données des médicaments AOD avec dosages
const medicamentsAOD = {
  "Eliquis (Apixaban)": ["2,5 mg", "5 mg"],
  "Xarelto (Rivaroxaban)": ["10 mg", "15 mg", "20 mg"],
  "Pradaxa (Dabigatran)": ["75 mg", "110 mg", "150 mg"]
};

// Base de données des médicaments AVK avec dosages
const medicamentsAVK = {
  "Coumadine (Warfarine)": ["2 mg", "5 mg"],
  "Sintrom (Acénocoumarol)": ["4 mg"],
  "Mini-Sintrom (Acénocoumarol)": ["1 mg"],
  "Previscan (Fluindione)": ["20 mg"]
};

// Base de données des corticoïdes inhalés avec dosages (TRAITEMENT DE FOND)
const corticoidesInhales = [
  { nom: "Flixotide", dci: "Fluticasone propionate", dispositif: "MDI (Evohaler)", dosages: ["50", "125", "250"], source: "VIDAL" },
  { nom: "Flixotide Diskus", dci: "Fluticasone propionate", dispositif: "DPI (Diskus)", dosages: ["100", "250", "500"], source: "VIDAL" },
  { nom: "Pulmicort Turbuhaler", dci: "Budésonide", dispositif: "DPI (Turbuhaler)", dosages: ["100", "200", "400"], source: "VIDAL" },
  { nom: "Alvesco", dci: "Ciclésonide", dispositif: "MDI", dosages: ["80", "160"], source: "Base de Données Médicaments" },
  { nom: "Asmanex Twisthaler", dci: "Furoate de mométasone", dispositif: "DPI (Twisthaler)", dosages: ["200", "400"], source: "Base de Données Médicaments" },
  { nom: "Bécotide", dci: "Béclométasone dipropionate", dispositif: "MDI", dosages: ["250"], source: "Base de Données Médicaments" },
  { nom: "Beclometasone Teva", dci: "Béclométasone dipropionate", dispositif: "MDI", dosages: ["50", "250"], source: "Base de Données Médicaments" },
  { nom: "QVAR Autohaler", dci: "Béclométasone dipropionate", dispositif: "MDI (autodéclenché)", dosages: ["100"], source: "Base de Données Médicaments" },
  // Associations fixes (Corticoïde + Bronchodilatateur longue durée)
  { nom: "Symbicort Turbuhaler", dci: "Budésonide + Formotérol", dispositif: "DPI (Turbuhaler)", dosages: ["100/6", "200/6", "400/12"], source: "Association fixe CSI+BDLA" },
  { nom: "Innovair", dci: "Béclométasone + Formotérol", dispositif: "MDI", dosages: ["100/6", "200/6"], source: "Association fixe CSI+BDLA" }
];

// Base de données des bronchodilatateurs de crise
const bronchodilateursCrise = [
  { nom: "Ventoline", dci: "Salbutamol", dispositif: "MDI (aérosol doseur)", dosages: ["100"], source: "Bronchodilatateur de crise" },
  { nom: "Airomir Autohaler", dci: "Salbutamol", dispositif: "MDI auto-déclenché", dosages: ["100"], source: "Bronchodilatateur de crise" },
  { nom: "Bricanyl Turbuhaler", dci: "Terbutaline", dispositif: "DPI (Turbuhaler)", dosages: ["500"], source: "Bronchodilatateur de crise" },
  { nom: "Atrovent", dci: "Ipratropium", dispositif: "MDI (aérosol doseur)", dosages: ["20"], source: "Bronchodilatateur de crise" }
];

// Définition des questions d'évaluation pour chaque type d'entretien
const evaluationQuestions = {
  aod: [
    { q: "Quel anticoagulant oral direct prenez-vous ?", type: "select_medicament", medicaments: medicamentsAOD, id: "q_aod_medicament" },
    { q: "Quelle dose prenez-vous ?", type: "select_dosage", id: "q_aod_dose", dependsOn: "q_aod_medicament" },
    { q: "Pour quelle raison prenez-vous ce traitement ?", type: "text", id: "q_aod_indication" },
    { q: "Depuis combien de temps prenez-vous ce traitement ?", type: "text", id: "q_aod_duree" },
    { q: "Connaissez-vous les effets indésirables possibles ?", type: "select", options: ["Oui", "Non"], id: "q_aod_effetsConnus" }
  ],
  avk: [
    { q: "Quel anti-vitamine K prenez-vous ?", type: "select_medicament", medicaments: medicamentsAVK, id: "q_avk_medicament" },
    { q: "Quelle dose prenez-vous ?", type: "select_dosage", id: "q_avk_dose", dependsOn: "q_avk_medicament" },
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
    { q: "Si oui, quel(s) traitement(s) de fond ?", type: "search_medicament", medicaments: corticoidesInhales, id: "q_asthme_quelTraitementFond", allowCustom: true },
    { q: "Avez-vous un traitement de crise ?", type: "select", options: ["Oui", "Non"], id: "q_asthme_traitementCrise" },
    { q: "Si oui, lequel ?", type: "search_medicament", medicaments: bronchodilateursCrise, id: "q_asthme_quelTraitementCrise", allowCustom: true },
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

    // Sélection de médicament (AOD ou AVK)
    if (item.type === "select_medicament") {
      inputEl = document.createElement('select');
      inputEl.id = item.id;
      inputEl.name = item.id;
      inputEl.innerHTML = '<option value="">--Sélectionnez un médicament--</option>';
      Object.keys(item.medicaments).forEach(medName => {
        const optEl = document.createElement('option');
        optEl.value = medName;
        optEl.textContent = medName;
        inputEl.appendChild(optEl);
      });
    }
    // Sélection de dosage (dépend du médicament sélectionné)
    else if (item.type === "select_dosage") {
      inputEl = document.createElement('select');
      inputEl.id = item.id;
      inputEl.name = item.id;
      inputEl.innerHTML = '<option value="">--Sélectionnez d\'abord un médicament--</option>';
      inputEl.disabled = true; // Désactivé par défaut
    }
    // Recherche de médicament avec barre de recherche (SÉLECTION MULTIPLE + MÉDICAMENT PERSONNALISÉ)
    else if (item.type === "search_medicament") {
      // Créer un conteneur pour la recherche
      const searchContainer = document.createElement('div');
      searchContainer.className = 'corticoide-search-container';

      // Tableau pour stocker les sélections multiples
      let selectedMedicaments = [];

      // Barre de recherche
      const searchInput = document.createElement('input');
      searchInput.type = "text";
      searchInput.id = item.id + '_search';
      searchInput.placeholder = "Rechercher un médicament (vous pouvez en ajouter plusieurs)...";
      searchInput.className = 'corticoide-search';

      // Champ caché pour stocker toutes les sélections
      inputEl = document.createElement('input');
      inputEl.type = "hidden";
      inputEl.id = item.id;
      inputEl.name = item.id;

      // Liste déroulante des résultats
      const resultsList = document.createElement('div');
      resultsList.id = item.id + '_results';
      resultsList.className = 'corticoide-results';
      resultsList.style.display = 'none';

      // Affichage des sélections
      const selectionDisplay = document.createElement('div');
      selectionDisplay.id = item.id + '_display';
      selectionDisplay.className = 'corticoide-selection-multiple';

      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(resultsList);
      searchContainer.appendChild(selectionDisplay);
      searchContainer.appendChild(inputEl);

      container.appendChild(searchContainer);

      // Fonction pour mettre à jour l'affichage des sélections
      const updateDisplay = () => {
        inputEl.value = JSON.stringify(selectedMedicaments);

        if (selectedMedicaments.length === 0) {
          selectionDisplay.innerHTML = '';
          return;
        }

        selectionDisplay.innerHTML = selectedMedicaments.map((med, index) => `
          <div class="selected-corticoide">
            <strong>${med.nom}</strong> ${med.dci ? `(${med.dci})` : ''}<br>
            <small>${med.dispositif || ''} ${med.dosages ? `- Dosages: ${med.dosages.map(d => d + ' µg').join(', ')}` : ''}</small>
            ${med.source === 'Médicament personnalisé' ? '<span style="color:#4caf50; font-size:0.8em;">✨ Personnalisé</span>' : ''}
            <button type="button" class="remove-selection" data-index="${index}">×</button>
          </div>
        `).join('');

        // Ajouter les événements de suppression
        selectionDisplay.querySelectorAll('.remove-selection').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            selectedMedicaments.splice(index, 1);
            updateDisplay();
          });
        });
      };

      // Fonction pour ajouter un médicament personnalisé
      const addCustomMedicament = () => {
        const customName = prompt("Nom du médicament :");
        if (!customName || !customName.trim()) return;

        const customDCI = prompt("DCI (Dénomination Commune Internationale) - optionnel :");
        const customDispositif = prompt("Type de dispositif (ex: MDI, DPI, Turbuhaler) - optionnel :");
        const customDosage = prompt("Dosage(s) en µg (séparer par des virgules si plusieurs) - optionnel :");

        const customMed = {
          nom: customName.trim(),
          dci: customDCI?.trim() || "",
          dispositif: customDispositif?.trim() || "",
          dosages: customDosage ? customDosage.split(",").map(d => d.trim()) : [],
          source: "Médicament personnalisé"
        };

        selectedMedicaments.push(customMed);
        updateDisplay();
        searchInput.value = '';
        resultsList.style.display = 'none';
      };

      // Fonction de recherche
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length < 2) {
          resultsList.style.display = 'none';
          return;
        }

        const medicamentsList = item.medicaments || [];
        const filtered = medicamentsList.filter(med => {
          // Ne pas afficher les médicaments déjà sélectionnés
          const alreadySelected = selectedMedicaments.some(selected => selected.nom === med.nom);
          if (alreadySelected) return false;

          return med.nom.toLowerCase().includes(searchTerm) ||
                 (med.dci && med.dci.toLowerCase().includes(searchTerm)) ||
                 (med.dispositif && med.dispositif.toLowerCase().includes(searchTerm));
        });

        if (filtered.length > 0 || item.allowCustom) {
          resultsList.innerHTML = '';
          resultsList.style.display = 'block';

          // Afficher les résultats de recherche
          filtered.forEach(med => {
            const resultItem = document.createElement('div');
            resultItem.className = 'corticoide-result-item';
            resultItem.innerHTML = `
              <strong>${med.nom}</strong> ${med.dci ? `- ${med.dci}` : ''}<br>
              <small>${med.dispositif || ''} ${med.dosages ? `| Dosages: ${med.dosages.map(d => d + ' µg').join(', ')}` : ''}</small>
            `;
            resultItem.addEventListener('click', () => {
              selectedMedicaments.push(med);
              updateDisplay();
              searchInput.value = '';
              resultsList.style.display = 'none';
            });
            resultsList.appendChild(resultItem);
          });

          // Ajouter l'option "Autre médicament" si allowCustom est activé
          if (item.allowCustom) {
            const customItem = document.createElement('div');
            customItem.className = 'corticoide-result-item';
            customItem.style.backgroundColor = '#e8f5e9';
            customItem.style.borderLeft = '3px solid #4caf50';
            customItem.innerHTML = `
              <strong>➕ Ajouter un autre médicament</strong><br>
              <small style="color:#2e7d32;">Médicament non trouvé dans la liste</small>
            `;
            customItem.addEventListener('click', addCustomMedicament);
            resultsList.appendChild(customItem);
          }
        } else {
          resultsList.innerHTML = '<div class="corticoide-result-item" style="color:#7f8c8d; font-style:italic;">Aucun résultat</div>';
          resultsList.style.display = 'block';
        }
      });

      // Cacher les résultats si on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
          resultsList.style.display = 'none';
        }
      });

      return; // Pas besoin d'ajouter inputEl car déjà dans searchContainer
    }
    // Recherche de corticoïde inhalé avec barre de recherche (SÉLECTION MULTIPLE)
    else if (item.type === "search_corticoide") {
      // Créer un conteneur pour la recherche
      const searchContainer = document.createElement('div');
      searchContainer.className = 'corticoide-search-container';

      // Tableau pour stocker les sélections multiples
      let selectedCorticoids = [];

      // Barre de recherche
      const searchInput = document.createElement('input');
      searchInput.type = "text";
      searchInput.id = item.id + '_search';
      searchInput.placeholder = "Rechercher un corticoïde (vous pouvez en ajouter plusieurs)...";
      searchInput.className = 'corticoide-search';

      // Champ caché pour stocker toutes les sélections
      inputEl = document.createElement('input');
      inputEl.type = "hidden";
      inputEl.id = item.id;
      inputEl.name = item.id;

      // Liste déroulante des résultats
      const resultsList = document.createElement('div');
      resultsList.id = item.id + '_results';
      resultsList.className = 'corticoide-results';
      resultsList.style.display = 'none';

      // Affichage des sélections
      const selectionDisplay = document.createElement('div');
      selectionDisplay.id = item.id + '_display';
      selectionDisplay.className = 'corticoide-selection-multiple';

      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(resultsList);
      searchContainer.appendChild(selectionDisplay);
      searchContainer.appendChild(inputEl);

      container.appendChild(searchContainer);

      // Fonction pour mettre à jour l'affichage des sélections
      const updateDisplay = () => {
        inputEl.value = JSON.stringify(selectedCorticoids);

        if (selectedCorticoids.length === 0) {
          selectionDisplay.innerHTML = '';
          return;
        }

        selectionDisplay.innerHTML = selectedCorticoids.map((med, index) => `
          <div class="selected-corticoide">
            <strong>${med.nom}</strong> (${med.dci})<br>
            <small>${med.dispositif} - Dosages: ${med.dosages.map(d => d + ' µg').join(', ')}</small>
            <button type="button" class="remove-selection" data-index="${index}">×</button>
          </div>
        `).join('');

        // Ajouter les événements de suppression
        selectionDisplay.querySelectorAll('.remove-selection').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            selectedCorticoids.splice(index, 1);
            updateDisplay();
          });
        });
      };

      // Fonction de recherche
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length < 2) {
          resultsList.style.display = 'none';
          return;
        }

        const filtered = item.medicaments.filter(med => {
          // Ne pas afficher les médicaments déjà sélectionnés
          const alreadySelected = selectedCorticoids.some(selected => selected.nom === med.nom);
          if (alreadySelected) return false;

          return med.nom.toLowerCase().includes(searchTerm) ||
                 med.dci.toLowerCase().includes(searchTerm) ||
                 med.dispositif.toLowerCase().includes(searchTerm);
        });

        if (filtered.length > 0) {
          resultsList.innerHTML = '';
          resultsList.style.display = 'block';

          filtered.forEach(med => {
            const resultItem = document.createElement('div');
            resultItem.className = 'corticoide-result-item';
            resultItem.innerHTML = `
              <strong>${med.nom}</strong> - ${med.dci}<br>
              <small>${med.dispositif} | Dosages: ${med.dosages.map(d => d + ' µg').join(', ')}</small>
            `;
            resultItem.addEventListener('click', () => {
              // Ajouter à la liste des sélections
              selectedCorticoids.push(med);
              updateDisplay();

              searchInput.value = '';
              resultsList.style.display = 'none';
            });
            resultsList.appendChild(resultItem);
          });
        } else {
          resultsList.innerHTML = '<div class="corticoide-result-item" style="color:#7f8c8d; font-style:italic;">Aucun résultat ou déjà sélectionné</div>';
          resultsList.style.display = 'block';
        }
      });

      // Cacher les résultats si on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
          resultsList.style.display = 'none';
        }
      });

      return; // Pas besoin d'ajouter inputEl car déjà dans searchContainer
    }
    else if (item.type === "select") {
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

  // Gérer la dépendance entre médicament et dosage
  evaluationQuestions[type].forEach((item, idx) => {
    if (item.type === "select_dosage" && item.dependsOn) {
      const medicamentSelect = document.getElementById(item.dependsOn);
      const dosageSelect = document.getElementById(item.id);

      if (medicamentSelect && dosageSelect) {
        medicamentSelect.addEventListener('change', () => {
          const selectedMed = medicamentSelect.value;
          dosageSelect.innerHTML = '<option value="">--Sélectionnez une dose--</option>';

          if (selectedMed) {
            const medicaments = type === 'aod' ? medicamentsAOD : medicamentsAVK;
            const dosages = medicaments[selectedMed];

            if (dosages) {
              dosages.forEach(dosage => {
                const optEl = document.createElement('option');
                optEl.value = dosage;
                optEl.textContent = dosage;
                dosageSelect.appendChild(optEl);
              });
              dosageSelect.disabled = false;
            }
          } else {
            dosageSelect.disabled = true;
          }
        });
      }
    }
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

    // Envoi vers le webhook
    await sendToWebhook(data);

    // Afficher la page de confirmation
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
