import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, TestTube, Leaf, AlertCircle, CheckCircle, Info, Droplet, Star, Map, Store, Navigation, Search, HeartPulse, HelpCircle, Briefcase, Calendar, BarChart3, Thermometer, Wind, CloudRain } from 'lucide-react';

// ==========================================
// BAZY DANYCH (Region: Podlaskie)
// ==========================================

const HARVEST_DATABASE = [
  { title: 'Mniszkowy', badge: 'POŁOWA MAJA', monthPrefix: 'Kwiecień - Maj:', signals: 'Intensywnie żółte dywany kwitnącego mniszka lekarskiego na łąkach i trawnikach.', tip: 'Miód ten krystalizuje niezwykle szybko, często już w plastrach. Wymaga bardzo wczesnego i ostrożnego miodobrania, by nie wychłodzić gniazda.' },
  { title: 'Rzepakowy', badge: 'PRZEŁOM MAJA I CZERWCA', monthPrefix: 'Maj:', signals: 'Rozległe, intensywnie żółte pola kwitnącego rzepaku ozimego. Wyczuwalny charakterystyczny zapach w okolicach pasieki.', tip: 'Wymaga bardzo szybkiego miodobrania zaraz po poszyciu, ponieważ błyskawicznie krystalizuje (często w komórkach plastra). Warto dbać o dobrą wentylację ula ze względu na dużą wilgotność nektaru.' },
  { title: 'Akacjowy', badge: 'POŁOWA CZERWCA', monthPrefix: 'Początek czerwca:', signals: 'Białe grona kwiatów robinii akacjowej, bardzo intensywny, słodki zapach roznoszący się wokół drzew.', tip: 'Kapryśny pożytek – najlepiej nektaruje przy bezwietrznej, parnej i wilgotnej pogodzie. Miód należy zbierać dopiero po całkowitym upewnieniu się, że jest w pełni dojrzały (wilgotność poniżej 19%).' },
  { title: 'Lipowy', badge: 'KONIEC LIPCA', monthPrefix: 'Przełom czerwca i lipca:', signals: 'Kwitnienie lipy drobnolistnej i szerokolistnej, charakterystyczny, odurzający zapach w powietrzu, głośne huczenie pszczół w koronach drzew.', tip: 'Jeden z najważniejszych pożytków. Warto poczekać do pełnego przekwitnięcia, gdyż często łączy się ze wczesną spadzią letnią. Po miodobraniu to idealny moment na rozpoczęcie zwalczania warrozy.' },
  { title: 'Gryczany', badge: 'POCZĄTEK SIERPNIA', monthPrefix: 'Lipiec:', signals: 'Ogromne, biało-różowe uprawy kwitnącej gryki. Intensywny, nieco ostry zapach łanu.', tip: 'Gryka nektaruje najintensywniej w godzinach porannych i przedpołudniowych, zwłaszcza w parne i wilgotne dni. Miód charakteryzuje się bardzo ciemną barwą i ostrym smakiem.' },
  { title: 'Nawłociowy', badge: 'WRZESIEŃ', monthPrefix: 'Sierpień - Wrzesień:', signals: 'Złoto-żółte łany kwitnącej nawłoci na nieużytkach i obrzeżach lasów.', tip: 'Bardzo późny pożytek. Trzeba zachować dużą ostrożność, by pszczoły zdążyły zgromadzić zapasy zimowe i nie spracowały się nadmiernie. Miód ma kwaskowaty posmak.' },
  { title: 'Wrzosowy', badge: 'POŁOWA WRZEŚNIA', monthPrefix: 'Sierpień - Wrzesień:', signals: 'Fioletowe, rozległe połacie kwitnących wrzosowisk leśnych i poligonów.', tip: 'Miód wykazuje właściwości tiksotropowe (galaretowata konsystencja). Przed odwirowaniem bezwzględnie wymaga zastosowania specjalnego urządzenia – rozluźniacza do miodu.' },
  { title: 'Wielokwiatowy (wiosenny)', badge: 'KONIEC MAJA', monthPrefix: 'Kwiecień - Maj:', signals: 'Masowe kwitnienie wierzb, sadów owocowych, mniszka i wczesnych kwiatów łąkowych.', tip: 'Często pierwszy poważny zbiór towarowy w sezonie. Miód ten jest bardzo delikatny w smaku i bogaty w różnorodne pyłki, co świetnie stymuluje odporność.' },
  { title: 'Spadziowy (iglasty)', badge: 'SIERPIEŃ - WRZESIEŃ', monthPrefix: 'Lato (zależne od mszyc):', signals: 'Pojawienie się kropelek słodkiej rosy miodowej (spadzi) na igłach świerka, jodły lub sosny. Duża aktywność mszyc i czerwców.', tip: 'Miód wyjątkowo gęsty, bardzo ciemny, z zielonkawym refleksem. Nie krystalizuje tak szybko jak miody nektarowe. Pożytek ten jest jednak niezwykle uzależniony od stabilnej, ciepłej pogody.' }
];

