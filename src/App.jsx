import React, { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeToData, saveData, isConfigured as firebaseReady } from './firebase';

/* ─────────────────────────────────────
   TRIP DATA
───────────────────────────────────── */
const TRIPS = [
  {
    id: 'toskana',
    vehicle: 'Hymer Exsis-t 474',
    vehicleType: 'Teilintegriert',
    destination: 'Toskana',
    country: '🇮🇹',
    dates: '25.03. – 28.03.2026',
    startDate: '2026-03-25',
    endDate: '2026-03-28',
    days: 4,
    km: '~1.100 km',
    route: 'Ostfildern → Gotthard/Brenner → Florenz → Pisa → Val d\'Orcia → Baccoleno',
    heroImg: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80',
    vehicleImg: 'https://www.hymer.com/hymer/produktbilder/2020_01/produktbilder/motorhomes/freisteller_motorcaravans/image-thumb__7924__wls-teaser-large/hy20_ext.webp',
    mustSpots: [
      {
        name: 'Pisa & San Rossore',
        desc: 'Parco Regionale mit Pinienbäumen – perfekt für Waldlicht-Shots',
        mapsQuery: 'Parco Regionale Migliarino San Rossore Massaciuccoli Pisa',
        locationTips: [
          'Area Sosta Camper Pisa – offizieller WoMo-Stellplatz, 10 Min zu Fuß zum Turm',
          'Parking Via Pietrasantina – großer Schotterparkplatz, easy für 7m+',
          'Tenuta San Rossore Einfahrt – Waldweg-Kulisse, morgens menschenleer',
          'Viale delle Cascine – Pinien-Allee, perfekt für Driving Shots mit Baumtunnel',
          'Marina di Vecchiano – Strandparkplatz, Wohnmobil + Meer-Kombi',
          'Camping Village Torre Pendente – direkter Turm-Blick, große Stellplätze',
          'SP24 Richtung Lucca – Landstraße durch Olivenhaine, kaum Verkehr morgens',
          'Calci bei Pisa – Bergdorf mit Kloster, Panorama-Parkplatz oben',
          'Bocca d\'Arno – Flussmündung, ruhig, Naturkulisse für Sonnenuntergang',
          'Certosa di Pisa Calci – monumentaler Kloster-Hintergrund, P für große Fahrzeuge',
        ],
      },
      {
        name: 'Baccoleno bei Asciano',
        desc: 'Zypressen-Allee – DER Hero-Shot der Toskana',
        mapsQuery: 'Baccoleno Asciano Toscana cipresso',
        locationTips: [
          'SP438 Abzweig Baccoleno – Schotterweg-Einfahrt, Platz zum Rangieren',
          'Asciano Ortsparkplatz – sicher parken, 15 Min mit Drohne zum Spot',
          'Strada Provinciale Lauretana – Hügelstraße, epische Kurven für Fahraufnahmen',
          'Crete Senesi Aussichtspunkt SP451 – weite Hügellandschaft, kein Zaun',
          'Monte Oliveto Maggiore Parkplatz – Kloster-Setting, große Stellfläche',
          'San Giovanni d\'Asso – mittelalterliches Dorf, ruhiger Platz am Ortsrand',
          'Bagno Vignoni Thermalplatz – heißes Quellbecken als Kulisse, P 200m',
          'Strada Bianca bei Pienza – weiße Schotterstraße, Staubwolken-Shots',
          'Podere Belvedere (Aussichtspunkt) – Instagram-Famous Haus mit Zypressen',
          'SP146 zwischen Pienza und Montepulciano – Panoramastraße, Parkbuchten',
        ],
      },
    ],
    schedule: [
      { day: 1, date: '25.03.', title: 'Anreisetag', desc: 'Ostfildern → Toskana, Alpenpässe, erste Eindrücke' },
      { day: 2, date: '26.03.', title: 'Pisa & San Rossore', desc: 'Schiefer Turm, Pinienwald, goldenes Nachmittagslicht' },
      { day: 3, date: '27.03.', title: 'Val d\'Orcia & Baccoleno', desc: 'Zypressen-Allee, Hügellandschaft, Sonnenuntergang' },
      { day: 4, date: '28.03.', title: 'Rückreise', desc: 'Letzte Shots am Morgen, Heimfahrt' },
    ],
    weatherLocations: [
      { name: 'Pisa', lat: 43.72, lon: 10.40 },
      { name: 'Siena', lat: 43.32, lon: 11.33 },
    ],
    creativeShots: [
      'Vanessa läuft durch Pinienbäume, Gegenlicht-Silhouette mit Lens Flare',
      'Macro: Olivenöl tropft auf rustikalen Holztisch, Zeitlupe',
      'Drohne reveal: Zypressen-Allee Baccoleno bei Sonnenaufgang',
      'Vanessa öffnet Wohnmobil-Tür, Toskana-Panorama flutet rein',
      'Closeup Espresso-Zubereitung im Wohnmobil, Dampf-Details',
      'Gimbal-Tracking: Vanessa geht durch Val d\'Orcia Hügelfeld',
      'Timelapse: Sonnenuntergang über Siena von Campingplatz',
      'Macro: Vanessas Hand streicht über Weizenähren im Abendlicht',
      'Low-Angle: Exsis-t 474 fährt auf Allee zu, Staub wirbelt auf',
      'Vanessa liest Buch auf Campingstuhl, Rack-Focus auf Toskana-Hügel',
      'Interior Walkthrough mit natürlichem Toskana-Licht durch alle Fenster',
      'Drohne Top-Down: Wohnmobil zwischen Olivenhainen, perfekte Symmetrie',
      'Closeup: Weinrebe mit Tautropfen, Vanessa unscharf im Hintergrund',
      'Split-Screen-Moment: Vanessa kocht drinnen, Landschaft draußen',
      'Golden Hour Portrait: Vanessa am Wohnmobil-Fenster, warmes Seitenlicht',
      'Slow Pan über italienische Dorfsilhouette bei Dämmerung',
    ],
    vehicleSpecs: {
      grundriss: 'Teilintegriert',
      laenge: '659 cm',
      breite: '222 cm',
      hoehe: '279 cm',
      gewicht: '3.500 kg zGG',
      chassis: 'Fiat Ducato',
      schlafplaetze: '2–3',
      besonderheit: 'PUAL-Leichtbau, kompakt & wendig',
      sitzplaetze: '4',
      kueche: 'Dreiflammkocher, Kühlschrank 137L',
      bad: 'Kompaktbad mit Dusche',
      heizung: 'Truma Combi 6',
      tankWasser: '120 L Frischwasser',
      bett: 'Hubbett + Heckbett (197×140 cm)',
    },
    dekoItems: [
      { id: 'dt1', text: 'Olivenöl-Flasche (hübsches Etikett) für Küchen-Shots', emoji: '🫒' },
      { id: 'dt2', text: 'Terrakotta-Schale für Obst-Arrangement', emoji: '🍑' },
      { id: 'dt3', text: 'Strohgeflecht-Untersetzer (3er Set, verschiedene Größen)', emoji: '🌾' },
      { id: 'dt4', text: 'Leinentischdecke creme/natur für Tisch-Szenen', emoji: '🧵' },
      { id: 'dt5', text: 'Kleine Espresso-Kanne (Bialetti Moka) als Hero-Prop', emoji: '☕' },
      { id: 'dt6', text: 'Sonnenblumen-Strauß (vor Ort kaufen) für Vase', emoji: '🌻' },
      { id: 'dt7', text: 'Rustikales Brotkörbchen + echtes Ciabatta', emoji: '🍞' },
      { id: 'dt8', text: 'Chianti-Flasche im Bastkorb als Deko-Element', emoji: '🍷' },
    ],
  },
  {
    id: 'irland',
    vehicle: 'Hymer GT-S',
    vehicleType: 'Van / Campervan',
    destination: 'Irland',
    country: '🇮🇪',
    dates: '06.05. – 24.05.2026',
    startDate: '2026-05-06',
    endDate: '2026-05-24',
    days: 19,
    km: '~3.500+ km',
    route: 'Ostfildern → Calais → Eurotunnel → Wales → Fishguard → Rosslare → Wild Atlantic Way',
    heroImg: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80',
    vehicleImg: 'https://www.hymer.com/hymer/produktbilder/2020_01/produktbilder/campervans/freisteller_campervans/image-thumb__103884__wls-teaser-large/hc25_gcs_xperience_freisteller.webp',
    mustSpots: [
      {
        name: 'Eurotunnel Calais → Folkestone',
        desc: 'Autozug als Content-Piece – einzigartige Perspektiven',
        mapsQuery: 'Eurotunnel Calais Terminal France',
        locationTips: [
          'Eurotunnel Terminal Calais – Überbreite WoMo-Spur, Ankunft 2h vorher für Shots',
          'Plage de Calais Strand-Parkplatz – Vor-Abfahrt-Location, Blick auf Kreidefelsen',
          'Cap Blanc-Nez Parkplatz – dramatische Klippen, Ärmelkanal-Panorama, Drohne!',
          'Folkestone Harbour Arm – nach Ankunft UK, hafen-vibes, Fish & Chips',
          'Shakespeare Beach Dover – Kreidefelsen-Kulisse direkt nach dem Tunnel',
          'A20 Layby bei Folkestone – Rastplatz mit Blick auf Eurotunnel-Einfahrt',
          'Cité Europe Parkhaus Calais – überdacht, sicher, vor der Überfahrt organisieren',
          'Sangatte Opal-Küste – ruhiger Küsten-Spot, WoMo-freundlich',
          'Welsh Coastal Road A487 – auf dem Weg nach Fishguard, Küstenstraße',
          'Pembrokeshire Coast Layby – kurz vor Fishguard, letzte Wales-Shots',
        ],
      },
      {
        name: 'Fähre Fishguard → Rosslare',
        desc: 'Ankunfts-Moment in Irland filmen – emotionaler Turning Point',
        mapsQuery: 'Fishguard Harbour Stena Line Ferry Terminal',
        locationTips: [
          'Fishguard Harbour Terminal – 90 Min vorher da, Verlade-Prozess filmen',
          'Fishguard Lower Town – malerischer Hafen, Vorbeifahrt-Shot',
          'Fährdeck Außenbereich – Wind-in-Haaren-Shot, Küste verschwindet',
          'Rosslare Europort Ankunft – erstes Irland-Feeling, grüne Hügel',
          'Kilmore Quay – erster Stopp nach Ankunft, Fischerhafen, authentisch',
          'Hook Head Lighthouse Parkplatz – ältester Leuchtturm Europas, WoMo passt',
          'Dunmore East Village – buntes Fischerdorf, P am Hafen',
          'Tramore Beach Car Park – breiter Strand, großer P, erster Irland-Beach-Shot',
          'Waterford Viking Triangle – Stadtzentrum, Camper-P am Kai',
          'Ring of Hook Scenic Route – ruhige Küstenstraße, perfekt für ersten Driving Shot',
        ],
      },
    ],
    schedule: [
      { day: 1, date: '06.05.', title: 'Anreise Calais', desc: 'Ostfildern → Calais, Eurotunnel-Vorbereitung' },
      { day: 2, date: '07.05.', title: 'Eurotunnel & Wales', desc: 'Autozug-Erlebnis, erste UK-Eindrücke' },
      { day: 3, date: '08.05.', title: 'Fishguard → Rosslare', desc: 'Fähre nach Irland, Ankunftsmoment' },
      { day: '4–10', date: '09.–15.05.', title: 'Wild Atlantic Way Süd', desc: 'Kerry, Dingle, Cliffs of Moher' },
      { day: '11–15', date: '16.–20.05.', title: 'Connemara & Norden', desc: 'Galway, Donegal, raue Küsten' },
      { day: '16–19', date: '21.–24.05.', title: 'Rückreise', desc: 'Dublin, Fähre, Heimfahrt' },
    ],
    weatherLocations: [
      { name: 'Dublin', lat: 53.35, lon: -6.26 },
      { name: 'Galway', lat: 53.27, lon: -9.06 },
      { name: 'Ring of Kerry', lat: 51.88, lon: -9.90 },
    ],
    creativeShots: [
      'GT-S fährt in Eurotunnel rein – POV aus Cockpit, Lichtwechsel',
      'Vanessa steht auf Fähre-Deck, Wind in Haaren, Irland-Küste erscheint',
      'Drohne: GT-S auf schmaler Küstenstraße, Atlantik-Wellen daneben',
      'Macro: Regentropfen auf GT-S Windschutzscheibe, grüne Landschaft dahinter',
      'Vanessa in gelber Regenjacke an Cliffs of Moher, epische Weite',
      'Low-Angle: GT-S Reifen rollen durch Pfütze, Slow-Motion-Splash',
      'Gimbal-Follow: Vanessa läuft über irische Steinmauer, Schafe im BG',
      'Interior: Gemütlicher Regentag im GT-S, Tee kochen, Kondenswasser am Fenster',
      'Drohne Orbit: Ruine/Schloss mit GT-S davor, dramatische Wolken',
      'Closeup: Irish Pub Pint wird eingeschenkt, Schaum-Details',
      'Vanessa und John am Lagerfeuer bei Sonnenuntergang, Silhouetten',
      'Timelapse: Dramatischer irischer Himmel über grüner Weide',
      'POV Driving: Enge irische Landstraße mit Hecken, immersives Feeling',
      'Macro: Vanessas Augen reflektieren die grüne irische Landschaft',
      'Sonnenaufgang durch Nebel an der Atlantikküste, GT-S als Silhouette',
      'Vanessa springt in kaltes Meer, Underwasser-Halbtaucher-Shot',
      'Closeup: Hand dreht Radio im GT-S an, irische Musik ertönt',
      'Top-Down Drohne: GT-S auf einspuriger Brücke, Fluss darunter',
    ],
    vehicleSpecs: {
      grundriss: 'Campervan / Van',
      laenge: '709 cm',
      breite: '~206 cm',
      hoehe: '~285 cm',
      gewicht: '3.500 kg zGG',
      chassis: 'Mercedes-Benz Sprinter',
      schlafplaetze: '2–5',
      besonderheit: 'Stufenloser Boden, 2,04 m Stehhöhe, Sprinter-Power',
      sitzplaetze: '4',
      kueche: 'Zweiflamm-Gaskocher, Kompressor-Kühlschrank',
      bad: 'Nasszelle mit Schwenkwand-Dusche',
      heizung: 'Truma Combi 4',
      tankWasser: '100 L Frischwasser',
      bett: 'Längsbetten hinten + Aufstelldach optional',
    },
    dekoItems: [
      { id: 'di1', text: 'Wolldecke / Tartan-Plaid (grün/braun, irisch)', emoji: '🧶' },
      { id: 'di2', text: 'Tweed-Kissen (2 Stk, Cottage-Vibes)', emoji: '🛋️' },
      { id: 'di3', text: 'Keramik-Teekanne + Steingut-Becher für Tee-Szenen', emoji: '🫖' },
      { id: 'di4', text: 'Alte Bücher-Stapel (irische Autoren, als Requisite)', emoji: '📚' },
      { id: 'di5', text: 'Gummistiefel (Hunter-Style) für Outdoor-Shots', emoji: '🥾' },
      { id: 'di6', text: 'Laternen-Windlicht (Metall, vintage) für Abend-Ambient', emoji: '🪔' },
      { id: 'di7', text: 'Regenschirm (transparent oder klassisch) als Stil-Element', emoji: '☂️' },
      { id: 'di8', text: 'Whiskey-Gläser + Holz-Tablett für Pub-Style-Interior', emoji: '🥃' },
    ],
  },
  {
    id: 'schweiz',
    vehicle: 'Hymer Grand Canyon S 700 Crosstrail',
    vehicleType: 'Kastenwagen / Offroad',
    destination: 'Schweiz',
    country: '🇨🇭',
    dates: '28.05. – 31.05.2026',
    startDate: '2026-05-28',
    endDate: '2026-05-31',
    days: 4,
    km: '~900 km',
    route: 'Ostfildern → Zürich → Furkapass → Grimselpass → Zermatt → Sustenpass → Ostfildern',
    heroImg: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    vehicleImg: 'https://www.hymer.com/hymer/website-assets/1.produktseiten/sondermodelle/grand_canyon_s_crosstrail/image-thumb__162671__wls-hymer-stage/gcs700_crosstrail_1920_800_hero_freisteller.webp',
    mustSpots: [
      {
        name: 'Zermatt / Matterhorn',
        desc: 'DAS Schweiz-Motiv – ikonisch, muss im Kasten sein',
        mapsQuery: 'Zermatt Matterhorn Schweiz',
        locationTips: [
          'Täsch Terminal Parkplatz – Pflicht! Zermatt autofrei, WoMo bleibt hier, Zug 12 Min',
          'Randa Aussichtspunkt – Matterhorn-Blick von unten, WoMo passt auf Seitenstraße',
          'Stellplatz Täsch Mattertal – offizieller WoMo-Platz, Strom + Wasser',
          'Zermatt Gornergrat Bahn Tal – Drohne von Täsch Richtung Matterhorn starten',
          'St. Niklaus Vispertal – ruhiges Bergdorf, Brücke mit Mattertal-Blick',
          'Camping Attermenzen Randa – Stellplatz mit direktem Matterhorn-View',
          'Schlucht bei Randa – dramatische Felskulisse, Straße eng aber machbar',
          'Visp Altstadt Parkplatz – Plan B bei schlechtem Wetter, Altstadt-Flair',
          'Europabrücke Wanderweg Start – längste Hängebrücke der Welt, Drohnen-Spot',
          'Grächen Panoramastraße – Höhenstraße mit Mattertal-Panorama, Parkbuchten',
        ],
      },
      {
        name: 'Alpenpässe Furka, Grimsel, Susten',
        desc: 'Haarnadelkurven für epische Driving Shots',
        mapsQuery: 'Furkapass Passhöhe Schweiz',
        locationTips: [
          'Furkapass Passhöhe 2.436m – großer Schotterplatz oben, Hotel Furkablick nebenan',
          'Rhonegletscher Belvedere – Gletscher-Kulisse, P direkt an der Straße',
          'James-Bond-Straße Furka (Goldfinger) – legendäre Serpentinen, Drohne Pflicht',
          'Grimsel Passhöhe Stausee – türkiser Bergsee, WoMo-Parkplatz am See',
          'Gelmerbahn Talstation – steilste Standseilbahn Europas, P vorhanden',
          'Sustenpass Passhöhe 2.224m – Parkplatz mit 360° Bergpanorama',
          'Steingletscher am Susten – Gletscher direkt an der Straße, Parkbucht',
          'Göschenen Schöllenen-Schlucht – Teufelsbrücke, dramatische Schlucht',
          'Andermatt Dorfplatz – hübsches Bergdorf, Dreh-Pause, Kaffee-Spot',
          'Oberalppass bei Andermatt – Rhein-Quelle, weitere Serpentinen für Driving Shots',
        ],
      },
    ],
    schedule: [
      { day: 1, date: '28.05.', title: 'Anreise & Furkapass', desc: 'Ostfildern → Furkapass, erste Passfahrt' },
      { day: 2, date: '29.05.', title: 'Grimselpass & Zermatt', desc: 'Zweiter Pass, Ankunft Zermatt' },
      { day: 3, date: '30.05.', title: 'Zermatt & Matterhorn', desc: 'Ganzer Tag Matterhorn-Shooting' },
      { day: 4, date: '31.05.', title: 'Sustenpass & Rückreise', desc: 'Letzter Pass, Heimfahrt' },
    ],
    weatherLocations: [
      { name: 'Zermatt', lat: 46.02, lon: 7.75 },
      { name: 'Furkapass', lat: 46.57, lon: 8.42 },
    ],
    creativeShots: [
      'Drohne Chase: Grand Canyon fährt Haarnadelkurve am Furkapass',
      'Vanessa steht an Passstraße, Arme ausgebreitet, Berge 360°',
      'Macro: Schaltknauf Grand Canyon Crosstrail, Hand schaltet – Berg-Kulisse durch Fenster',
      'Low-Angle: Grand Canyon meistert Schotterweg, Offroad-Vibes',
      'Matterhorn-Reveal: Nebel lichtet sich, Vanessa dreht sich um, Staunen',
      'Timelapse: Wolken ziehen um Matterhorn-Gipfel, Grand Canyon im Vordergrund',
      'Gimbal-Tracking: Vanessa wandert alpinen Pfad, Grand Canyon wartet unten',
      'Interior Morning Routine: Kaffee kochen mit Matterhorn-Blick durchs Heckfenster',
      'Drohne Top-Down: Serpentinen von oben, Grand Canyon als kleiner Punkt',
      'Closeup: Kuhglocke im Vordergrund, Grand Canyon fährt durch im BG',
      'Vanessa lehnt an Grand Canyon, trinkt Tee, Atem dampft in Bergluft',
      'POV Driving: Tunnels am Grimselpass, Lichtwechsel dunkel-hell-dunkel',
      'Sonnenaufgang über Zermatt, erste Sonnenstrahlen treffen Grand Canyon',
      'Macro: Edelweiß am Wegesrand, Rack-Focus auf Grand Canyon dahinter',
      'Vanessa & John High-Five vor Matterhorn, Zeitlupe, Euphorie',
      'Spiegelung: Grand Canyon in Bergsee, perfekte Symmetrie',
    ],
    vehicleSpecs: {
      grundriss: 'Kastenwagen / Offroad-Van',
      laenge: '697 cm',
      breite: '206 cm',
      hoehe: '290 cm',
      gewicht: '4.100 kg zGG',
      chassis: 'Mercedes-Benz Sprinter 4x4',
      schlafplaetze: '2–4',
      besonderheit: 'Allrad, Offroad-Fahrwerk, höhergelegt, Unterfahrschutz',
      sitzplaetze: '4',
      kueche: 'Zweiflamm-Gaskocher, 90L Kompressor-Kühlschrank',
      bad: 'Nasszelle mit Schwenkwand',
      heizung: 'Truma Combi 6',
      tankWasser: '110 L Frischwasser',
      bett: 'Querbetten hinten (2×) + optionales Aufstelldach',
    },
    dekoItems: [
      { id: 'ds1', text: 'Kuhglocke (klein, dekorativ) als Schweiz-Prop', emoji: '🔔' },
      { id: 'ds2', text: 'Schweizer Taschenmesser (Victorinox) als Detail-Shot', emoji: '🔪' },
      { id: 'ds3', text: 'Thermosflasche (Edelstahl, matt) für Berg-Shots', emoji: '🫗' },
      { id: 'ds4', text: 'Wanderkarte (gefaltet, Schweizer Alpen) als Prop', emoji: '🗺️' },
      { id: 'ds5', text: 'Käse-Board (Mini-Fondue-Set) für Alpen-Food-Shots', emoji: '🧀' },
      { id: 'ds6', text: 'Wollmütze + Schal (rot/weiß) für Bergszenen', emoji: '🧣' },
      { id: 'ds7', text: 'Karabiner + Seil (deko) für Adventure-Vibes', emoji: '🧗' },
      { id: 'ds8', text: 'Holz-Schnitzfigur (Edelweiß/Alphorn) als Shelf-Deko', emoji: '🪵' },
    ],
  },
  {
    id: 'provence-spanien-portugal',
    vehicle: 'Hymer B-ML I 880',
    vehicleType: 'Integriert / Liner',
    destination: 'Provence → Spanien → Portugal',
    country: '🇵🇹',
    dates: '02.06. – 07.06.2026',
    startDate: '2026-06-02',
    endDate: '2026-06-07',
    days: 6,
    km: '~3.200 km',
    route: 'Ostfildern → Provence → Pyrenäen → Nordspanien → Portugal Küste → Algarve/Faro',
    heroImg: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=80',
    vehicleImg: 'https://www.hymer.com/hymer/produktbilder/2020_01/produktbilder/motorhomes/freisteller_motorcaravans/image-thumb__7917__wls-teaser-large/hy20_bml.webp',
    mustSpots: [
      {
        name: 'Valensole / Lavendelfelder',
        desc: 'Lila Felder soweit das Auge reicht – Provence pur',
        mapsQuery: 'Plateau de Valensole Lavendelfelder Provence',
        locationTips: [
          'D6 bei Valensole – Lavendelfeld-Straße, Parkbuchten direkt am Feld',
          'Puimoisson Lavendelstraße – weniger touristisch als Valensole, riesige Felder',
          'Aire de Camping-Cars Valensole – offizieller WoMo-Platz im Ort',
          'Moustiers-Sainte-Marie – schönstes Dorf der Provence, P am Ortsrand für große Fahrzeuge',
          'Lac de Sainte-Croix – türkiser See, Strandparkplatz, WoMo + Wasser-Kombi',
          'Riez Altstadt – römische Säulen, ruhiger Stellplatz am Fluss',
          'Route de Manosque D907 – Panoramastraße durch Lavendelfelder',
          'Château de Sauvan bei Mane – Schloss-Kulisse, großer Vorplatz',
          'Gorges du Verdon Aussichtspunkt – Europas Grand Canyon, WoMo-P oben',
          'Allemagne-en-Provence Château – Schlossturm + Lavendelfeld-Kombi',
        ],
      },
      {
        name: 'Baskenland & Kantabrien',
        desc: 'Nordspanien Küste – wild, grün, dramatisch',
        mapsQuery: 'San Juan de Gaztelugatxe Baskenland Spanien',
        locationTips: [
          'San Juan de Gaztelugatxe Parkplatz – Game-of-Thrones-Insel, WoMo auf P2',
          'Playa de Laga – Surfstrand, großer Schotterparkplatz, Campervan-Vibes',
          'Mundaka Hafen – berühmte Linkswelle, kompakter Parkplatz am Kai',
          'Getaria Hafen – Fischerdorf, Pintxos, Parkplatz am Hafen',
          'Flysch-Küste Zumaia – dramatische Felsschichten, P am Strand',
          'Cabo Machichaco Leuchtturm – Klippen-Panorama, Schotterweg fahrbar',
          'Comillas Capricho de Gaudí – Gaudí-Villa, P 200m, Drohnen-Spot',
          'Playa de las Catedrales (Galicien) – Kathedral-Felsen, Parkplatz oben',
          'Santillana del Mar – mittelalterliches Dorf, WoMo-Platz am Ortsrand',
          'Picos de Europa Fuente Dé – Seilbahn, dramatische Berge, großer P',
        ],
      },
      {
        name: 'Faro / Algarve',
        desc: 'Klippen, Strände, goldenes Licht – perfekter Abschluss',
        mapsQuery: 'Praia da Marinha Algarve Portugal',
        locationTips: [
          'Praia da Marinha Parkplatz – ikonische Klippen, großer Erdparkplatz oben',
          'Ponta da Piedade Lagos – Felsformationen, WoMo-P 300m entfernt',
          'Praia do Camilo – Treppen runter zum Strand, Parkplatz oben für WoMo',
          'Cabo de São Vicente – westlichster Punkt Europas, großer P, Leuchtturm',
          'Praia da Falésia Vilamoura – endlose Klippen, Parkfläche oben am Rand',
          'Benagil Cave Parkplatz – berühmte Grotte, P am Klippenrand, Drohne muss',
          'Tavira Altstadt – Parkplatz am Fluss, maurische Architektur als Kulisse',
          'Ria Formosa Naturpark Faro – Lagunenlandschaft, WoMo-Stellplatz am Rand',
          'Sagres Festung Parkplatz – dramatische Klippen, Surfer-Vibe, großer P',
          'Silves Burgmauer – maurische Burg in rot, Parkplatz unten am Fluss',
        ],
      },
    ],
    schedule: [
      { day: 1, date: '02.06.', title: 'Anreise Provence', desc: 'Ostfildern → Provence, Lavendelfelder erkunden' },
      { day: 2, date: '03.06.', title: 'Provence Shooting', desc: 'Ganzer Tag Lavendel, Märkte, französisches Flair' },
      { day: 3, date: '04.06.', title: 'Richtung Spanien', desc: 'Durch die Pyrenäen nach Nordspanien' },
      { day: 4, date: '05.06.', title: 'Nordspanien Küste', desc: 'Baskenland, San Sebastián Vibes' },
      { day: 5, date: '06.06.', title: 'Portugal Küste', desc: 'Küstenstraße Richtung Süden' },
      { day: 6, date: '07.06.', title: 'Faro & Abschluss', desc: 'Algarve-Klippen, letztes großes Shooting' },
    ],
    weatherLocations: [
      { name: 'Provence/Aix', lat: 43.53, lon: 5.45 },
      { name: 'San Sebastián', lat: 43.32, lon: -1.98 },
      { name: 'Faro', lat: 37.02, lon: -7.93 },
    ],
    creativeShots: [
      'Drohne: B-ML I 880 zwischen lila Lavendelreihen, perfekte Linien',
      'Vanessa pflückt Lavendel, Macro auf Hände mit lila Blüten',
      'Golden Hour: B-ML I 880 Silhouette vor Provence-Sonnenuntergang',
      'Interior: Luxus-Feeling des 880 zeigen, Vanessa kocht französisch',
      'Gimbal-Follow: Vanessa über provenzalischen Markt, bunte Stoffe',
      'Pyrenäen-Durchfahrt: Dramatic Clouds, B-ML I 880 im Tunnel-Ausgang',
      'Closeup: Tapas-Platte, Hand greift Olive, San Sebastián Hafen unscharf',
      'Vanessa surft an Nordspanien-Strand, B-ML I 880 wartet am Parkplatz',
      'Drohne Orbit: Baskenland-Klippen mit B-ML I 880 oben am Rand',
      'Timelapse: Atlantik-Wellen brechen an Algarve-Felsen',
      'Vanessa am Algarve-Klippenrand, Wind, goldenes Abendlicht',
      'Macro: Portugiesische Pastéis de Nata, Zucker-Closeup, Vanessa beißt rein',
      'Low-Angle: B-ML I 880 auf portugiesischer Kopfsteinpflaster-Straße',
      'Split-Diopter-Look: Vanessa links, B-ML I 880 rechts, beides scharf',
      'Letzter Shot: Vanessa winkt in Kamera, Faro-Strand, B-ML I 880 im BG, Wrap!',
      'Drohne Final: B-ML I 880 fährt in Algarve-Sonnenuntergang, Pull-Back',
    ],
    vehicleSpecs: {
      grundriss: 'Integriert / Liner-Klasse',
      laenge: '789 cm',
      breite: '235 cm',
      hoehe: '298 cm',
      gewicht: '4.430 kg zGG',
      chassis: 'Mercedes-Benz Sprinter (Integriert)',
      schlafplaetze: '4–5',
      besonderheit: 'Premium-Integrierter, Hymer Connect App, riesiger Wohnraum',
      sitzplaetze: '4',
      kueche: 'Dreiflamm-Gaskocher, 142L Kühlschrank, viel Arbeitsfläche',
      bad: 'Separates Raumbad mit Dusche, WC, Waschbecken',
      heizung: 'Truma Combi 6 E',
      tankWasser: '150 L Frischwasser',
      bett: 'Hubbett vorne + Queensbett hinten (200×150 cm)',
    },
    dekoItems: [
      { id: 'dp1', text: 'Lavendel-Bündel (getrocknet + frisch vor Ort) für Provence-Vibes', emoji: '💜' },
      { id: 'dp2', text: 'Provenzalische Keramik-Schale (blau/gelb bemalt)', emoji: '🫕' },
      { id: 'dp3', text: 'Baguette + Käse-Platte Requisiten für French-Lifestyle', emoji: '🥖' },
      { id: 'dp4', text: 'Strohhut (Provence-Style, breite Krempe) für Vanessa', emoji: '👒' },
      { id: 'dp5', text: 'Pastéis-de-Nata-Form (Kupfer, dekorativ) für Portugal', emoji: '🍮' },
      { id: 'dp6', text: 'Azulejo-Fliese (einzeln, als Untersetzer/Prop) für Portugal-Shots', emoji: '🔷' },
      { id: 'dp7', text: 'Fächer (spanisch, bunt) für Spanien-Szenen', emoji: '🪭' },
      { id: 'dp8', text: 'Sangria-Karaffe (Glas) + bunte Obstdeko für Abend-Szenen', emoji: '🍹' },
    ],
  },
];

