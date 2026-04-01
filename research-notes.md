# Notatki z researchu — zdarzenia niepożądane w polskich szpitalach

Data researchu: 2026-03-31

---

## 1. Źródło: PDF — Sprawozdanie PSQCWG Komisji Europejskiej (maj 2014)

**Plik**: `zdarzenia_nieporządane_przewodnik.pdf` (65 stron)
**Tytuł**: "Najważniejsze ustalenia i zalecenia dotyczące systemów zgłaszania zdarzeń dotyczących bezpieczeństwa pacjentów i wyciągania wniosków z takich zdarzeń w Europie"
**Autor**: Podgrupa ds. Zgłaszania Zdarzeń i Wyciągania Wniosków PSQCWG Komisji Europejskiej
**URL oryginału**: http://ec.europa.eu/health/patient_safety/policy/index_en.htm

### Kluczowe ustalenia wykorzystane w specyfikacji:

**Systemy obowiązkowe vs dobrowolne (s. 26-29, Tabela 3)**:
- Polska: system obowiązkowy w kontekście akredytacji szpitali, w sensie prawnym dobrowolny
- Tabela 3 z 22 krajami: kto może zgłaszać (personel, pacjenci, rodziny, placówki)

**Rodzaje zgłaszanych zdarzeń (s. 30)**:
- Kryteria definiowania: waga zdarzenia, rodzaj, połączenie obu, near-miss, szeroka definicja
- Definicja czeska (praktyczna): "Problem, którego chcielibyśmy uniknąć" + 3 pytania testowe

**Kto zgłasza (s. 30-32)**:
- Cały personel, nie tylko medyczny
- Pacjenci i rodziny — oddzielny formularz
- Dania: od 2011 pacjenci mogą zgłaszać, stanowią ok. 1,5% zgłoszeń
- Belgia: 25% szpitali umożliwia pacjentom zgłaszanie
- UK: formularz internetowy dla pacjentów od 2005

**Minimalny zestaw danych (s. 48-49)**:
- 10 pól: profil pacjenta, miejsce, identyfikacja org., czas, rodzaj, skutki, opis, działania, przyczyny, środki zapobiegawcze
- → bezpośrednio przełożone na pola formularza w specyfikacji (sekcja 9)

**Przepływ informacji (s. 40, Rysunek 1)**:
- 4 poziomy: zgłaszający → lokalny → regionalny → centralny
- Informacja zwrotna w dół — kluczowy motywator
- → przełożone na flow użytkownika w specyfikacji (sekcja 7)

**Anonimizacja (s. 34-35)**:
- Modele: pełna anonimowość, anonimizacja po analizie, anonimizacja przy transferze, poufność bez anonimowości
- Hiszpania (SiNASP): automatyczne usuwanie danych identyfikujących po 2 tygodniach
- Dania: pola identyfikujące trwale usuwane przy transferze
- → przełożone na zasady anonimizacji w specyfikacji (sekcja 10.3)

**Metody analizy (s. 54-55, Tabela 9)**:
- 5 Why, RCA, FMEA/HFMEA, PRISMA, FRAM
- → przełożone na flow RCA w specyfikacji (sekcja 8)

**Klasyfikacja (s. 49-50, Tabela 8)**:
- WHO ICPS najpopularniejszy — Belgia, Dania, Hiszpania, Irlandia, Łotwa, Niemcy, Norwegia, Rep. Czeska
- Zalecenie: uproszczona klasyfikacja dla zgłaszającego, szczegółowe kodowanie ICPS dla case handlera
- → przełożone na katalog kategorii A-X w specyfikacji (sekcja 5)

**Infrastruktura techniczna (s. 57-60)**:
- Dwa modele: platforma chmurowa vs integracja z lokalnymi systemami
- Minimum: 1 komputer z internetem
- Automatyczny transfer danych (nie pakietowy)
- → przełożone na wymagania techniczne w specyfikacji (sekcje 15-16)

---

## 2. Wyszukiwanie: polskie ramy prawne

### Zapytanie: "ustawa o jakości w opiece zdrowotnej bezpieczeństwie pacjenta 2022 zdarzenia niepożądane raportowanie Polska"

**Ustalenie**: Ustawa z dnia **16 czerwca 2023 r.** (nie 2022 jak początkowo zakładałem) o jakości w opiece zdrowotnej i bezpieczeństwie pacjenta, Dz.U. 2023 poz. 1692.
- Źródło: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230001692
- PDF ustawy: https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20230001692/T/D20231692L.pdf
- Omówienie: https://www.prawo.pl/akty/dz-u-2023-1692,21865648.html

### Zapytanie: "art. 18 ustawa jakość opieka zdrowotna wewnętrzny system"

