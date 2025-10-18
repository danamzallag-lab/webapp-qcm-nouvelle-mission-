export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // URL du webhook Google Apps Script
  const googleWebhookUrl = "https://script.google.com/macros/s/AKfycby1cDc2__zQDqtEcI2LOiklnpOb0SVSYbi92Guz0YrnDuN7tPqli1_et3XLvTXS_DPSjg/exec";

  try {
    console.log('📤 Envoi vers Google Apps Script...');

    // Rediriger la requête vers Google Apps Script
    const response = await fetch(googleWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    console.log('✅ Réponse reçue:', data);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Erreur proxy:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur proxy: ' + error.message
    });
  }
}