/* ─────────────────────────────────────
   MAP PIN DATA (parking & POI spots)
───────────────────────────────────── */
const MAP_DATA = {
  'toskana-0': {
    center: [43.72, 10.39], zoom: 11,
    pins: [
      { n: 'Area Sosta Camper Pisa', d: 'Offizieller WoMo-Stellplatz, 10 Min zum Turm', lat: 43.724, lon: 10.389, t: 'P' },
      { n: 'Parking Via Pietrasantina', d: 'Großer Schotterparkplatz, easy für 7m+', lat: 43.728, lon: 10.384, t: 'P' },
      { n: 'Tenuta San Rossore', d: 'Waldweg-Kulisse, morgens menschenleer', lat: 43.724, lon: 10.338, t: 'S' },
      { n: 'Viale delle Cascine', d: 'Pinien-Allee, Driving Shots mit Baumtunnel', lat: 43.722, lon: 10.362, t: 'S' },
      { n: 'Marina di Vecchiano', d: 'Strandparkplatz, Wohnmobil + Meer-Kombi', lat: 43.773, lon: 10.279, t: 'P' },
      { n: 'Camping Torre Pendente', d: 'Direkter Turm-Blick, große Stellplätze', lat: 43.726, lon: 10.386, t: 'P' },
      { n: 'SP24 Richtung Lucca', d: 'Olivenhaine, kaum Verkehr morgens', lat: 43.756, lon: 10.368, t: 'S' },
      { n: 'Calci bei Pisa', d: 'Bergdorf mit Kloster, Panorama-Parkplatz', lat: 43.727, lon: 10.518, t: 'S' },
      { n: 'Bocca d\'Arno', d: 'Flussmündung, Naturkulisse Sonnenuntergang', lat: 43.691, lon: 10.276, t: 'S' },
      { n: 'Certosa di Pisa', d: 'Monumentaler Kloster-Hintergrund, P für große Fzg.', lat: 43.729, lon: 10.521, t: 'P' },
    ],
  },
  'toskana-1': {
    center: [43.15, 11.58], zoom: 11,
    pins: [
      { n: 'SP438 Abzweig Baccoleno', d: 'Schotterweg-Einfahrt, Platz zum Rangieren', lat: 43.193, lon: 11.555, t: 'P' },
      { n: 'Asciano Ortsparkplatz', d: 'Sicher parken, 15 Min Drohne zum Spot', lat: 43.233, lon: 11.560, t: 'P' },
      { n: 'Strada Provinciale Lauretana', d: 'Hügelstraße, epische Kurven für Fahraufnahmen', lat: 43.230, lon: 11.530, t: 'S' },
      { n: 'Crete Senesi SP451', d: 'Weite Hügellandschaft, kein Zaun', lat: 43.210, lon: 11.500, t: 'S' },
      { n: 'Monte Oliveto Maggiore', d: 'Kloster-Setting, große Stellfläche', lat: 43.174, lon: 11.545, t: 'P' },
      { n: 'San Giovanni d\'Asso', d: 'Mittelalterliches Dorf, ruhiger Platz', lat: 43.162, lon: 11.588, t: 'P' },
      { n: 'Bagno Vignoni', d: 'Heißes Quellbecken als Kulisse, P 200m', lat: 43.049, lon: 11.623, t: 'S' },
      { n: 'Strada Bianca Pienza', d: 'Weiße Schotterstraße, Staubwolken-Shots', lat: 43.076, lon: 11.683, t: 'S' },
      { n: 'Podere Belvedere', d: 'Instagram-Famous Haus mit Zypressen', lat: 43.079, lon: 11.663, t: 'S' },
      { n: 'SP146 Pienza–Montepulciano', d: 'Panoramastraße, Parkbuchten', lat: 43.077, lon: 11.725, t: 'S' },
    ],
  },
  'irland-0': {
    center: [50.97, 1.50], zoom: 9,
    pins: [
      { n: 'Coquelles Terminal P1', d: 'Terminal-Parkplatz, große Flächen', lat: 50.929, lon: 1.821, t: 'P' },
      { n: 'Espace Boulonnais', d: 'Stellfläche nahe Calais', lat: 50.912, lon: 1.818, t: 'P' },
      { n: 'White Cliffs Dover', d: 'Visitor Car Park, Klippen-Panorama', lat: 51.133, lon: 1.350, t: 'S' },
      { n: 'Cap Blanc-Nez', d: 'Aussichtspunkt, Parkplatz oben', lat: 50.932, lon: 1.716, t: 'S' },
      { n: 'Folkestone Service', d: 'Service Station am UK-Ausgang', lat: 51.099, lon: 1.164, t: 'P' },
      { n: 'Auchan Calais', d: 'Supermarkt-Parkplatz, Versorgung', lat: 50.947, lon: 1.864, t: 'P' },
      { n: 'Zone Marcel Doret', d: 'Industriezone, freie Fläche', lat: 50.938, lon: 1.828, t: 'P' },
      { n: 'Plage de Sangatte', d: 'Strand mit Tunnel-Blick', lat: 50.945, lon: 1.759, t: 'S' },
      { n: 'Channel Tunnel UK', d: 'UK Arrival Area', lat: 51.096, lon: 1.138, t: 'P' },
      { n: 'Samphire Hoe', d: 'Naturschutzgebiet am Tunnel-Ausgang', lat: 51.102, lon: 1.271, t: 'S' },
    ],
  },
  'irland-1': {
    center: [52.10, -5.60], zoom: 8,
    pins: [
      { n: 'Fishguard Harbour P', d: 'Car Park direkt am Terminal', lat: 51.993, lon: -4.976, t: 'P' },
      { n: 'Goodwick Ocean Lab', d: 'Parking mit Meerblick', lat: 51.995, lon: -4.986, t: 'P' },
      { n: 'Rosslare Europort P', d: 'Terminal Parking, großzügig', lat: 52.252, lon: -6.338, t: 'P' },
      { n: 'Strumble Head', d: 'Leuchtturm-Aussicht, P oben', lat: 51.999, lon: -5.072, t: 'S' },
      { n: 'Fishguard Lower Town', d: 'Historischer Hafen, Kulisse', lat: 51.999, lon: -4.976, t: 'S' },
      { n: 'Newport Pembs. P', d: 'Küstenort, Parkplatz', lat: 52.019, lon: -4.843, t: 'P' },
      { n: 'Abercastle Harbour', d: 'Kleiner Naturhafen', lat: 51.953, lon: -5.118, t: 'S' },
      { n: 'Marine Walk Fishguard', d: 'Küstenpfad, fotogen', lat: 51.995, lon: -4.978, t: 'S' },
      { n: 'Carregwastad Point', d: 'Historischer Landungspunkt', lat: 51.988, lon: -5.059, t: 'S' },
      { n: 'Rosslare Strand Beach', d: 'Erster Strand in Irland', lat: 52.264, lon: -6.379, t: 'P' },
    ],
  },
  'schweiz-0': {
    center: [46.03, 7.76], zoom: 13,
    pins: [
      { n: 'Täsch Terminal Parkhaus', d: 'Matterhorn Terminal, Shuttle nach Zermatt', lat: 46.070, lon: 7.781, t: 'P' },
      { n: 'Matterhorn Terminal P2', d: 'Überdacht, sicher, 24/7', lat: 46.068, lon: 7.780, t: 'P' },
      { n: 'Riffelalp Station', d: 'Panorama-Aussicht Matterhorn', lat: 46.003, lon: 7.733, t: 'S' },
      { n: 'Gornergrat', d: 'Höchste Bergbahn, 360° Alpenpanorama', lat: 45.983, lon: 7.785, t: 'S' },
      { n: 'Stellplatz Täsch Vispa', d: 'Am Fluss, ruhig, günstig', lat: 46.073, lon: 7.778, t: 'P' },
      { n: 'Kirchbrücke Zermatt', d: 'Ikonische Brücke mit Matterhorn-Blick', lat: 46.021, lon: 7.749, t: 'S' },
      { n: 'Schluhmatte Zermatt', d: 'Freifläche im Dorf', lat: 46.020, lon: 7.741, t: 'P' },
      { n: 'Sunnegga Talstation', d: 'Bergbahn, Matterhorn-Blick', lat: 46.020, lon: 7.752, t: 'S' },
      { n: 'Furi Gondel', d: 'Zwischenstation, Wanderwege', lat: 46.002, lon: 7.741, t: 'S' },
      { n: 'Trift Hängebrücke', d: 'Spektakuläre Brücke über Schlucht', lat: 45.998, lon: 7.738, t: 'S' },
    ],
  },
  'schweiz-1': {
    center: [46.62, 8.40], zoom: 11,
    pins: [
      { n: 'Furkapass Passhöhe', d: '2.436m, großer Schotterplatz oben', lat: 46.573, lon: 8.415, t: 'P' },
      { n: 'Hotel Belvédère', d: 'Rhonegletscher-Blick, P an der Straße', lat: 46.583, lon: 8.360, t: 'P' },
      { n: 'James-Bond-Straße', d: 'Goldfinger-Serpentinen, Drohne Pflicht', lat: 46.580, lon: 8.390, t: 'S' },
      { n: 'Grimsel Passhöhe', d: 'Stausee, WoMo-Parkplatz am See', lat: 46.572, lon: 8.333, t: 'P' },
      { n: 'Gelmerbahn Talstation', d: 'Steilste Standseilbahn Europas', lat: 46.606, lon: 8.350, t: 'S' },
      { n: 'Sustenpass Parkplatz', d: 'Passhöhe mit Bergpanorama', lat: 46.729, lon: 8.448, t: 'P' },
      { n: 'Steingletscher Hotel', d: 'Gletscher-Blick, großer P', lat: 46.734, lon: 8.425, t: 'P' },
      { n: 'Räterichsbodensee', d: 'Türkiser Bergsee, fotogen', lat: 46.599, lon: 8.341, t: 'S' },
      { n: 'Furka Dampfbahn Realp', d: 'Historische Dampflok, nostalgisch', lat: 46.599, lon: 8.506, t: 'S' },
      { n: 'Totensee Grimsel', d: 'Bergsee an der Passhöhe', lat: 46.570, lon: 8.340, t: 'S' },
    ],
  },
  'provence-0': {
    center: [43.84, 5.98], zoom: 10,
    pins: [
      { n: 'D6 Valensole', d: 'Lavendelfeld-Straße, Parkbuchten am Feld', lat: 43.840, lon: 5.960, t: 'P' },
      { n: 'Puimoisson', d: 'Weniger touristisch, riesige Felder', lat: 43.875, lon: 6.085, t: 'S' },
      { n: 'Aire Camping-Cars Valensole', d: 'Offizieller WoMo-Platz im Ort', lat: 43.837, lon: 5.983, t: 'P' },
      { n: 'Moustiers-Sainte-Marie', d: 'Schönstes Dorf, P am Ortsrand', lat: 43.846, lon: 6.222, t: 'S' },
      { n: 'Lac de Sainte-Croix', d: 'Türkiser See, Strandparkplatz', lat: 43.770, lon: 6.175, t: 'P' },
      { n: 'Gorges du Verdon', d: 'Schlucht-Panorama, Aussichtspunkt', lat: 43.755, lon: 6.246, t: 'S' },
      { n: 'Route de Manosque', d: 'Felder beidseitig der Straße', lat: 43.834, lon: 5.960, t: 'S' },
      { n: 'Riez Parking', d: 'Historischer Ort, Parkplatz Allées', lat: 43.818, lon: 6.092, t: 'P' },
      { n: 'Plateau de Valensole D56', d: 'Weite Lavendelfelder, Panorama', lat: 43.850, lon: 5.930, t: 'S' },
      { n: 'Manosque Altstadt', d: 'L\'Occitane Heimat, Marktplatz', lat: 43.830, lon: 5.785, t: 'S' },
    ],
  },
  'provence-1': {
    center: [43.38, -2.40], zoom: 9,
    pins: [
      { n: 'San Juan de Gaztelugatxe', d: 'Game-of-Thrones-Insel, WoMo P2', lat: 43.445, lon: -2.783, t: 'P' },
      { n: 'Playa de Laga', d: 'Surfstrand, großer Schotterparkplatz', lat: 43.406, lon: -2.663, t: 'P' },
      { n: 'Mundaka Hafen', d: 'Berühmte Linkswelle, P am Kai', lat: 43.403, lon: -2.698, t: 'S' },
      { n: 'Getaria Hafen', d: 'Fischerdorf, Pintxos, Hafen-P', lat: 43.303, lon: -2.203, t: 'P' },
      { n: 'Flysch Zumaia', d: 'Dramatische Felsschichten, P am Strand', lat: 43.295, lon: -2.254, t: 'S' },
      { n: 'San Sebastián Strand', d: 'Playa de la Concha, legendär', lat: 43.321, lon: -1.984, t: 'S' },
      { n: 'Monte Igueldo', d: 'Panoramablick, Parkplatz oben', lat: 43.320, lon: -1.998, t: 'P' },
      { n: 'Bermeo Alter Hafen', d: 'Buntes Fischerdorf, fotogen', lat: 43.422, lon: -2.723, t: 'S' },
      { n: 'Sopelana Surf Beach', d: 'Klippenstrand, großer P', lat: 43.382, lon: -2.988, t: 'P' },
      { n: 'Hondarribia', d: 'Altstadt an der Grenze, charmant', lat: 43.370, lon: -1.794, t: 'S' },
    ],
  },
  'provence-2': {
    center: [37.09, -8.50], zoom: 10,
    pins: [
      { n: 'Praia da Marinha', d: 'Ikonische Klippen, großer Erdparkplatz', lat: 37.090, lon: -8.411, t: 'P' },
      { n: 'Ponta da Piedade', d: 'Felsformationen Lagos, WoMo-P 300m', lat: 37.079, lon: -8.668, t: 'P' },
      { n: 'Praia do Camilo', d: 'Treppen zum Strand, P oben', lat: 37.081, lon: -8.670, t: 'P' },
      { n: 'Cabo de São Vicente', d: 'Westlichster Punkt Europas, Leuchtturm', lat: 37.023, lon: -8.999, t: 'S' },
      { n: 'Praia da Falésia', d: 'Endlose Klippen, P oben am Rand', lat: 37.082, lon: -8.152, t: 'P' },
      { n: 'Benagil Sea Cave', d: 'Berühmte Höhle, Zugang per Boot/Kajak', lat: 37.088, lon: -8.427, t: 'S' },
      { n: 'Algar Seco Carvoeiro', d: 'Felsformation, Boardwalk', lat: 37.094, lon: -8.453, t: 'S' },
      { n: 'Ria Formosa Faro', d: 'Naturpark, Lagunenlandschaft', lat: 36.980, lon: -7.935, t: 'S' },
      { n: 'Sagres Fortaleza', d: 'Festung am Klippenrand, großer P', lat: 37.001, lon: -8.948, t: 'P' },
      { n: 'Silves Burg', d: 'Maurische Burg, Parkplatz unten', lat: 37.189, lon: -8.439, t: 'S' },
    ],
  },
};

