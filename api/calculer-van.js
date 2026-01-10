export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    investissementInitial,
    cashFlowAnnuel,
    tauxActualisation,
    duree
  } = req.body;

  const taux = tauxActualisation / 100;
  let vanTotal = -investissementInitial;

  for (let t = 1; t <= duree; t++) {
    vanTotal += cashFlowAnnuel / Math.pow(1 + taux, t);
  }

  let decision = '';
  let interpretation = '';

  if (vanTotal > 0) {
    decision = '✓ Accepter le projet';
    interpretation =
      "Le projet est rentable. La valeur actualisée des flux futurs dépasse l’investissement initial.";
  } else if (vanTotal === 0) {
    decision = '⚠️ Indifférent';
    interpretation =
      "Le projet génère exactement le rendement requis. L’entreprise peut être indifférente.";
  } else {
    decision = '❌ Rejeter le projet';
    interpretation =
      "Le projet n'est pas rentable. Les flux futurs ne couvrent pas l’investissement initial.";
  }

  res.json({
    van: vanTotal.toFixed(2),
    decision,
    interpretation
  });
}