**Źródło**: https://lexlege.pl/bezp-pacj/paragraf-18/

**Art. 18 — Wewnętrzny system (WSZJ)**:
- Ust. 1: Obowiązek dla wszystkich podmiotów z umową NFZ — system składający się z zasad, procedur, metod i opisów stanowisk pracy
- Ust. 2: 7 obowiązków: identyfikacja ryzyka, obszary priorytetowe, kryteria nadzoru, monitoring, monitorowanie ZN, szkolenia, badania opinii pacjentów
- → bezpośrednio przełożone na sekcję 15.3-15.4 specyfikacji

**Art. 19 — Osoba odpowiedzialna**:
- Kierownik podmiotu odpowiada za WSZJ
- Obowiązek analizy RCA, zapewnienia tajemnicy tożsamości zgłaszającego, anonimizacji RCA
- → przełożone na rolę "Kierownik" w specyfikacji (sekcja 3.4)

**Źródło**: https://www.wolterskluwer.com/pl-pl/expert-insights/ustawa-o-jakosci-w-ochronie-zdrowia-a-nowe-obowiazki-podmiotow-leczniczych
- Termin wdrożenia WSZJ: **30 czerwca 2024 r.**
- → zapisane w adverse-events-guide.md sekcja 15.3

---

## 3. Wyszukiwanie: Rejestr Zdarzeń Niepożądanych

### Zapytanie: "Rejestr Zdarzeń Niepożądanych Polska 2024 2025 zgłaszanie szpital wymogi"

**Źródło**: https://www.isbzdrowie.pl/2024/01/elektroniczny-rejestr-zdarzen-niepozadanych-niezbedny-dla-poprawy-bezpieczenstwa-w-polskich-placowkach-medycznych/
- **Tylko 27% polskich szpitali** korzysta z rejestru ZN w formie elektronicznej (wzrost o 3%)
- → zapisane w adverse-events-guide.md sekcja 15.17

**Źródło**: https://www.rynekzdrowia.pl/Polityka-zdrowotna/Ustawa-o-jakosci-Rejestr-zdarzen-niepozadanych-bedzie-obowiazkowy-i-niejawny,223689,14.html
- Rejestr **niejawny** (dane nie są publiczne)
- Personel medyczny chroniony przed sankcjami za zgłoszenie
- → przełożone na zasadę #3 w specyfikacji (sekcja 2)

**Źródło**: https://www.prawo.pl/zdrowie/rejestr-zdarzen-niepozadanych,523774.html
- Zgłaszanie **dobrowolne** (ministerstwo proponowało obowiązkowe, nie uchwalono)
- Może zgłosić: pacjent, rodzic/opiekun, świadek
- → przełożone na sekcję 15.6 specyfikacji i formularz pacjenta (sekcja 6.2)

---

## 4. Wyszukiwanie: katalog kategorii zdarzeń w polskich szpitalach

### Zapytanie: "Polska katalog zdarzeń niepożądanych kategorie lista upadek zakażenie błąd lekowy szpital"

**Źródło**: https://www.szpital.lublin.pl/katalog-zdarzen-niepozadanch.html
**Szpital**: Wojewódzki Szpital Specjalistyczny w Lublinie

7 kategorii głównych:
1. Urządzenia medyczne i wyposażenie
2. Organizacja pracy personelu medycznego
3. Leczenie i farmakologia
4. Opieka nad pacjentem
5. Zdarzenia niespodziewane
6. Respektowanie praw pacjenta
7. Organizacja pracy i zarządzanie

Klasyfikacja skutku: zdarzenie ze szkodą / bez szkody / niedoszłe
- → przełożone na katalog kategorii A-X w specyfikacji (sekcja 5) — rozszerzony o WHO ICPS

**Źródło**: https://blogoprawachpacjenta.com.pl/zdarzenia-niepozadane-w-szpitalu-przyklady-przyczyny-raportowanie/
- Częstość wg obszarów w Polsce: diagnostyka **34%**, zakażenia **29%**, procedury chirurgiczne **28%**
- ZN w **7,6%** wszystkich hospitalizacji w Polsce
- → zapisane w adverse-events-guide.md sekcja 15.17

---

## 5. Wyszukiwanie: formularze zgłoszeniowe

### Zapytanie: "formularz zgłoszenia zdarzenia niepożądanego Polska wzór"

**Źródło**: https://www.szpital-chrzanow.pl/formularz-zdarzenia
**Szpital**: Szpital Powiatowy w Chrzanowie