/* ─────────────────────────────────────
   SPOT MAP COMPONENT (Leaflet)
───────────────────────────────────── */
function SpotMap({ tripId, spotIndex }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const data = MAP_DATA[`${tripId}-${spotIndex}`];

  useEffect(() => {
    if (!data || !containerRef.current || mapRef.current) return;
    if (typeof window === 'undefined' || !window.L) return;

    const L = window.L;
    const map = L.map(containerRef.current, {
      center: data.center,
      zoom: data.zoom,
      zoomControl: false,
      attributionControl: false,
    });
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 18,
    }).addTo(map);

    const parkingIcon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;border-radius:50%;background:#A0845C;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🅿️</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const spotIcon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;border-radius:50%;background:#E8734A;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">📍</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    data.pins.forEach((pin) => {
      const icon = pin.t === 'P' ? parkingIcon : spotIcon;
      L.marker([pin.lat, pin.lon], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;min-width:160px;">` +
          `<strong style="font-size:13px;">${pin.t === 'P' ? '🅿️' : '📍'} ${pin.n}</strong>` +
          `<br/><span style="font-size:12px;color:#666;">${pin.d}</span>` +
          `<br/><a href="https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lon}" target="_blank" rel="noopener" style="font-size:11px;color:#A0845C;font-weight:600;text-decoration:none;">→ Google Maps</a>` +
          `</div>`,
          { closeButton: false, maxWidth: 220 }
        );
    });

    mapRef.current = map;

    // Fix tile loading after reveal
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [data]);

  if (!data) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#A0845C' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#A0845C', display: 'inline-block', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} /> Parkplatz
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#E8734A' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#E8734A', display: 'inline-block', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} /> Shot-Spot / POI
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 280,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(160,132,92,0.2)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   BASIC SHOTS (same for every trip)
───────────────────────────────────── */
const BASIC_SHOTS = [
  { id: 'b1', category: 'Drohne', text: 'Ganzes Fahrzeug während Fahrt – Tracking Shot' },
  { id: 'b2', category: 'Drohne', text: 'Top-Down auf Fahrzeug von oben' },
  { id: 'b3', category: 'Drohne', text: 'Reveal-Shot: Landschaft → Fahrzeug kommt ins Bild' },
  { id: 'b4', category: 'Drohne', text: 'Orbit um stehendes Fahrzeug, 360°' },
  { id: 'b5', category: 'Gimbal', text: 'Front-Schwenk: Von Motorhaube hoch zum Panorama' },
  { id: 'b6', category: 'Gimbal', text: 'Seitenansicht: Langsamer Walk vorbei' },
  { id: 'b7', category: 'Gimbal', text: 'Heck-Schwenk: Detail auf Heckpartie' },
  { id: 'b8', category: 'Gimbal', text: '360° Walkaround komplett ums Fahrzeug' },
  { id: 'b9', category: 'Interior', text: 'Ein-Take Durchlauf durch den kompletten Innenraum' },
  { id: 'b10', category: 'Interior', text: 'Küche: Arbeitsfläche, Herd, Kühlschrank' },
  { id: 'b11', category: 'Interior', text: 'Schlafbereich: Bett, Stauraum, Ambiente' },
  { id: 'b12', category: 'Interior', text: 'Bad: Dusche, Waschbecken, Details' },
  { id: 'b13', category: 'Interior', text: 'Sitzgruppe: Tisch, Polster, Licht' },
  { id: 'b14', category: 'Interior', text: 'Cockpit: Lenkrad, Displays, Fahrerperspektive' },
  { id: 'b15', category: 'Detail', text: 'Logo-Closeup am Fahrzeug' },
  { id: 'b16', category: 'Detail', text: 'Felgen & Reifen Macro-Shot' },
];

