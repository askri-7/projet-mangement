export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    chiffreAffaires,
    coutVariable,
    chargesFixesExpl,
    chargesFinancieres,
    tauxImpot
  } = req.body;

  const mcv = chiffreAffaires - coutVariable;
  const tauxMCV = chiffreAffaires > 0 ? (mcv / chiffreAffaires) * 100 : 0;
  const baii = mcv - chargesFixesExpl;
  const bai = baii - chargesFinancieres;
  const impots = bai > 0 ? (bai * tauxImpot / 100) : 0;
  const revenuNet = bai - impots;

  let interpretationMCV = '';
  if (tauxMCV >= 40) {
    interpretationMCV =
      "✓ Excellente marge sur coût variable! L'entreprise génère une bonne contribution pour couvrir les charges fixes.";
  } else if (tauxMCV >= 20) {
    interpretationMCV = '⚠️ Marge acceptable mais peut être améliorée.';
  } else {
    interpretationMCV = '❌ Marge faible. Attention aux coûts variables!';
  }

  let interpretationBAII = '';
  if (baii > 0) {
    interpretationBAII =
      "✓ L'exploitation est rentable avant charges financières.";
  } else {
    interpretationBAII =
      "❌ L'exploitation n'est pas rentable. Les charges fixes sont trop élevées par rapport à la MCV.";
  }

  let interpretationBAI = '';
  if (bai > 0) {
    interpretationBAI = '✓ Bénéfice positif avant impôts.';
  } else {
    interpretationBAI =
      '❌ Perte avant impôts. Les charges financières aggravent la situation.';
  }

  let interpretationFinale = '';
  if (revenuNet > 0) {
    interpretationFinale =
      "✅ L'entreprise est RENTABLE! Elle génère un bénéfice net positif.";
  } else if (revenuNet === 0) {
    interpretationFinale =
      "⚠️ L'entreprise est à l'équilibre (pas de bénéfice ni de perte).";
  } else {
    interpretationFinale =
      "❌ L'entreprise subit une PERTE nette. Des actions correctives sont nécessaires.";
  }

  res.json({
    mcv,
    tauxMCV,
    baii,
    bai,
    impots,
    revenuNet,
    interpretationMCV,
    interpretationBAII,
    interpretationBAI,
    interpretationFinale
  });
}
