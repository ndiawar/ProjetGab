const fs = require('fs');
const readline = require('readline');

const TAILLE_MDP = 5; // Taille suffisante pour le mot de passe (5 caractères)
const FICHIER_UTILISATEURS = 'utilisateurs.txt';

class Utilisateur {
  constructor(idCard, mdp, solde, etatCmpt) {
    this.idCard = idCard;
    this.mdp = mdp;
    this.solde = solde;
    this.etatCmpt = etatCmpt;
  }
}

function isValidId(idCard) {
  return idCard >= 1000 && idCard <= 9999;
}

function isValidMdp(mdp) {
  return mdp.length === TAILLE_MDP && /^\d+$/.test(mdp);
}

function isValidMontant(montant) {
  return montant > 0 && montant % 1000 === 0;
}

function lireUtilisateurs() {
  const data = fs.readFileSync(FICHIER_UTILISATEURS, 'utf-8');
  const utilisateurs = data.split('\n').filter(line => line).map(line => {
    const [idCard, mdp, solde, etatCmpt] = line.split(' ');
    return new Utilisateur(parseInt(idCard), mdp, parseFloat(solde), Boolean(parseInt(etatCmpt)));
  });
  return utilisateurs;
}

function ecrireUtilisateurs(utilisateurs) {
  const data = utilisateurs.map(u => `${u.idCard} ${u.mdp} ${u.solde.toFixed(2)} ${u.etatCmpt ? 1 : 0}`).join('\n');
  fs.writeFileSync(FICHIER_UTILISATEURS, data, 'utf-8');
}

async function G4GAB() {
  let utilisateurs = lireUtilisateurs();
  let soldeGAB = 500000.0;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => {
    return new Promise(resolve => rl.question(prompt, resolve));
  };

  while (true) {
    let utilisateur = null;

    const idCardStr = await question('Entrez votre identifiant de carte (4 chiffres) :\n');
    const idCard = parseInt(idCardStr);

    if (!isValidId(idCard)) {
      console.log('Identifiant de carte invalide. Veuillez réessayer.');
      continue;
    }

    utilisateur = utilisateurs.find(u => u.idCard === idCard);

    if (!utilisateur) {
      console.log('Identifiant de carte introuvable.');
    } else if (utilisateur.etatCmpt) {
      console.log('Compte bloqué. Veuillez contacter votre banque.');
    } else {
      let tentative = 1;

      while (tentative <= 3) {
        const mdp = await question('Entrez votre mot de passe :\n');

        if (mdp === utilisateur.mdp) {
          console.log('Authentification réussie.');

          while (true) {
            const choixStr = await question('1. Vérifier le solde\n2. Retirer de l\'argent\n3. Retourner au menu principal\n4. Déconnexion\n');
            const choix = parseInt(choixStr);

            if (choix === 1) {
              console.log(`Votre solde est de : ${utilisateur.solde.toFixed(2)}`);
            } else if (choix === 2) {
              while (true) {
                const choixRetraitStr = await question('1. 10 000 F\n2. 50 000 F\n3. Autre montant\n4. Retourner au menu principal\n');
                const choixRetrait = parseInt(choixRetraitStr);

                if (choixRetrait === 4) break;

                let montant = 0;

                if (choixRetrait === 1) {
                  montant = 10000.0;
                } else if (choixRetrait === 2) {
                  montant = 50000.0;
                } else if (choixRetrait === 3) {
                  const montantStr = await question('Entrez le montant multiple de 1000 :\n');
                  montant = parseFloat(montantStr);

                  if (!isValidMontant(montant)) {
                    console.log('Montant invalide. Le montant doit être un multiple de 1000. Veuillez réessayer.');
                    continue;
                  }
                }

                if (montant > 0) {
                  if (montant > utilisateur.solde) {
                    console.log('Fonds insuffisants sur le compte.');
                  } else {
                    utilisateur.solde -= montant;
                    soldeGAB -= montant;
                    console.log(`Retrait de ${montant.toFixed(2)} effectué avec succès. Solde restant : ${utilisateur.solde.toFixed(2)}`);
                    ecrireUtilisateurs(utilisateurs);
                  }
                }
              }
            } else if (choix === 3) {
              console.log('Transaction annulée.');
              break;
            } else if (choix === 4) {
              break;
            } else {
              console.log('Choix invalide. Veuillez réessayer.');
            }
          }
          break;
        } else {
          console.log(`Mot de passe incorrect. Tentative ${tentative} sur 3.`);
          tentative++;

          if (tentative > 3) {
            console.log('Compte bloqué après trois tentatives échouées.');
            utilisateur.etatCmpt = true;
            ecrireUtilisateurs(utilisateurs);
            break;
          }
        }
      }
    }
  }

  rl.close();
}

G4GAB();