const CATEGORIES = ['Alle', 'Drohne', 'Gimbal', 'Interior', 'Detail'];

/* ─────────────────────────────────────
   PACKLISTE – Kamera Essentials (universal)
───────────────────────────────────── */
const KAMERA_ESSENTIALS = [
  { id: 'ke1', text: 'ND-Filter Set für Drohne & Kamera (Goldene-Stunde-Look)', emoji: '🔲' },
  { id: 'ke2', text: 'RGB-LED Panel klein (Akzentlicht für Interior bei Nacht)', emoji: '💡' },
  { id: 'ke3', text: 'Reflector / Bouncer 5-in-1 (Gold/Silber für Portraits)', emoji: '🪩' },
  { id: 'ke4', text: 'Prismen-Set (Regenbogen-Effekte, kreative Flares)', emoji: '🔮' },
  { id: 'ke5', text: 'Bluetooth-Speaker mini (Stimmungsmusik für Dreh-Energie)', emoji: '🔊' },
  { id: 'ke6', text: 'Rauchbomben / Haze-Spray (für mystische Wald-/Morgen-Shots)', emoji: '💨' },
  { id: 'ke7', text: 'Stativ (leicht, Reise) + Kugelkopf', emoji: '📐' },
  { id: 'ke8', text: 'Ersatzakkus (Kamera + Drohne) + Ladegerät', emoji: '🔋' },
  { id: 'ke9', text: 'Speicherkarten (3× 128GB) + Kartenleser', emoji: '💾' },
  { id: 'ke10', text: 'Mikrofon (Rode Wireless Go) für O-Töne & Vlogs', emoji: '🎙️' },
  { id: 'ke11', text: 'Gimbal (DJI RS / Zhiyun) aufgeladen + kalibriert', emoji: '🎥' },
  { id: 'ke12', text: 'Drohne (Akkus, Propeller, Fernbedienung, ND-Filter)', emoji: '🚁' },
  { id: 'ke13', text: 'Lens Cleaning Kit (Tücher, Blasebalg, Stift)', emoji: '🧹' },
  { id: 'ke14', text: 'GoPro / Action Cam + Halterungen (Saugnapf, Chest)', emoji: '📹' },
];