Elektroniczny formularz z sekcjami:
1. Podmiot zdarzenia (pacjent/personel/odwiedzający/inni)
2. Stan pacjenta (ryzyko upadków, ból, skala Katza, nietrzymanie moczu, percepcja, zachowanie)
3. Typ zdarzenia — **ZN kategorie A-E** + **NZN kategorie A-E**:
   - A: Działalność kliniczna
   - B: Sprzęt medyczny i organizacja
   - C: Farmakoterapia
   - D: Przetaczanie krwi
   - E: Inne (odleżyny, upadki, samobójstwa)
4. Dane pacjenta (płeć, wiek, nr karty)
5. Czas i miejsce (data, godzina, lokalizacja)
6. Czynniki ryzyka (środowisko, pacjent, personel)
7. Działania prewencyjne
8. Skutek (przedłużona hospitalizacja, reoperacja, zgon)
- → bezpośrednio przełożone na pola formularza w specyfikacji (sekcja 9) i kroki formularza (sekcja 6.1)

**Źródło**: https://nio.gov.pl/zgloszenie-zdarzenia-niepozadanego-zn-przez-pacjenta-lub-osobe-bliska
**Instytucja**: Narodowy Instytut Onkologii

- Formularz .docx do pobrania
- Sposoby: papierowy, elektroniczny, e-mail (lecznictwo@nio.gov.pl), koperta do Kancelarii
- → potwierdza wielokanałowość zgłaszania

---

## 6. Wyszukiwanie: Fundusz Kompensacyjny Zdarzeń Medycznych

### Zapytanie: "Fundusz Kompensacyjny Zdarzeń Medycznych Polska ustawa jakość 2023"

**Źródło**: https://www.gov.pl/web/rpp/podstawowe-informacje3
**Instytucja**: Rzecznik Praw Pacjenta

- Działa od **6 września 2023 r.**
- Zarządzany przez Rzecznika Praw Pacjenta
- Kwoty: max **230 821 PLN** (żywy pacjent), max **115 411 PLN/os.** (zgon, rodzina)
- **Nie wymaga udowodnienia winy** — wystarczy że zdarzenie było możliwe do uniknięcia
- Opłata za wniosek: **348 PLN**
- Termin: 1 rok od uzyskania informacji, max 3 lata od zdarzenia
- Rozpatrzenie: ~3 miesiące + ~2 miesiące opinia biegłych
- Infolinia: **800 190 590** (całodobowo)
- → zapisane w adverse-events-guide.md sekcja 15.13

**Źródło**: https://www.wolterskluwer.com/pl-pl/expert-insights/fundusz-kompensacyjny-zdarzen-medycznych
- Uprawnieni do świadczenia w razie zgonu: dzieci, rodzice, małżonek (nieseparowany), partner
- Od decyzji: odwołanie do Komisji Odwoławczej → sąd administracyjny

---

## 7. Wyszukiwanie: System Monitorowania Zagrożeń (SMZ)

### Zapytanie: "System Monitorowania Zagrożeń SMZ ezdrowie.gov.pl zdarzenia niepożądane"

**Źródło**: https://ezdrowie.gov.pl/portal/home/systemy-it/system-monitorowania-zagrozen/
**Źródło**: https://cez.gov.pl/pl/page/o-nas/aktualnosci/nowy-system-monitorowania-zagrozen-smz2-juz-dostepny

- **SMZ2**: https://smz2.ezdrowie.gov.pl/ (nowa wersja)
- Prowadzony przez Centrum e-Zdrowia
- Kontakt: tel. **19 239**, e-mail: smz-serwis@cez.gov.pl
- Formularze: NDPL1 (pracownicy medyczni), NDPL4 (pacjenci/opiekunowie)
- **Uwaga**: SMZ dotyczy głównie leków i wyrobów medycznych — to osobny system od wewnętrznego WSZJ szpitala
- → zapisane w adverse-events-guide.md sekcja 15.10

---

## 8. Wyszukiwanie: ochrona zgłaszających i RODO

### Zapytanie: "art. 21 22 23 ustawa jakość opieka zdrowotna ochrona zgłaszających"

**Źródło**: https://www.prawo.pl/zdrowie/raportowanie-zdarzen-niepozadanych-zalecenia-i-rekomendacje,519706.html

- Zgłoszenie, analiza RCA, ocena **NIE MOGĄ stanowić podstawy do odpowiedzialności** dyscyplinarnej
- Zakaz działań represyjnych: wypowiedzenie, zmiana warunków, negatywna ocena, pominięcie przy szkoleniach
- Dane zgłaszającego do wyłącznej wiadomości osoby odpowiedzialnej
- **Kontrowersje**: NIL krytykowała niewystarczające gwarancje anonimowości, proponowała zasadę no-fault z odniesieniem do Kodeksu karnego
- → przełożone na zasady #3 i #7 specyfikacji (sekcja 2) i sekcję 14.1 (RODO)

