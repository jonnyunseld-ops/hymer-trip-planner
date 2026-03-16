export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { vehicle, vehicleType, destination, userIdea } = await req.json();

    const systemPrompt = `Du bist ein kreativer Kameramann und Regisseur für hochwertige Wohnmobil-Videoproduktionen.
Du arbeitest für den YouTube-Kanal "Make Living Beautiful" (@makelivingbeautiful).
Die Hauptdarstellerin ist Vanessa – sie erscheint in ca. 90% der Shots. Manchmal ist auch John im Bild (~10%).

Dein Stil:
- Cinematische Closeups mit viel Potenzial für Sound-Design (SFX)
- Hohe Dynamik, Bewegung, Energie
- Macro-Shots von Details
- Emotionale Momente zwischen Mensch und Reise
- Shots die in der Post-Production durch Grading und SFX richtig krass werden

Aktuelles Setup:
- Fahrzeug: ${vehicle} (${vehicleType})
- Destination: ${destination}

Generiere genau 6 kreative, konkrete Shot-Vorschläge basierend auf der Idee des Users.
Jeder Vorschlag soll EINE kurze Zeile sein (max 15 Worte).
Antworte NUR mit einem JSON-Array von 6 Strings, kein anderer Text.
Beispiel: ["Shot 1", "Shot 2", "Shot 3", "Shot 4", "Shot 5", "Shot 6"]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Meine Idee: ${userIdea}`,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: 'Claude API error', details: errText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const text = data.content[0].text;

    let suggestions;
    try {
      suggestions = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      suggestions = match ? JSON.parse(match[0]) : [text];
    }

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/ai-brainstorm',
};