/* Universal Props & Styling (same for every trip) */
const UNIVERSAL_ITEMS = [
  { id: 'u1', text: 'Dekodecke / Throw Blanket fürs Bett (beige/creme, texturiert)', emoji: '🛏️' },
  { id: 'u2', text: 'Lichterkette warmweiß (USB, 3m) für Abend-Ambient-Shots', emoji: '✨' },
  { id: 'u3', text: 'Kerzen (LED-Stumpenkerzen, flackern realistisch)', emoji: '🕯️' },
  { id: 'u4', text: 'Kissen-Set (2-3 Stk, Boho-Look, für Sitzgruppe & Bett)', emoji: '🛋️' },
  { id: 'u5', text: 'Trockenblumen-Bund (Pampasgras) für Vase im WoMo-Interior', emoji: '🌾' },
  { id: 'u6', text: 'Emaille-Becher (2 Stk, für Kaffee- & Tee-Szenen)', emoji: '☕' },
  { id: 'u7', text: 'Picknickdecke (für Outdoor-Szenen neben dem WoMo)', emoji: '🧺' },
  { id: 'u8', text: 'Campingstuhl-Set (faltbar, mit Style – nicht Aldi)', emoji: '🪑' },
  { id: 'u9', text: 'Retro-Kamera (Analog / Fuji Instax) als B-Roll Prop', emoji: '📷' },
  { id: 'u10', text: 'Reisetagebuch / Moleskin mit Stift (schreib-Szenen)', emoji: '📓' },
  { id: 'u11', text: 'Vanessa Outfit Set 1: Lässig-cozy (Oversize-Strick + Jeans)', emoji: '👗' },
  { id: 'u12', text: 'Vanessa Outfit Set 2: Outdoor-Adventure (Regenjacke, Boots)', emoji: '🧥' },
  { id: 'u13', text: 'Vanessa Outfit Set 3: Sommerlich-leicht (Kleid, Sandalen)', emoji: '👒' },
  { id: 'u14', text: 'Sonnenbrille (2-3 Modelle, verschiedene Looks)', emoji: '🕶️' },
  { id: 'u15', text: 'Weinflasche + 2 Gläser (Abendszenen, Genuss-Moments)', emoji: '🍷' },
  { id: 'u16', text: 'Holz-Schneidebrett & Leinentuch für Food-Shots', emoji: '🪵' },
];

/* ─────────────────────────────────────
   WEATHER CODES → Labels & Icons
───────────────────────────────────── */
const WEATHER_MAP = {
  0: { label: 'Klar', icon: '☀️' },
  1: { label: 'Überwiegend klar', icon: '🌤️' },
  2: { label: 'Teilweise bewölkt', icon: '⛅' },
  3: { label: 'Bewölkt', icon: '☁️' },
  45: { label: 'Nebel', icon: '🌫️' },
  48: { label: 'Reifnebel', icon: '🌫️' },
  51: { label: 'Leichter Niesel', icon: '🌦️' },
  53: { label: 'Nieselregen', icon: '🌦️' },
  55: { label: 'Starker Niesel', icon: '🌧️' },
  61: { label: 'Leichter Regen', icon: '🌦️' },
  63: { label: 'Regen', icon: '🌧️' },
  65: { label: 'Starkregen', icon: '🌧️' },
  71: { label: 'Leichter Schnee', icon: '🌨️' },
  73: { label: 'Schnee', icon: '🌨️' },
  75: { label: 'Starker Schnee', icon: '❄️' },
  80: { label: 'Leichte Schauer', icon: '🌦️' },
  81: { label: 'Schauer', icon: '🌧️' },
  82: { label: 'Starke Schauer', icon: '⛈️' },
  95: { label: 'Gewitter', icon: '⛈️' },
  96: { label: 'Gewitter + Hagel', icon: '⛈️' },
  99: { label: 'Starkes Gewitter', icon: '⛈️' },
};

function getWeather(code) {
  return WEATHER_MAP[code] || { label: 'Unbekannt', icon: '❓' };
}

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const C = {
  bg: '#FAF6F0',
  bgGlass: 'rgba(255,252,248,0.72)',
  card: 'rgba(255,252,248,0.6)',
  cardSolid: '#FFFCF8',
  accent: '#A0845C',
  accentLight: '#C4A97D',
  accentBg: 'rgba(160,132,92,0.08)',
  text: '#3D3425',
  textMuted: '#8C7E6A',
  textLight: '#B5A898',
  border: 'rgba(160,132,92,0.12)',
  borderStrong: 'rgba(160,132,92,0.2)',
  success: '#6B9E5B',
  danger: '#C0392B',
  white: '#fff',
};