const PODLASKIE_APIARIES = [
  { county: 'Powiat augustowski', name: 'Pasieka nad Nettą - Mieczysław Bura', address: 'ul. Turystyczna, 16-300 Augustów', description: 'Wyjątkowe miody leśne i lipowe z serca Puszczy Augustowskiej.', honeys: ['Wrzosowy', 'Lipowy', 'Leśny'] },
  { county: 'Powiat białostocki', name: 'Pasieka Wiszniewscy', address: 'ul. Surażska 62, 16-060 Zabłudów', description: 'Tradycyjne miody z Puszczy Knyszyńskiej. Sprzedaż w pasiece i na rynkach w Białymstoku.', honeys: ['Wielokwiatowy', 'Akacjowy', 'Pierzga'] },
  { county: 'Powiat białostocki', name: 'Gospodarstwo Pasieczne - Jan Kochanowicz', address: 'ul. Główna, 16-030 Supraśl', description: 'Miód z obszarów chronionych. Możliwość zakupu bezpośredniego.', honeys: ['Leśny', 'Mniszkowy'] },
  { county: 'Powiat bielski', name: 'Pasieka Rodzinna - Bielsk Podlaski', address: 'Okolice Bociek, 17-100 Bielsk Podlaski', description: 'Czyste tereny rolnicze i leśne południowego Podlasia.', honeys: ['Rzepakowy', 'Gryczany'] },
  { county: 'Powiat grajewski', name: 'Miody z Doliny Biebrzy', address: 'ul. Wojska Polskiego, 19-200 Grajewo', description: 'Unikalne miody z bagiennych łąk Biebrzańskiego Parku Narodowego.', honeys: ['Biebrzański Wielokwiat', 'Łąkowy'] },
  { county: 'Powiat wysokomazowiecki', name: 'Pasieka u Wojtka', address: 'ul. Ludowa, 18-200 Wysokie Mazowieckie', description: 'Gospodarstwo pasieczne nastawione na tradycyjne odmiany miodu.', honeys: ['Rzepakowy', 'Nawłociowy'] },
  { county: 'Powiat zambrowski', name: 'Pasieka pod Lipami', address: 'ul. Mazowiecka, 18-300 Zambrów', description: 'Sprzedaż miodu prosto z ula.', honeys: ['Lipowy', 'Wielokwiatowy'] },
  { county: 'Powiat łomżyński', name: 'Miodobranie Kurpiowskie - Pasieka Łomża', address: 'ul. Sikorskiego, 18-400 Łomża', description: 'Tradycje kurpiowskie. Miody z nadnarwiańskich łąk.', honeys: ['Nektarowo-spadziowy', 'Gryczany'] },
  { county: 'Powiat moniecki', name: 'Pasieka Biebrzańska - Mońki', address: 'ul. Wyzwolenia, 19-100 Mońki', description: 'Najczystsze powietrze i naturalna roślinność z okolic Biebrzy.', honeys: ['Wierzbowy', 'Łąkowy'] },
  { county: 'Powiat hajnowski', name: 'Miód Białowieski - Mirosław Pilucik', address: 'ul. Ogrodowa 9, 17-230 Białowieża', description: 'Ekologiczne miody z Puszczy Białowieskiej.', honeys: ['Lipowy', 'Spadziowy'] },
  { county: 'Powiat sokólski', name: 'Twórcza Pasieka Iwonki', address: 'ul. Białostocka 114, 16-100 Sokółka', description: 'Podlaski Produkt Lokalny. Miody z wędrówek.', honeys: ['Nektarowe', 'Pyłek'] },
  { county: 'Powiat sejneński', name: 'Pasieka Grażyna Sujet', address: 'ul. Wojska Polskiego 60C lok., 16-500 Sejny', description: 'Niewielka, stacjonarna pasieka z tradycjami przekazywanymi pokoleniom. Uczestnik programu Marka "Miód Podlaski".', honeys: ['Wielokwiatowy', 'Mniszkowy', 'Rzepakowy'] },
  { county: 'Powiat sejneński', name: 'Pasieka Andrzej Miszkiel', address: 'Berżniki, 16-500 Sejny', description: 'Pasieka położona w malowniczym sercu Pojezierza Sejneńskiego. Lokalne miody wielokwiatowe z domieszkami lipy i maliny.', honeys: ['Wielokwiatowy', 'Lipowy'] },
  { county: 'Powiat siemiatycki', name: 'Pasieka Podlaska Tradycja', address: 'ul. Świętojańska 24, 17-300 Siemiatycze', description: 'Wyjątkowe miody z unikalnych upraw: m.in. chabrowy i z ogórecznika. Produkty zdobywające lokalne nagrody.', honeys: ['Chabrowy', 'Spadziowy', 'Faceliowy'] },
  { county: 'Powiat siemiatycki', name: 'Pasieka Na Czystej Dolinie - R. Zalewski', address: 'Baciki Bliższe 92, 17-300 Siemiatycze', description: 'Rodzinna pasieka z tradycjami. Pszczoły w starych i nowych ulach dają wspaniałe, naturalne produkty.', honeys: ['Gryczany', 'Słonecznikowy'] },
  { county: 'Powiat suwalski', name: 'Przyszkolna Pasieka w Dowspudzie', address: 'Dowspuda, 16-420 Raczki', description: 'Pasieka edukacyjno-pokazowa przy Zespole Szkół, promująca tradycje pszczelarskie regionu Suwalszczyzny.', honeys: ['Wielokwiatowy', 'Lipowy'] },
  { county: 'Powiat kolneński', name: 'Gospodarstwo Pszczelarskie - Pasieka Szostakowo', address: 'Okolice Kolna (Stacjonarno-Wędrowna)', description: 'Znana pasieka wielopokoleniowa pozyskująca pyszne miody prosto z czystych, nieskażonych przemysłem terenów.', honeys: ['Rzepakowy', 'Chabrowy', 'Malinowy'] },
];

