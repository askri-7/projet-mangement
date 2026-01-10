export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chargesFixes, prixVente, coutVariableUnitaire } = req.body;

  const margeContribution = prixVente - coutVariableUnitaire;

  if (margeContribution <= 0) {
    return res.json({
      pointMort: 'Impossible',
      chiffreAffaireCritique: 'N/A',
      margeContribution: margeContribution.toFixed(2),
      erreur: 'Le prix de vente doit être supérieur au coût variable unitaire!'
    });
  }

  const pointMort = (chargesFixes / margeContribution).toFixed(2);
  const chiffreAffaireCritique = (pointMort * prixVente).toFixed(2);

  res.json({
    pointMort,
    chiffreAffaireCritique,
    margeContribution: margeContribution.toFixed(2)
  });
}