const baseStyles = {
  app: {
    minHeight: '100vh',
    background: `linear-gradient(175deg, ${C.bg} 0%, #F5EDE3 50%, #EDE4D8 100%)`,
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    color: C.text,
    maxWidth: 520,
    margin: '0 auto',
    position: 'relative',
    paddingBottom: 90,
    WebkitFontSmoothing: 'antialiased',
  },
  serif: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
  glass: {
    background: C.bgGlass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${C.border}`,
  },
  card: {
    background: C.card,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 20,
    border: `1px solid ${C.border}`,
    padding: '18px 20px',
    marginBottom: 14,
    transition: 'all 0.3s ease',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 16px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 500,
    background: C.accentBg,
    color: C.accent,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  pillActive: {
    background: C.accent,
    color: C.white,
    boxShadow: '0 2px 12px rgba(160,132,92,0.3)',
  },
  sectionTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: 26,
    fontWeight: 600,
    color: C.text,
    margin: '32px 0 16px 0',
    letterSpacing: '-0.01em',
  },
  checkbox: (checked) => ({
    width: 22,
    height: 22,
    borderRadius: 7,
    border: `2px solid ${checked ? C.accent : C.borderStrong}`,
    background: checked ? C.accent : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  }),
};

/* ─────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────── */
const GLOBAL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${C.bg}; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 0; height: 0; }
  input, textarea, button { font-family: inherit; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .slide-in { animation: slideIn 0.4s ease both; }
  .pulse { animation: pulse 1.5s ease infinite; }
`;

/* ─────────────────────────────────────
   COMPONENTS
───────────────────────────────────── */

/* Vehicle image with runtime white-background removal */
function TransparentVehicle({ src, alt, style = {} }) {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    // Route through Netlify proxy to avoid CORS
    const proxiedSrc = src.startsWith('https://www.hymer.com/')
      ? src.replace('https://www.hymer.com/', '/proxy/hymer/')
      : src;

    const img = new Image();
    // Only set crossOrigin if not same-origin (proxy handles same-origin)
    if (!proxiedSrc.startsWith('/')) img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Draw at natural size first
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      const octx = offscreen.getContext('2d');
      octx.drawImage(img, 0, 0);

      const imageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
      const d = imageData.data;

      // Remove white / near-white pixels
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        // Pure white area → fully transparent
        if (r > 245 && g > 245 && b > 245) {
          d[i + 3] = 0;
        }
        // Near-white → fade (smooth anti-alias edge)
        else if (r > 215 && g > 215 && b > 215) {
          const luminance = (r + g + b) / 3;
          const alpha = Math.max(0, Math.min(255, (255 - luminance) * 5));
          d[i + 3] = Math.min(d[i + 3], alpha);
        }
        // Very light grey near edges → partial transparency
        else if (r > 200 && g > 200 && b > 200) {
          const luminance = (r + g + b) / 3;
          const alpha = Math.max(0, Math.min(255, (255 - luminance) * 3));
          d[i + 3] = Math.min(d[i + 3], Math.max(alpha, 120));
        }
      }

      octx.putImageData(imageData, 0, 0);

      // Crop to content bounds
      let minX = offscreen.width, minY = offscreen.height, maxX = 0, maxY = 0;
      for (let y = 0; y < offscreen.height; y++) {
        for (let x = 0; x < offscreen.width; x++) {
          const idx = (y * offscreen.width + x) * 4;
          if (d[idx + 3] > 10) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      const pad = 2;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(offscreen.width - 1, maxX + pad);
      maxY = Math.min(offscreen.height - 1, maxY + pad);

      const cw = maxX - minX + 1;
      const ch = maxY - minY + 1;

      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      ctx.putImageData(octx.getImageData(minX, minY, cw, ch), 0, 0);
      setLoaded(true);
    };
    img.onerror = () => setLoaded(false);
    img.src = proxiedSrc;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      alt={alt}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
        imageRendering: 'auto',
      }}
    />
  );
}

function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
      <div style={{
        flex: 1, height: 6, borderRadius: 3,
        background: C.borderStrong, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 3,
          background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, minWidth: 48, textAlign: 'right' }}>
        {done}/{total}
      </span>
    </div>
  );
}

function Chip({ children, style }) {
  return (
    <span style={{
      ...baseStyles.pill,
      padding: '5px 12px',
      fontSize: 12,
      cursor: 'default',
      ...style,
    }}>
      {children}
    </span>
  );
}