**RODO** (ze strony szpitala we Wrocławiu):
- Podstawa przetwarzania: art. 6(1)(c) RODO + art. 9(2)(i) RODO
- Dane z RCA przechowywane **nie dłużej niż do zakończenia analizy** (art. 23 ust. 6)
- **Źródło**: https://www.szpital.wroc.pl/index.php?c=page&id=285

---

## 9. Wyszukiwanie: istniejące systemy (benchmarking do Fazy 2)

### Zapytanie: "hospital adverse event reporting system software features workflow best practices 2024"

**Źródło**: https://pmc.ncbi.nlm.nih.gov/articles/PMC6220687/
**Tytuł**: "Enhancing Patient Safety Event Reporting: A Systematic Review of System Design Features" (PMC 2018)

Kluczowe features wg adopcji:
- Widgety (dropdown/checkbox/radio) — **85%** systemów
- Hierarchy / conditional logic — **42%**
- Anonimowość — **60%**
- Walidacja pól — **35%**
- Powiadomienia o przeglądzie — **31%**
- Integracja z EHR — **19%**
- → przełożone na formularz wielokrokowy z walidacją i conditional logic w specyfikacji

**Źródło**: https://www.performancehealthus.com/blog/best-incident-reporting-software-in-healthcare
- Formularz < 2 minuty (vs 30 min papierowy)
- Automatic routing wg typu/lokalizacji zdarzenia
- Real-time alerts wg severity
- Multi-device (desktop, tablet, mobile)
- → przełożone na wymagania niefunkcjonalne w specyfikacji (sekcja 15)

**Źródło**: https://www.rldatix.com/en-uki/solution/event-reporting/ (RLDatix/Datix)
- Voice-to-text w mobile
- Zdjęcia jako załączniki
- Built-in RCA (fishbone, 5 Whys)
- Configurable workflows i business logic
- → inspiracja dla modułu RCA i flow statusów

**Źródło**: https://www.england.nhs.uk/patient-safety/patient-safety-insight/learning-from-patient-safety-events/learn-from-patient-safety-events-service/ (NHS LFPSE)
- Zastąpił NRLS (zlikwidowany 30.06.2024)
- Quick forms, draft saving, machine learning do analizy
- Automatyczny upload z lokalnych systemów
- → inspiracja dla prostoty formularza i draft functionality

---

## 10. Wyszukiwanie: monitorowanie i wskaźniki jakości

### Zapytanie: "monitorowanie zdarzeń niepożądanych placówka medyczna"

**Źródło**: https://www.wolterskluwer.com/pl-pl/expert-insights/monitorowanie-zdarzen-niepozadanych

- Monitoring: co miesiąc dla liczby zdarzeń, min. co kwartał dla wskaźników klinicznych
- Analiza RCA: minimum co 6 miesięcy
- Ocena ryzyka: prawdopodobieństwo (4 poziomy) × ciężkość (4 poziomy)
- Wskaźniki ustawowe: zgony, rehospitalizacje, reoperacje, zakażenia szpitalne, średni czas hospitalizacji
- → przełożone na matrycę ryzyka (sekcja 5.3), wskaźniki (sekcja 15.9) i dashboard

---

## Podsumowanie: co z którego źródła trafiło do specyfikacji

| Sekcja specyfikacji | Główne źródło |
|---|---|
| Zasady nadrzędne (no-blame, anonimowość) | PDF KE s. 33-35 + art. 21-23 ustawy |
| Role użytkowników | PDF KE s. 30-32 + art. 18-19 ustawy |
| Definicja ZN | Art. 2 pkt 8 ustawy |
| Katalog kategorii A-X | Szpital Lublin + WHO ICPS + PDF KE s. 49-50 |
| Klasyfikacja ciężkości 0-4 | WHO ICPS + Wolters Kluwer |
| Matryca ryzyka | Wolters Kluwer + PDF KE |
| Flow formularza (6 kroków) | Szpital Chrzanów + PDF KE s. 48-49 |
| Pola formularza | Szpital Chrzanów + PDF KE s. 48-49 |
| Flow obsługi zgłoszenia | PDF KE s. 40 (Rysunek 1) + art. 22, 24 ustawy |
| Flow RCA | PDF KE s. 54-55 (Tabela 9) + art. 19 ustawy |
| Statusy zgłoszenia | Własne na podstawie PDF KE + statusów z ustawy |
| Anonimizacja | PDF KE s. 34-35 + art. 19, 21-23 ustawy |
| RODO | Szpital Wrocław + art. 23 ust. 6 ustawy |
| Dashboard / wykresy | PMC systematic review + RLDatix features |
| Wymagania niefunkcjonalne | Performance Health Partners + NHS LFPSE |
| Fundusz Kompensacyjny | RPP gov.pl + Wolters Kluwer |