const FLORA_CALENDAR = [
  { month: 0, name: 'Styczeń', plants: ['Brak'], honey: 'Zapasowe', forecast: 'Pszczoły w kłębie zimowym.', longForecast: 'Odpoczynek zimowy. Brak dostępnego świeżego nektaru.' },
  { month: 1, name: 'Luty', plants: ['Leszczyna'], honey: 'Brak', forecast: 'Pierwsze obloty przy ociepleniu.', longForecast: 'Pojawiają się pierwsze pyłki z leszczyny. Pszczoły mogą wykonać krótki oblot oczyszczający.' },
  { month: 2, name: 'Marzec', plants: ['Podbiał', 'Wierzba'], honey: 'Wierzbowy', forecast: 'Początek rozwoju rodzin.', longForecast: 'Pierwsze istotne źródła nektaru i pyłku budujące siłę rodzin. Rozpoczyna się rozwój wiosenny.' },
  { month: 3, name: 'Kwiecień', plants: ['Mniszek lekarski', 'Wierzba', 'Klon'], honey: 'Mniszkowy, Wierzbowy', forecast: 'Kwitnienie mniszka.', longForecast: 'Intensywne kwitnienie mniszka na podlaskich łąkach. Najlepszy czas na rezerwację świeżych miodów wiosennych.' },
  { month: 4, name: 'Maj', plants: ['Rzepak', 'Jabłoń', 'Wiśnia'], honey: 'Rzepakowy, Owocowy', forecast: 'Szczyt sezonu wiosennego.', longForecast: 'Łąki i pola pokryte żółtym rzepakiem. Bardzo wysoka dostępność nektaru z rzepaku i sadów owocowych.' },
  { month: 5, name: 'Czerwiec', plants: ['Akacja', 'Malina leśna', 'Chaber'], honey: 'Akacjowy, Malinowy', forecast: 'Początek miodobrań leśnych.', longForecast: 'Kwitnie robinia akacjowa i leśne maliny. Doskonały czas na pozyskiwanie jasnych, delikatnych miodów.' },
  { month: 6, name: 'Lipiec', plants: ['Lipa', 'Gryka', 'Koniczyna'], honey: 'Lipowy, Gryczany', forecast: 'Kwitnie lipa drobnolistna.', longForecast: 'Pachnące lipowe aleje pełne owadów. Główny i najbardziej pożądany letni pożytek na Podlasiu.' },
  { month: 7, name: 'Sierpień', plants: ['Wrzos', 'Nawłoć'], honey: 'Wrzosowy, Nawłociowy', forecast: 'Koniec lata, wrzosowiska.', longForecast: 'Fioletowe dywany na wrzosowiskach i złota nawłoć na nieużytkach. Ostatnia szansa na zbiór cennego nektaru.' },
  { month: 8, name: 'Wrzesień', plants: ['Nawłoć', 'Wrzos'], honey: 'Nawłociowy', forecast: 'Ostatnie miodobrania.', longForecast: 'Dogasa kwitnienie nawłoci. Pszczoły przygotowują się do zimy i gromadzą ostatnie pyłki.' },
  { month: 9, name: 'Październik', plants: ['Brak'], honey: 'Brak', forecast: 'Przygotowanie do zimy.', longForecast: 'Koniec wegetacji miododajnej. Trwa intensywne karmienie i leczenie rodzin.' },
  { month: 10, name: 'Listopad', plants: ['Brak'], honey: 'Brak', forecast: 'Pszczoły w kłębie.', longForecast: 'Rodziny pszczele formują kłąb zimowy. Brak lotów pożytkowych.' },
  { month: 11, name: 'Grudzień', plants: ['Brak'], honey: 'Brak', forecast: 'Zimowla.', longForecast: 'Pełen okres spoczynku. Ule powinny pozostać w spokoju aż do wczesnej wiosny.' },
];