function CheckItem({ checked, text, onToggle, style }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 0',
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        opacity: checked ? 0.55 : 1,
        ...style,
      }}
    >
      <div style={baseStyles.checkbox(checked)}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{
        fontSize: 14, lineHeight: 1.5, flex: 1,
        textDecoration: checked ? 'line-through' : 'none',
        color: checked ? C.textMuted : C.text,
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────
   BOTTOM SHEET
───────────────────────────────────── */
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(61,52,37,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'relative',
        background: C.cardSolid,
        borderRadius: '24px 24px 0 0',
        padding: '12px 24px 32px',
        maxHeight: '75vh',
        overflowY: 'auto',
        animation: 'fadeUp 0.3s ease',
        maxWidth: 520,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: C.borderStrong,
          margin: '0 auto 16px',
        }} />
        {title && (
          <h3 style={{ ...baseStyles.serif, fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN APP
───────────────────────────────────── */
export default function App() {
  // Inject global CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Helper: read from localStorage safely
  const lsGet = (key, fallback = '{}') => {
    try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
  };

  // State
  const [activeTrip, setActiveTrip] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [basicChecked, setBasicChecked] = useState(() => lsGet('htp_basic'));
  const [creativeChecked, setCreativeChecked] = useState(() => lsGet('htp_creative'));
  const [customShots, setCustomShots] = useState(() => lsGet('htp_custom'));
  const [shotFilter, setShotFilter] = useState('Alle');
  const [expandedSpot, setExpandedSpot] = useState(null);
  const [packlistChecked, setPacklistChecked] = useState(() => lsGet('htp_packlist'));
  const [packFilter, setPackFilter] = useState('Alle');
  const [weatherData, setWeatherData] = useState({});
  const [weatherSheet, setWeatherSheet] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiSelected, setAiSelected] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(() => lsGet('htp_images'));
  const [expandedVehicle, setExpandedVehicle] = useState(false);
  const fileInputRef = useRef(null);
  const skipFirebaseUpdate = useRef({});

  const trip = TRIPS[activeTrip];

  // ─── Firebase Realtime Sync ───
  // Subscribe to Firebase and sync data bidirectionally
  useEffect(() => {
    if (!firebaseReady) return;
    const unsubs = [];
    const fields = [
      { path: 'basicChecked', setter: setBasicChecked, ref: 'basic' },
      { path: 'creativeChecked', setter: setCreativeChecked, ref: 'creative' },
      { path: 'customShots', setter: setCustomShots, ref: 'custom' },
      { path: 'packlistChecked', setter: setPacklistChecked, ref: 'packlist' },
      { path: 'uploadedImages', setter: setUploadedImages, ref: 'images' },
    ];
    fields.forEach(({ path, setter, ref: refKey }) => {
      const unsub = subscribeToData(path, (val) => {
        if (val !== null && val !== undefined) {
          skipFirebaseUpdate.current[refKey] = true;
          setter(val);
        }
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u => typeof u === 'function' && u());
  }, []);

  // Persist to localStorage + Firebase
  const persist = useCallback((lsKey, fbPath, data, refKey) => {
    localStorage.setItem(lsKey, JSON.stringify(data));
    if (firebaseReady) {
      if (skipFirebaseUpdate.current[refKey]) {
        skipFirebaseUpdate.current[refKey] = false;
        return;
      }
      saveData(fbPath, data);
    }
  }, []);

  useEffect(() => { persist('htp_basic', 'basicChecked', basicChecked, 'basic'); }, [basicChecked]);
  useEffect(() => { persist('htp_creative', 'creativeChecked', creativeChecked, 'creative'); }, [creativeChecked]);
  useEffect(() => { persist('htp_custom', 'customShots', customShots, 'custom'); }, [customShots]);
  useEffect(() => { persist('htp_images', 'uploadedImages', uploadedImages, 'images'); }, [uploadedImages]);
  useEffect(() => { persist('htp_packlist', 'packlistChecked', packlistChecked, 'packlist'); }, [packlistChecked]);

  // Fetch weather
  useEffect(() => {
    trip.weatherLocations.forEach(loc => {
      const key = `${loc.name}_${trip.id}`;
      if (weatherData[key]) return;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&hourly=temperature_2m,weathercode,precipitation_probability&timezone=auto&start_date=${trip.startDate}&end_date=${trip.endDate}`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          setWeatherData(prev => ({ ...prev, [key]: data }));
        })
        .catch(() => {});
    });
  }, [trip.id]);

  // Handlers
  const toggleBasic = (shotId) => {
    const key = `${trip.id}_${shotId}`;
    setBasicChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCreative = (idx) => {
    const key = `${trip.id}_c${idx}`;
    setCreativeChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCustom = (idx) => {
    const tripCustom = customShots[trip.id] || [];
    const updated = tripCustom.map((s, i) => i === idx ? { ...s, done: !s.done } : s);
    setCustomShots(prev => ({ ...prev, [trip.id]: updated }));
  };

  const addCustomShot = (text) => {
    const tripCustom = customShots[trip.id] || [];
    setCustomShots(prev => ({
      ...prev,
      [trip.id]: [...tripCustom, { text, done: false }],
    }));
  };

  const removeCustomShot = (idx) => {
    const tripCustom = customShots[trip.id] || [];
    setCustomShots(prev => ({
      ...prev,
      [trip.id]: tripCustom.filter((_, i) => i !== idx),
    }));
  };

  const handleAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    setAiSuggestions([]);
    setAiSelected({});
    try {
      const res = await fetch('/api/ai-brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: trip.vehicle,
          vehicleType: trip.vehicleType,
          destination: trip.destination,
          userIdea: aiInput,
        }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      setAiSuggestions(['Fehler bei der AI-Anfrage. Bitte versuche es erneut.']);
    }
    setAiLoading(false);
  };

  const addSelectedToShotlist = () => {
    const selected = aiSuggestions.filter((_, i) => aiSelected[i]);
    selected.forEach(text => addCustomShot(text));
    setAiSuggestions([]);
    setAiSelected({});
    setAiInput('');
    setActiveTab('shots');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const tripImages = uploadedImages[trip.id] || [];
        setUploadedImages(prev => ({
          ...prev,
          [trip.id]: [...tripImages, ev.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx) => {
    const tripImages = uploadedImages[trip.id] || [];
    setUploadedImages(prev => ({
      ...prev,
      [trip.id]: tripImages.filter((_, i) => i !== idx),
    }));
  };

  const togglePackItem = (itemId) => {
    const key = `${trip.id}_${itemId}`;
    setPacklistChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Computed – Packliste
  const tripDekoItems = trip.dekoItems || [];
  const allPackItems = [...KAMERA_ESSENTIALS, ...UNIVERSAL_ITEMS, ...tripDekoItems];
  const packDone = allPackItems.filter(p => packlistChecked[`${trip.id}_${p.id}`]).length;

  const filteredBasics = shotFilter === 'Alle'
    ? BASIC_SHOTS
    : BASIC_SHOTS.filter(s => s.category === shotFilter);

  const basicDone = BASIC_SHOTS.filter(s => basicChecked[`${trip.id}_${s.id}`]).length;
  const creativeDone = trip.creativeShots.filter((_, i) => creativeChecked[`${trip.id}_c${i}`]).length;
  const tripCustomShots = customShots[trip.id] || [];
  const customDone = tripCustomShots.filter(s => s.done).length;
  const totalShots = BASIC_SHOTS.length + trip.creativeShots.length + tripCustomShots.length;
  const totalDone = basicDone + creativeDone + customDone;
  const tripImages = uploadedImages[trip.id] || [];

  /* ─── RENDER ─── */
  return (
    <div style={baseStyles.app}>

      {/* ── Header ── */}
      <div style={{
        ...baseStyles.glass,
        position: 'sticky', top: 0, zIndex: 100,
        padding: '16px 20px 0',
        borderRadius: 0,
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{
              ...baseStyles.serif,
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Hymer Trip Planner
            </h1>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Make Living Beautiful</p>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: C.accentBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            🎬
          </div>
        </div>

        {/* Trip Switcher */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          paddingBottom: 12, scrollSnapType: 'x mandatory',
        }}>
          {TRIPS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setActiveTrip(i); setShotFilter('Alle'); }}
              style={{
                ...baseStyles.pill,
                ...(i === activeTrip ? baseStyles.pillActive : {}),
                whiteSpace: 'nowrap',
                scrollSnapAlign: 'start',
                fontSize: 13,
                padding: '8px 16px',
              }}
            >
              {t.country} {t.destination.split('→')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div style={{ padding: '0 20px' }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="fade-up">
            {/* Hero + Vehicle Overlay */}
            <div style={{
              position: 'relative',
              marginTop: 20,
              marginBottom: trip.vehicleImg ? 40 : 0,
            }}>
              {/* Mood Image */}
              <div style={{
                borderRadius: 24, overflow: 'hidden',
                position: 'relative',
                aspectRatio: '16/10',
                boxShadow: '0 8px 32px rgba(160,132,92,0.15)',
              }}>
                <img
                  src={trip.heroImg}
                  alt={trip.destination}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '60px 20px 20px',
                  background: 'linear-gradient(transparent, rgba(61,52,37,0.8))',
                }}>
                  <h2 style={{
                    ...baseStyles.serif, color: C.white,
                    fontSize: 28, fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {trip.destination} {trip.country}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 }}>
                    {trip.vehicle}
                  </p>
                </div>
              </div>

              {/* Vehicle Image – right-aligned, overlapping hero downward, freigestellt */}
              {trip.vehicleImg && (
                <TransparentVehicle
                  src={trip.vehicleImg}
                  alt={trip.vehicle}
                  style={{
                    position: 'absolute',
                    right: -10,
                    bottom: -45,
                    height: 110,
                    filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.25))',
                    zIndex: 3,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>

            {/* Info Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              <Chip>📅 {trip.dates}</Chip>
              <Chip>🚐 {trip.vehicleType}</Chip>
              <Chip>📍 Ostfildern</Chip>
              <Chip>🛣️ {trip.km}</Chip>
              <Chip>⏱️ {trip.days} Tage</Chip>
            </div>

            {/* Route */}
            <div style={{ ...baseStyles.card, marginTop: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Route
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: C.text }}>{trip.route}</p>
            </div>

            {/* Shot Progress */}
            <div style={{ ...baseStyles.card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Shot Progress
                </p>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>
                  {totalShots > 0 ? Math.round((totalDone / totalShots) * 100) : 0}%
                </span>
              </div>
              <ProgressBar done={totalDone} total={totalShots} />
            </div>

            {/* Must-Spots */}
            <h3 style={baseStyles.sectionTitle}>Pflicht-Spots</h3>
            {trip.mustSpots.map((spot, i) => {
              const spotKey = `${trip.id}_${i}`;
              const isExpanded = expandedSpot === spotKey;
              return (
                <div key={i} style={{
                  ...baseStyles.card,
                  borderLeft: `3px solid ${C.accent}`,
                  padding: 0,
                  overflow: 'hidden',
                }} className="slide-in">
                  <div
                    onClick={() => setExpandedSpot(isExpanded ? null : spotKey)}
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>📌 {spot.name}</p>
                      <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{spot.desc}</p>
                    </div>
                    <span style={{
                      fontSize: 20, color: C.accent, fontWeight: 700,
                      transition: 'transform 0.3s ease',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      »
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{
                      padding: '0 20px 16px',
                      animation: 'fadeUp 0.3s ease both',
                    }}>
                      {/* Google Maps Button */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 16px', borderRadius: 12,
                          background: `linear-gradient(135deg, #4285F4, #34A853)`,
                          color: 'white', textDecoration: 'none',
                          fontSize: 13, fontWeight: 600,
                          marginBottom: 14,
                          boxShadow: '0 2px 8px rgba(66,133,244,0.3)',
                        }}
                      >
                        📍 In Google Maps öffnen
                      </a>

                      {/* Interactive Map with Parking & POI Pins */}
                      <p style={{
                        fontSize: 11, fontWeight: 600, color: C.accent,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        marginBottom: 4,
                      }}>
                        🗺️ Parkplätze & Shot-Spots
                      </p>
                      <SpotMap tripId={trip.id} spotIndex={i} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tagesplan */}
            <h3 style={baseStyles.sectionTitle}>Tagesplan</h3>
            {trip.schedule.map((day, i) => (
              <div key={i} style={baseStyles.card} className="slide-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    minWidth: 44, height: 44, borderRadius: 14,
                    padding: '0 10px',
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.white, fontWeight: 700, fontSize: String(day.day).length > 2 ? 11 : 14, flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}>
                    T{day.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{day.title}</p>
                    <p style={{ fontSize: 12, color: C.textMuted }}>{day.date}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5, marginTop: 10 }}>{day.desc}</p>
              </div>
            ))}

            {/* ── Fahrzeug-Kachel ── */}
            <h3 style={baseStyles.sectionTitle}>Fahrzeug</h3>
            <div style={{
              ...baseStyles.card,
              padding: 0,
              overflow: 'hidden',
              borderLeft: `3px solid ${C.accent}`,
            }}>
              <div
                onClick={() => setExpandedVehicle(prev => !prev)}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {trip.vehicleImg && (
                  <TransparentVehicle
                    src={trip.vehicleImg}
                    alt={trip.vehicle}
                    style={{
                      height: 48,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{trip.vehicle}</p>
                  <p style={{ fontSize: 12, color: C.textMuted }}>{trip.vehicleType}</p>
                </div>
                <span style={{
                  fontSize: 20, color: C.accent, fontWeight: 700,
                  transition: 'transform 0.3s ease',
                  transform: expandedVehicle ? 'rotate(90deg)' : 'rotate(0deg)',
                  flexShrink: 0,
                }}>
                  »
                </span>
              </div>

              {expandedVehicle && trip.vehicleSpecs && (
                <div style={{
                  padding: '0 20px 20px',
                  animation: 'fadeUp 0.3s ease both',
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 600, color: C.accent,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: 14,
                  }}>
                    📋 Fahrzeug-Specs für "Our Next Daily"
                  </p>

                  {[
                    { label: 'Grundriss', value: trip.vehicleSpecs.grundriss, icon: '🏗️' },
                    { label: 'Länge', value: trip.vehicleSpecs.laenge, icon: '📏' },
                    { label: 'Breite', value: trip.vehicleSpecs.breite, icon: '↔️' },
                    { label: 'Höhe', value: trip.vehicleSpecs.hoehe, icon: '↕️' },
                    { label: 'Gewicht (zGG)', value: trip.vehicleSpecs.gewicht, icon: '⚖️' },
                    { label: 'Chassis', value: trip.vehicleSpecs.chassis, icon: '🚛' },
                    { label: 'Schlafplätze', value: trip.vehicleSpecs.schlafplaetze, icon: '🛏️' },
                    { label: 'Sitzplätze', value: trip.vehicleSpecs.sitzplaetze, icon: '💺' },
                    { label: 'Küche', value: trip.vehicleSpecs.kueche, icon: '🍳' },
                    { label: 'Bad', value: trip.vehicleSpecs.bad, icon: '🚿' },
                    { label: 'Heizung', value: trip.vehicleSpecs.heizung, icon: '🔥' },
                    { label: 'Frischwasser', value: trip.vehicleSpecs.tankWasser, icon: '💧' },
                    { label: 'Bett', value: trip.vehicleSpecs.bett, icon: '🛌' },
                    { label: 'Besonderheit', value: trip.vehicleSpecs.besonderheit, icon: '⭐' },
                  ].map((spec, si) => (
                    <div key={si} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 0',
                      borderBottom: si < 13 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>
                        {spec.icon}
                      </span>
                      <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}

                  <a
                    href={`https://www.hymer.com/de/de/reisemobile`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 16px', borderRadius: 12,
                      background: C.accentBg,
                      color: C.accent, textDecoration: 'none',
                      fontSize: 13, fontWeight: 600,
                      marginTop: 16,
                    }}
                  >
                    🌐 Mehr auf hymer.com
                  </a>
                </div>
              )}
            </div>

            {/* Firebase Sync Status */}
            <div style={{
              textAlign: 'center', padding: '16px 0 8px',
              fontSize: 11, color: C.textLight,
            }}>
              {firebaseReady ? '🟢 Echtzeit-Sync aktiv' : '💾 Lokaler Speicher (Firebase nicht konfiguriert)'}
            </div>
          </div>
        )}

        {/* ── SHOTS TAB ── */}
        {activeTab === 'shots' && (
          <div className="fade-up">
            <h3 style={{ ...baseStyles.sectionTitle, marginTop: 20 }}>Shotliste</h3>

            {/* Overall Progress */}
            <div style={baseStyles.card}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Gesamt-Fortschritt
              </p>
              <ProgressBar done={totalDone} total={totalShots} />
            </div>

            {/* Basics */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '20px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📋 Basics
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>
                (bei jedem Trip gleich)
              </span>
            </h4>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setShotFilter(cat)}
                  style={{
                    ...baseStyles.pill,
                    ...(shotFilter === cat ? baseStyles.pillActive : {}),
                    padding: '6px 14px',
                    fontSize: 12,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={baseStyles.card}>
              <ProgressBar done={basicDone} total={BASIC_SHOTS.length} />
              {filteredBasics.map(shot => (
                <CheckItem
                  key={shot.id}
                  checked={!!basicChecked[`${trip.id}_${shot.id}`]}
                  text={`${shot.category} — ${shot.text}`}
                  onToggle={() => toggleBasic(shot.id)}
                />
              ))}
            </div>

            {/* Creative Shots */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              ✨ Creative Shots
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>
                ({trip.creativeShots.length} Shots)
              </span>
            </h4>
            <div style={baseStyles.card}>
              <ProgressBar done={creativeDone} total={trip.creativeShots.length} />
              {trip.creativeShots.map((shot, i) => (
                <CheckItem
                  key={i}
                  checked={!!creativeChecked[`${trip.id}_c${i}`]}
                  text={shot}
                  onToggle={() => toggleCreative(i)}
                />
              ))}
            </div>

            {/* Custom / AI Shots */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              🤖 Eigene & AI Shots
              {tripCustomShots.length > 0 && (
                <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>
                  ({tripCustomShots.length})
                </span>
              )}
            </h4>
            <div style={baseStyles.card}>
              {tripCustomShots.length === 0 ? (
                <p style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', padding: '16px 0' }}>
                  Noch keine eigenen Shots. Nutze den AI Tab oder füge manuell hinzu.
                </p>
              ) : (
                <>
                  <ProgressBar done={customDone} total={tripCustomShots.length} />
                  {tripCustomShots.map((shot, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <CheckItem
                          checked={shot.done}
                          text={shot.text}
                          onToggle={() => toggleCustom(i)}
                          style={{ borderBottom: 'none', padding: '8px 0' }}
                        />
                      </div>
                      <button
                        onClick={() => removeCustomShot(i)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: C.textLight, fontSize: 16, padding: '10px 4px',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.color = C.danger}
                        onMouseLeave={e => e.target.style.color = C.textLight}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Manual Add */}
              <div style={{
                display: 'flex', gap: 8, marginTop: 12, paddingTop: 12,
                borderTop: `1px solid ${C.border}`,
              }}>
                <input
                  id="manualShotInput"
                  placeholder="Shot manuell hinzufügen..."
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 12,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg, fontSize: 13, color: C.text,
                    outline: 'none',
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addCustomShot(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('manualShotInput');
                    if (input.value.trim()) {
                      addCustomShot(input.value.trim());
                      input.value = '';
                    }
                  }}
                  style={{
                    ...baseStyles.pill,
                    ...baseStyles.pillActive,
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📸 Shot-Inspiration
            </h4>
            <div style={baseStyles.card}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${C.borderStrong}`,
                  borderRadius: 16, padding: '24px 16px',
                  textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: C.accentBg,
                }}
              >
                <p style={{ fontSize: 24, marginBottom: 8 }}>📷</p>
                <p style={{ fontSize: 13, color: C.textMuted }}>
                  Referenzbilder hochladen
                </p>
                <p style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>
                  JPG, PNG – als visuelle Shot-Ideen
                </p>
              </div>

              {tripImages.length > 0 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8, marginTop: 16,
                }}>
                  {tripImages.map((img, i) => (
                    <div key={i} style={{
                      position: 'relative', borderRadius: 12,
                      overflow: 'hidden', aspectRatio: '1',
                    }}>
                      <img src={img} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 22, height: 22, borderRadius: 11,
                          background: 'rgba(0,0,0,0.5)',
                          color: 'white', border: 'none',
                          fontSize: 13, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WEATHER TAB ── */}
        {activeTab === 'weather' && (
          <div className="fade-up">
            <h3 style={{ ...baseStyles.sectionTitle, marginTop: 20 }}>Wetter-Forecast</h3>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
              {trip.dates} · Tippe auf einen Tag für stündliche Details
            </p>

            {trip.weatherLocations.map(loc => {
              const key = `${loc.name}_${trip.id}`;
              const data = weatherData[key];

              return (
                <div key={key} style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📍 {loc.name}
                  </h4>

                  {!data ? (
                    <div style={{ ...baseStyles.card, textAlign: 'center' }}>
                      <p className="pulse" style={{ color: C.textMuted, fontSize: 13 }}>
                        Wetterdaten laden...
                      </p>
                    </div>
                  ) : data.daily ? (
                    data.daily.time.map((date, dayIdx) => {
                      const w = getWeather(data.daily.weathercode[dayIdx]);
                      const max = Math.round(data.daily.temperature_2m_max[dayIdx]);
                      const min = Math.round(data.daily.temperature_2m_min[dayIdx]);
                      const rain = data.daily.precipitation_probability_max[dayIdx];
                      const dateStr = new Date(date).toLocaleDateString('de-DE', {
                        weekday: 'short', day: '2-digit', month: '2-digit',
                      });

                      return (
                        <div
                          key={dayIdx}
                          onClick={() => setWeatherSheet({ locationKey: key, dayIdx, locName: loc.name, date: dateStr })}
                          style={{
                            ...baseStyles.card,
                            display: 'flex', alignItems: 'center', gap: 14,
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: 32 }}>{w.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{dateStr}</p>
                            <p style={{ fontSize: 12, color: C.textMuted }}>{w.label}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>
                              {max}° <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 13 }}>/ {min}°</span>
                            </p>
                            {rain > 0 && (
                              <p style={{ fontSize: 11, color: C.textMuted }}>
                                💧 {rain}%
                              </p>
                            )}
                          </div>
                          <span style={{ color: C.textLight, fontSize: 18 }}>›</span>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ ...baseStyles.card, textAlign: 'center' }}>
                      <p style={{ color: C.textMuted, fontSize: 13 }}>
                        Keine Wetterdaten verfügbar (Zeitraum ggf. zu weit in der Zukunft)
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── AI TAB ── */}
        {activeTab === 'ai' && (
          <div className="fade-up">
            <h3 style={{ ...baseStyles.sectionTitle, marginTop: 20 }}>AI Shot-Brainstorming</h3>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
              Beschreibe deine Idee und Claude generiert 6 kreative Shot-Vorschläge
              für {trip.vehicle} in {trip.destination}.
            </p>

            <div style={baseStyles.card}>
              <textarea
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder={`z.B. "Vanessa am Strand bei Sonnenuntergang" oder "krasse Motor-Details"...`}
                rows={3}
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 14, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, fontSize: 14, color: C.text,
                  resize: 'none', outline: 'none',
                  lineHeight: 1.5,
                }}
              />
              <button
                onClick={handleAI}
                disabled={aiLoading || !aiInput.trim()}
                style={{
                  ...baseStyles.pill,
                  ...baseStyles.pillActive,
                  width: '100%', justifyContent: 'center',
                  marginTop: 12, padding: '14px 20px',
                  fontSize: 15, fontWeight: 600,
                  opacity: (aiLoading || !aiInput.trim()) ? 0.5 : 1,
                }}
              >
                {aiLoading ? '⏳ Claude denkt nach...' : '✨ Shots generieren'}
              </button>
            </div>

            {/* Suggestions */}
            {aiSuggestions.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                  Shot-Vorschläge
                </h4>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
                  Wähle die Shots aus, die du übernehmen möchtest:
                </p>
                {aiSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    onClick={() => setAiSelected(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="slide-in"
                    style={{
                      ...baseStyles.card,
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      cursor: 'pointer',
                      borderColor: aiSelected[i] ? C.accent : C.border,
                      background: aiSelected[i] ? C.accentBg : C.card,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div style={baseStyles.checkbox(aiSelected[i])}>
                      {aiSelected[i] && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 14, lineHeight: 1.5, flex: 1 }}>
                      {suggestion}
                    </span>
                  </div>
                ))}

                {Object.values(aiSelected).some(v => v) && (
                  <button
                    onClick={addSelectedToShotlist}
                    style={{
                      ...baseStyles.pill,
                      ...baseStyles.pillActive,
                      width: '100%', justifyContent: 'center',
                      marginTop: 12, padding: '14px 20px',
                      fontSize: 15, fontWeight: 600,
                    }}
                  >
                    ✅ Ausgewählte zur Shotliste hinzufügen
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PACKLISTE TAB ── */}
        {activeTab === 'packliste' && (
          <div className="fade-up">
            <h3 style={{ ...baseStyles.sectionTitle, marginTop: 20 }}>Packliste</h3>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
              Alles für den Dreh: Kamera-Gear, Deko & Styling für {trip.destination}.
            </p>

            {/* Overall Progress */}
            <div style={baseStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Eingepackt
                </p>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>
                  {allPackItems.length > 0 ? Math.round((packDone / allPackItems.length) * 100) : 0}%
                </span>
              </div>
              <ProgressBar done={packDone} total={allPackItems.length} />
            </div>

            {/* ── Kamera Essentials ── */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              🎥 Kamera Essentials
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>(jeder Trip)</span>
            </h4>
            <div style={baseStyles.card}>
              <ProgressBar
                done={KAMERA_ESSENTIALS.filter(p => packlistChecked[`${trip.id}_${p.id}`]).length}
                total={KAMERA_ESSENTIALS.length}
              />
              {KAMERA_ESSENTIALS.map(item => (
                <CheckItem
                  key={item.id}
                  checked={!!packlistChecked[`${trip.id}_${item.id}`]}
                  text={`${item.emoji} ${item.text}`}
                  onToggle={() => togglePackItem(item.id)}
                />
              ))}
            </div>

            {/* ── Trip-spezifische Deko ── */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              🎨 Deko & Props – {trip.destination}
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>({tripDekoItems.length})</span>
            </h4>
            <div style={baseStyles.card}>
              <ProgressBar
                done={tripDekoItems.filter(p => packlistChecked[`${trip.id}_${p.id}`]).length}
                total={tripDekoItems.length}
              />
              {tripDekoItems.map(item => (
                <CheckItem
                  key={item.id}
                  checked={!!packlistChecked[`${trip.id}_${item.id}`]}
                  text={`${item.emoji} ${item.text}`}
                  onToggle={() => togglePackItem(item.id)}
                />
              ))}
            </div>

            {/* ── Universelle Props & Styling ── */}
            <h4 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              🧳 Universelle Props & Styling
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>(jeder Trip)</span>
            </h4>
            <div style={baseStyles.card}>
              <ProgressBar
                done={UNIVERSAL_ITEMS.filter(p => packlistChecked[`${trip.id}_${p.id}`]).length}
                total={UNIVERSAL_ITEMS.length}
              />
              {UNIVERSAL_ITEMS.map(item => (
                <CheckItem
                  key={item.id}
                  checked={!!packlistChecked[`${trip.id}_${item.id}`]}
                  text={`${item.emoji} ${item.text}`}
                  onToggle={() => togglePackItem(item.id)}
                />
              ))}
            </div>

            {/* Spacing for bottom nav */}
            <div style={{ height: 20 }} />
          </div>
        )}
      </div>

      {/* ── Weather Bottom Sheet ── */}
      <BottomSheet
        open={!!weatherSheet}
        onClose={() => setWeatherSheet(null)}
        title={weatherSheet ? `${weatherSheet.locName} · ${weatherSheet.date}` : ''}
      >
        {weatherSheet && (() => {
          const data = weatherData[weatherSheet.locationKey];
          if (!data?.hourly) return <p style={{ color: C.textMuted }}>Keine stündlichen Daten</p>;

          const dayDate = data.daily.time[weatherSheet.dayIdx];
          const hours = data.hourly.time
            .map((t, i) => ({ time: t, idx: i }))
            .filter(h => h.time.startsWith(dayDate));

          return (
            <div style={{ display: 'grid', gap: 6 }}>
              {hours.map(h => {
                const w = getWeather(data.hourly.weathercode[h.idx]);
                const temp = Math.round(data.hourly.temperature_2m[h.idx]);
                const rain = data.hourly.precipitation_probability[h.idx];
                const hour = new Date(h.time).getHours();

                return (
                  <div key={h.idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, width: 36 }}>
                      {String(hour).padStart(2, '0')}:00
                    </span>
                    <span style={{ fontSize: 22 }}>{w.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: C.text }}>{w.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{temp}°</span>
                    {rain > 0 && (
                      <span style={{ fontSize: 11, color: C.textMuted }}>💧{rain}%</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </BottomSheet>

      {/* ── Bottom Navigation ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 520,
        ...baseStyles.glass,
        borderRadius: '20px 20px 0 0',
        borderBottom: 'none',
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        display: 'flex', justifyContent: 'space-around',
        zIndex: 200,
        boxShadow: '0 -4px 24px rgba(160,132,92,0.08)',
      }}>
        {[
          { id: 'overview', icon: '🏠', label: 'Übersicht' },
          { id: 'shots', icon: '🎬', label: 'Shots' },
          { id: 'packliste', icon: '🎒', label: 'Packliste' },
          { id: 'weather', icon: '🌤️', label: 'Wetter' },
          { id: 'ai', icon: '✨', label: 'AI' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '6px 10px',
              borderRadius: 14,
              transition: 'all 0.2s',
              opacity: activeTab === tab.id ? 1 : 0.5,
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: activeTab === tab.id ? C.accent : C.textMuted,
              letterSpacing: '0.02em',
            }}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div style={{
                width: 4, height: 4, borderRadius: 2,
                background: C.accent,
                marginTop: 1,
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