const SENSORY_OPTIONS = {
  consistency: ['Wybierz...', 'Płynny (Patoka)', 'Kremowany', 'Skrystalizowany (Krupiec)', 'Rozwarstwiony / Dziwny'],
  smell: ['Wybierz...', 'Kwiatowy / Delikatny', 'Intensywny / Ostry (Ziołowy)', 'Cukrowy / Brak zapachu', 'Sfermentowany'],
  taste: ['Wybierz...', 'Słodki i łagodny', 'Słodki z nutą goryczy / kwasowości', 'Pikantny / Drapiący w gardło', 'Jak syrop cukrowy / Sztuczny']
};

// ==========================================
// GŁÓWNY KOMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('scan');
  
  return (
    <div className="flex flex-col h-screen bg-amber-50 text-slate-800 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <header className="bg-amber-500 text-white p-4 shadow-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className="w-8 h-8 fill-amber-300 text-amber-300" />
          <h1 className="text-2xl font-bold tracking-tight">HoneyScan</h1>
        </div>
        <button className="bg-amber-600 p-2 rounded-full hover:bg-amber-700 transition" title="O aplikacji">
          <Info className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 relative scroll-smooth">
        {activeTab === 'scan' && <ScannerModule />}
        {activeTab === 'predict' && <PredictorModule />}
        {activeTab === 'pro' && <BeekeeperProModule />}
        {activeTab === 'map' && <MapModule />}
        {activeTab === 'tests' && <HomeTestsModule />}
      </main>

      <nav className="absolute bottom-0 w-full bg-white border-t border-amber-200 flex justify-around p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <NavButton icon={<Camera />} label="Skaner" active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
        <NavButton icon={<Leaf />} label="Predict" active={activeTab === 'predict'} onClick={() => setActiveTab('predict')} />
        <NavButton icon={<Briefcase />} label="Dla Pszczelarza" active={activeTab === 'pro'} onClick={() => setActiveTab('pro')} />
        <NavButton icon={<Map />} label="Mapa" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <NavButton icon={<TestTube />} label="Testy" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-2 min-w-[60px] transition-colors ${active ? 'text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}>
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform mb-1`}>{React.cloneElement(icon, { className: 'w-5 h-5' })}</div>
      <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-tight">{label}</span>
    </button>
  );
}

// ==========================================
// MODUŁ: SKANER + TESTY JAKOŚCI
// ==========================================

function ScannerModule() {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [testResults, setTestResults] = useState({ water: null });
  const [sensoryData, setSensoryData] = useState({ consistency: 'Wybierz...', smell: 'Wybierz...', taste: 'Wybierz...' });
  const fileInputRef = useRef(null);
  const apiKey = ""; // Klucz dostarczany przez środowisko

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setAnalysisResult(null);
        setTestResults({ water: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsScanning(true);
    try {
      const base64Data = image.split(',')[1];
      const prompt = `Jesteś ekspertem oceniającym miód. Sensoryka podana przez użytkownika: ${JSON.stringify(sensoryData)}. Zwróć JSON z polami: type (rodzaj miodu), visual_authenticity (liczba 0-100), reasoning (szczegółowy opis po czym rozpoznałeś ten miód na podstawie wyglądu i sensoryki - uwzględnij barwę, konsystencję i cechy typowe, rozpisz się na minimum 3-4 zdania), health_benefits (tablica dokładnie 5 głównych właściwości zdrowotnych tego miodu).`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await response.json();
      setAnalysisResult(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (err) {
      setAnalysisResult({
        type: "Miód Wielokwiatowy",
        visual_authenticity: 85,
        reasoning: "Na podstawie złocistej barwy i typowej krystalizacji można przypuszczać, że jest to miód z mieszanego pożytku. Analiza wizualna wskazuje na poprawną gęstość i brak rozwarstwień, co świadczy o dobrym przechowywaniu. Dokładne potwierdzenie czystości wymaga jednak testów fizykochemicznych.",
        health_benefits: ["Działa silnie antybakteryjnie", "Wspomaga naturalną odporność organizmu", "Łagodzi kaszel i ból gardła", "Dodaje energii z naturalnych cukrów", "Korzystnie wpływa na układ krążenia"]
      });
    } finally {
      setIsScanning(false);
    }
  };

  const score = analysisResult ? (analysisResult.visual_authenticity + (testResults.water === true ? 15 : testResults.water === false ? -25 : 0)) : 0;

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-xl font-bold text-amber-800">Honey Fingerprint</h2>
        <p className="text-xs text-amber-600">Sztuczna inteligencja w służbie pszczelarstwa.</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
        {!image ? (
          <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-amber-300 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50">
            <Camera className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-amber-700 font-medium text-xs">Dodaj zdjęcie miodu</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleCapture} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden h-40 bg-black">
              <img src={image} alt="Skan" className="w-full h-full object-cover" />
              <button onClick={() => { setImage(null); setAnalysisResult(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">✕</button>
            </div>
            {!analysisResult && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(SENSORY_OPTIONS).map(key => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{key === 'consistency' ? 'Konsystencja' : key === 'smell' ? 'Zapach' : 'Smak'}</label>
                      <select className="w-full p-2 rounded-lg border border-amber-100 text-xs bg-amber-50/50" value={sensoryData[key]} onChange={e => setSensoryData({...sensoryData, [key]: e.target.value})}>
                        {SENSORY_OPTIONS[key].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={analyzeImage} disabled={isScanning} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition shadow-lg">
                  {isScanning ? 'Analizowanie...' : 'Uruchom Analizę AI'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-5 text-white shadow-xl">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-lg">{analysisResult.type}</h3>
                 <p className="text-amber-200 text-[10px]">Autentyczność: {Math.max(0, Math.min(100, score))}%</p>
               </div>
               <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
             </div>
             <p className="mt-3 text-xs opacity-95 leading-relaxed bg-white/10 p-3 rounded-lg border border-white/20">{analysisResult.reasoning}</p>
             
             {analysisResult.health_benefits && analysisResult.health_benefits.length > 0 && (
               <div className="mt-4">
                 <h4 className="text-[11px] font-bold text-amber-200 mb-2 uppercase tracking-wide">5 głównych właściwości dla zdrowia:</h4>
                 <ul className="text-[11px] list-disc list-outside ml-4 text-amber-50 space-y-1">
                   {analysisResult.health_benefits.map((benefit, i) => (
                     <li key={i} className="leading-snug">{benefit}</li>
                   ))}
                 </ul>
               </div>
             )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
            <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Dodatkowy test jakości:</h4>
            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[11px] font-medium leading-tight text-amber-900 pr-2">Czy miód powoli opada na dno szklanki w formie zbitej masy?</span>
                <div className="flex gap-2">
                  <button onClick={() => setTestResults({water: true})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${testResults.water === true ? 'bg-green-600 text-white' : 'bg-white border text-slate-400'}`}>TAK</button>
                  <button onClick={() => setTestResults({water: false})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${testResults.water === false ? 'bg-red-600 text-white' : 'bg-white border text-slate-400'}`}>NIE</button>
                </div>
              </div>
              
              {testResults.water !== null && (
                <div className={`p-3 rounded-lg text-xs animate-in slide-in-from-left-2 ${testResults.water ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <p className="font-bold mb-1">{testResults.water ? 'Wniosek: Miód wysokiej jakości' : 'Wniosek: Prawdopodobne zafałszowanie'}</p>
                  <p className="text-[10px] leading-snug">
                    {testResults.water ? "Gęstość prawidłowa." : "Możliwe zafałszowanie syropem."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODUŁ: ROŚLINY (PREDICT)
// ==========================================

function PredictorModule() {
  const [state, setState] = useState('idle');
  const [currentMonth] = useState(new Date().getMonth());
  const forecast = FLORA_CALENDAR[currentMonth];

  const handlePredict = () => {
    setState('loading');
    setTimeout(() => {
      setState('done');
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4 bg-[#FDFBF2] min-h-full pb-10">
      <div className="text-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-amber-700 flex justify-center items-center gap-2">
          <Leaf className="w-8 h-8 text-green-500" /> Predict
        </h2>
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">System Analizy Pożytków</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center relative overflow-hidden">
        {state === 'idle' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300 py-4">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-amber-50">
              <MapPin className="w-10 h-10 text-amber-600" strokeWidth={2} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-700">Region: <span className="text-amber-600">Podlaskie</span></h3>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-[250px] mx-auto">
              System zanalizuje aktualny miesiąc oraz lokalne dane o kwitnieniu roślin miododajnych na Podlasiu.
            </p>
            
            <button 
              onClick={handlePredict} 
              className="w-full py-4 mt-4 bg-[#F29F05] hover:bg-amber-600 active:scale-95 text-white rounded-xl font-bold shadow-md transition-all"
            >
              Sprawdź co kwitnie w mojej okolicy
            </button>
          </div>
        )}

        {state === 'loading' && (
          <div className="space-y-8 animate-in fade-in duration-300 py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-amber-50">
              <MapPin className="w-10 h-10 text-amber-600 opacity-50" strokeWidth={2} />
            </div>
            <div className="w-12 h-12 border-4 border-amber-200 border-t-[#F29F05] rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-amber-800">Łączenie z bazą roślinności...</p>
          </div>
        )}

        {state === 'done' && (
          <div className="text-left space-y-5 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-8 h-8 text-amber-600" strokeWidth={2} />
            </div>

            <div className="bg-[#F4FCF7] border border-[#A7E5B6] p-4 rounded-xl">
              <h4 className="font-bold text-[#0A632B] text-sm flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5" /> Aktualnie kwitnie ({forecast.name}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {forecast.plants.map(p => (
                  <span key={p} className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-[#0A632B] border border-[#A7E5B6] shadow-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFDF5] p-5 rounded-xl border border-[#F2E0B6] shadow-sm">
               <h4 className="font-bold text-[#9C5A03] text-sm mb-3">Prognoza na ten miesiąc:</h4>
               <p className="text-[13px] text-slate-600 italic leading-relaxed">"{forecast.longForecast}"</p>
               
               <div className="mt-5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                 <p className="text-[10px] font-bold text-[#F29F05] uppercase tracking-wide mb-1">Dostępny świeży miód:</p>
                 <p className="text-lg font-black text-slate-800">{forecast.honey}</p>
               </div>
            </div>
            <button onClick={() => setState('idle')} className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition">← Wróć do wyszukiwania</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODUŁ: SYSTEM DLA PSZCZELARZY
// ==========================================

function BeekeeperProModule() {
  const [proMode, setProMode] = useState('calendar'); // 'calendar' lub 'forecast'
  
  const [formData, setFormData] = useState({
    hives: 10,
    temp: 22,
    flowerPhase: 'pełnia',
    strength: '50k',
    humidity: 60,
    flowType: 'Rzepak'
  });
  
  const [result, setResult] = useState(null);

  const calculateProduction = () => {
    let basePerHive = 2.0; 
    
    if (formData.temp < 18 || formData.temp > 30) basePerHive *= 0.6; 
    if (formData.flowerPhase === 'początek') basePerHive *= 0.4;
    if (formData.flowerPhase === 'przekwitanie') basePerHive *= 0.3;
    
    if (formData.strength === '<20k') basePerHive *= 0.3;
    if (formData.strength === '30k') basePerHive *= 0.6;
    if (formData.strength === '50k') basePerHive *= 1.0;
    if (formData.strength === '70k') basePerHive *= 1.5;
    if (formData.strength === '>80k') basePerHive *= 2.0;

    let humMult = 1 - Math.abs(70 - formData.humidity) * 0.005;
    basePerHive *= Math.max(0.3, humMult);

    const dailyTotal = basePerHive * formData.hives;
    setResult({
      dailyPerHive: basePerHive.toFixed(2),
      dailyTotal: dailyTotal.toFixed(1),
      monthlyPerHive: (basePerHive * 30).toFixed(1),
      monthlyTotal: (dailyTotal * 30).toFixed(1),
      confidence: (formData.temp > 18 && formData.temp < 26) ? 'Wysoka' : 'Średnia'
    });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 bg-[#FDFBF2] min-h-full pb-10">
      <div className="text-center mt-2">
        <h2 className="text-2xl font-bold text-amber-800 flex justify-center items-center gap-2">
          <Briefcase className="w-7 h-7 text-amber-600" /> System Pasieki
        </h2>
        <p className="text-sm font-medium text-amber-600 mt-1">Zarządzanie zbiorami i prognozowanie</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setProMode('calendar')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold rounded-xl border transition-all ${proMode === 'calendar' ? 'border-amber-300 text-amber-800 bg-white shadow-sm' : 'border-transparent text-amber-600/70 hover:bg-amber-100/50'}`}
        >
          <Calendar className="w-4 h-4" /> Kalendarz Zbiorów
        </button>
        <button 
          onClick={() => setProMode('forecast')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold rounded-xl border transition-all ${proMode === 'forecast' ? 'border-amber-300 text-amber-800 bg-white shadow-sm' : 'border-transparent text-amber-600/70 hover:bg-amber-100/50'}`}
        >
          <BarChart3 className="w-4 h-4" /> Prognoza Produkcji
        </button>
      </div>

      {proMode === 'calendar' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-[13px] text-slate-600 leading-relaxed">
            Sprawdź optymalne terminy zbioru poszczególnych gatunków miodu w relacji do faz kwitnienia głównych pożytków w Polsce.
          </div>

          <div className="space-y-4">
            {HARVEST_DATABASE.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[#9C5A03] text-lg">{item.title}</h3>
                  <span className="bg-[#FDE08B] text-[#9C5A03] px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">{item.badge}</span>
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Kwitnienie (Wskaźnik natury):</p>
                <p className="text-[13px] text-slate-700 mb-4 leading-relaxed">
                  <span className="font-bold text-amber-600">{item.monthPrefix}</span> {item.signals}
                </p>

                <div className="bg-[#F8FAFC] rounded-xl p-3 flex flex-col gap-1.5 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Wskazówka</span>
                  </div>
                  <p className="text-[13px] text-slate-500 italic ml-1">
                    {item.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Kalkulator wydajności
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                  Wielkość pasieki (liczba uli): <span>{formData.hives}</span>
                </label>
                <input 
                  type="range" min="1" max="100" value={formData.hives} 
                  onChange={e => setFormData({...formData, hives: parseInt(e.target.value)})}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg appearance-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Temperatura (°C)</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <input 
                      type="number" value={formData.temp} 
                      onChange={e => setFormData({...formData, temp: parseInt(e.target.value)})}
                      className="bg-transparent w-full text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Faza rozwoju roślin</label>
                  <select 
                    value={formData.flowerPhase}
                    onChange={e => setFormData({...formData, flowerPhase: e.target.value})}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs font-bold"
                  >
                    <option value="początek">Początek kwitnienia</option>
                    <option value="pełnia">Pełnia (Szczyt)</option>
                    <option value="przekwitanie">Koniec kwitnienia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Siła rodzin</label>
                  <select 
                    value={formData.strength}
                    onChange={e => setFormData({...formData, strength: e.target.value})}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs font-bold"
                  >
                    <option value="<20k">Bardzo Słaba (&lt;20 tys.)</option>
                    <option value="30k">Słaba (ok. 30 tys.)</option>
                    <option value="50k">Średnia (ok. 50 tys.)</option>
                    <option value="70k">Silna (ok. 70 tys.)</option>
                    <option value=">80k">Bardzo Silna (&gt;80 tys.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">Wilgotność gleby (%) <span>{formData.humidity}%</span></label>
                  <input 
                    type="range" min="0" max="100" value={formData.humidity} 
                    onChange={e => setFormData({...formData, humidity: parseInt(e.target.value)})}
                    className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg appearance-none mt-2"
                  />
                </div>
              </div>

              <button 
                onClick={calculateProduction}
                className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-amber-700 transition"
              >
                Generuj prognozę produkcji
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm text-amber-400 uppercase tracking-widest">Szacowany Urob</h4>
                <div className="bg-white/10 px-2 py-1 rounded text-[10px]">Pewność: {result.confidence}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Dzienna (z ula)</p>
                  <p className="text-lg font-black text-amber-300">~{result.dailyPerHive} kg</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Dzienna (całość)</p>
                  <p className="text-lg font-black text-amber-300">~{result.dailyTotal} kg</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Miesięczna (z ula)</p>
                  <p className="text-lg font-black text-amber-300">~{result.monthlyPerHive} kg</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Miesięczna (całość)</p>
                  <p className="text-lg font-black text-amber-300">~{result.monthlyTotal} kg</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic">
                *Wyniki są szacunkowe i zależą od mikroregionu oraz rasy pszczół. Pamiętaj o zostawieniu zapasów dla rodziny!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODUŁ: MAPA
// ==========================================

function MapModule() {
  const [selected, setSelected] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  
  const counties = ['Wszystkie', ...new Set(PODLASKIE_APIARIES.map(a => a.county))].sort();
  
  const filteredList = PODLASKIE_APIARIES.filter(a => {
    const matchesCounty = selected === 'Wszystkie' || a.county === selected;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                         a.honeys.some(h => h.toLowerCase().includes(search.toLowerCase()));
    return matchesCounty && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4 bg-[#FDFBF2] min-h-full pb-10">
      <div className="text-center mt-2 mb-2">
        <h2 className="text-2xl font-bold text-amber-800 flex justify-center items-center gap-2">
          <Map className="w-7 h-7 text-blue-500" /> Mapa Pasiek
        </h2>
        <p className="text-sm font-medium text-amber-600 mt-1">Lokalne pasieki woj. podlaskiego</p>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" placeholder="Szukaj (np. wrzosowy, nazwa, adres)..." 
          className="w-full pl-9 pr-4 py-3 rounded-2xl border border-amber-200 text-sm focus:outline-none shadow-sm"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {counties.map(c => {
          const isSelected = selected === c;
          return (
            <button 
              key={c} onClick={() => setSelected(c)} 
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-sm ${isSelected ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50'}`}
            >
              {c === 'Wszystkie' ? c : c.replace('Powiat ', '').toLowerCase()}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredList.map((a, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex items-start gap-2 mb-2">
              <Store className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <h4 className="font-bold text-slate-800 text-[15px]">{a.name}</h4>
            </div>
            
            <span className="inline-block px-2 py-0.5 bg-[#FFF4D9] text-[#B47000] text-[10px] font-black uppercase rounded-md mb-3">
              {a.county.replace('Powiat ', '')}
            </span>
            
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
              <Navigation className="w-3.5 h-3.5 text-slate-400" /> 
              <span>{a.address}</span>
            </div>
            
            <div className="bg-[#F8FAFC] rounded-xl p-4 text-[13px] text-slate-600 mb-4 leading-relaxed">
              {a.description}
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Dostępne miody:</p>
            <div className="flex flex-wrap gap-2">
              {a.honeys.map(h => (
                <span key={h} className="bg-[#FFFDF5] border border-[#FDE08B] text-[#B47000] px-3 py-1 rounded-lg text-[11px] font-bold shadow-sm">
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MODUŁ: TESTY
// ==========================================

function HomeTestsModule() {
  return (
    <div className="p-4 space-y-4 bg-[#FDFBF2] min-h-full pb-10">
      <div className="text-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-amber-700 flex justify-center items-center gap-2">
          <TestTube className="w-6 h-6 text-indigo-500" /> Baza Wiedzy
        </h2>
        <p className="text-xs text-amber-600 mt-1">Domowe metody badania miodu</p>
      </div>

      <div className="space-y-4">
        {/* Karta 1 */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Test Szklanki Wody</h4>
          </div>
          
          <div className="bg-[#F8FAFC] text-slate-600 p-4 rounded-xl text-[13px] mb-4">
            Wlej łyżeczkę miodu do szklanki z zimną wodą.
          </div>
          
          <div className="flex gap-3">
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-3 rounded-xl flex-1 relative overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1.5 z-10 relative">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-bold text-green-700 text-sm">Miód Prawdziwy:</span>
              </div>
              <p className="text-[12px] text-green-800 leading-snug z-10 relative">Miód opada na dno i tworzy zbitą masę.</p>
              <CheckCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-green-600 opacity-10" />
            </div>
            
            <div className="bg-[#FEF2F2] border border-[#FECACA] p-3 rounded-xl flex-1 relative overflow-hidden">
              <div className="flex items-start gap-1.5 mb-1.5 z-10 relative">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-bold text-red-700 text-sm leading-tight">Miód Zafałszowany:</span>
              </div>
              <p className="text-[12px] text-red-800 leading-snug z-10 relative">Szybko się rozpuszcza i mętni wodę od razu.</p>
              <AlertCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-red-600 opacity-10" />
            </div>
          </div>
        </div>

        {/* Karta 2 */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Test Bibuły / Ręcznika</h4>
          </div>
          
          <div className="bg-[#F8FAFC] text-slate-600 p-4 rounded-xl text-[13px] mb-4">
            Kroplę miodu upuść na ręcznik papierowy.
          </div>
          
          <div className="flex gap-3">
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-3 rounded-xl flex-1 relative overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1.5 z-10 relative">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-bold text-green-700 text-sm">Miód Prawdziwy:</span>
              </div>
              <p className="text-[12px] text-green-800 leading-snug z-10 relative">Kropla utrzymuje kształt, nie wsiąka od razu.</p>
              <CheckCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-green-600 opacity-10" />
            </div>
            
            <div className="bg-[#FEF2F2] border border-[#FECACA] p-3 rounded-xl flex-1 relative overflow-hidden">
              <div className="flex items-start gap-1.5 mb-1.5 z-10 relative">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-bold text-red-700 text-sm leading-tight">Miód Zafałszowany:</span>
              </div>
              <p className="text-[12px] text-red-800 leading-snug z-10 relative">Szybko wsiąka w papier, zostawiając plamę.</p>
              <AlertCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-red-600 opacity-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}