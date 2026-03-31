# Specyfikacja systemu raportowania zdarzeń niepożądanych
## Dokument projektowy — od zera do działającego systemu

---

## 1. Cel systemu

System umożliwia **zgłaszanie, klasyfikację, analizę i wyciąganie wniosków** ze zdarzeń niepożądanych (ZN) w szpitalach.

**Nie jest celem**:
- Wyszukiwanie winnych
- Postępowanie dyscyplinarne
- Gromadzenie statystyk dla statystyk

**Jest celem**:
- Identyfikacja ryzyk systemowych
- Zapobieganie powtarzalnym zdarzeniom
- Spełnienie wymogów ustawy o jakości (Dz.U. 2023 poz. 1692)
- Budowanie kultury bezpieczeństwa (no-blame)

---

## 2. Zasady nadrzędne

Te zasady muszą przenikać każdy ekran i każdą decyzję projektową:

| # | Zasada | Implikacja dla systemu |
|---|--------|----------------------|
| 1 | **Prostota zgłoszenia** | Formularz < 2 minuty do wypełnienia, minimum pól wymaganych |
| 2 | **Anonimowość opcjonalna** | Zgłaszający sam decyduje czy się ujawnić; system działa w obu trybach |
| 3 | **Brak sankcji** | Żadne dane z systemu nie mogą być użyte dyscyplinarnie (art. 21-23 ustawy) |
| 4 | **Informacja zwrotna** | Zgłaszający MUSI dostać feedback — bez tego system zamiera |
| 5 | **Oddzielenie od skarg** | System ZN to nie jest system skarg pacjentów ani postępowanie prawne |
| 6 | **Analiza systemowa** | Szukamy przyczyn w systemie (procesy, organizacja), nie w osobach |
| 7 | **Poufność danych** | RODO, szyfrowanie, kontrola dostępu, automatyczna anonimizacja |

---

## 3. Użytkownicy (role)

### 3.1. Zgłaszający — personel medyczny
- Lekarze, pielęgniarki, ratownicy, farmaceuci
- Personel techniczny, administracyjny, salowe
- **Każdy pracownik** szpitala może zgłosić ZN (art. 18 ustawy)

### 3.2. Zgłaszający — pacjent / rodzina
- Pacjent, rodzic/opiekun, osoba bliska, świadek
- **Oddzielny, uproszczony formularz** — bez terminologii medycznej
- Może zgłosić anonimowo

### 3.3. Koordynator ds. jakości (Case Handler)
- Osoba na poziomie oddziału/szpitala prowadząca sprawę
- Przyjmuje zgłoszenie, dokonuje wstępnej klasyfikacji
- Przeprowadza lub zleca analizę
- Daje informację zwrotną zgłaszającemu

### 3.4. Kierownik podmiotu (Dyrektor)
- Odpowiedzialny ustawowo za WSZJ (art. 19)
- Zatwierdza plany działań naprawczych
- Powołuje zespoły RCA
- Zapewnia anonimizację i tajemnicę tożsamości zgłaszającego

### 3.5. Zespół RCA
- Powoływany ad hoc do analizy zdarzeń wysokiego ryzyka
- Prowadzi Root Cause Analysis
- Tworzy raport z rekomendacjami

### 3.6. Administrator systemu
- Zarządzanie użytkownikami i uprawnieniami
- Konfiguracja formularzy, kategorii, workflow
- Raporty i eksport danych

---

## 4. Definicja zdarzenia niepożądanego

System przyjmuje szeroką definicję zgodną z ustawą (art. 2 pkt 8):

> Zdarzenie zaistniałe w trakcie udzielania lub w efekcie udzielenia bądź zaniechania udzielenia świadczenia opieki zdrowotnej, powodujące lub mogące spowodować negatywny skutek dla zdrowia lub życia pacjenta.

**Trzy typy zdarzeń w systemie**:

| Typ | Kod | Opis | Ikona |
|-----|-----|------|-------|
| Zdarzenie ze szkodą | ZN | Zdarzenie dotarło do pacjenta i wyrządziło szkodę | Czerwony |
| Zdarzenie bez szkody | ZN-0 | Zdarzenie dotarło do pacjenta, ale nie wyrządziło szkody | Pomarańczowy |
| Zdarzenie niedoszłe (near-miss) | NZN | Zapobieżone przed dotarciem do pacjenta | Żółty |

---

## 5. Katalog kategorii zdarzeń

### 5.1. Kategorie główne (do wyboru w formularzu)

| Kod | Kategoria | Przykłady |
|-----|-----------|-----------|
| **A** | Procedury kliniczne | Błędna identyfikacja pacjenta, operacja złej strony, ciało obce w polu operacyjnym, błąd diagnostyczny |
| **B** | Farmakoterapia | Zły lek, zła dawka, zła droga podania, zły czas, lek pacjenta z alergią |
| **C** | Zakażenia szpitalne | Zakażenie miejsca operowanego, sepsa, zakażenie odcewnikowe |
| **D** | Sprzęt medyczny | Awaria, brak dostępności, wadliwe działanie, brak przeglądu technicznego |
| **E** | Upadki pacjentów | Upadek z łóżka, upadek w łazience, upadek na korytarzu |
| **F** | Odleżyny | Odleżyny powstałe w trakcie hospitalizacji |
| **G** | Krew i preparaty krwiopochodne | Błędna identyfikacja, niewłaściwa jednostka, reakcja poprzetoczeniowa |
| **H** | Opieka nad pacjentem | Niedostarczenie opieki, opóźnienie leczenia, zaniedbanie |
| **I** | Dokumentacja | Błąd w dokumentacji, brak dokumentacji, zamiana dokumentacji |
| **J** | Samouszkodzenie / zachowanie | Próba samobójcza, agresja, samowolne opuszczenie oddziału |
| **K** | Infrastruktura / środowisko | Śliska podłoga, wadliwe oświetlenie, brak barierek |
| **L** | Organizacja pracy | Braki kadrowe, przeciążenie, brak procedur, błąd komunikacji |
| **M** | Prawa pacjenta | Brak informacji, brak zgody, naruszenie tajemnicy, dyskryminacja |
| **X** | Inne | Zdarzenie niekwalifikujące się do powyższych kategorii |

### 5.2. Klasyfikacja ciężkości skutku

| Poziom | Nazwa | Opis | Kolor |
|--------|-------|------|-------|
| **0** | Brak szkody | Zdarzenie nie dotarło do pacjenta (near-miss) | Szary |
| **1** | Minimalna | Bez interwencji lub minimalna interwencja, bez przedłużenia pobytu | Zielony |
| **2** | Umiarkowana | Wymagana interwencja kliniczna, przedłużenie hospitalizacji | Żółty |
| **3** | Poważna | Trwały uszczerbek, zagrożenie życia, reoperacja | Pomarańczowy |
| **4** | Krytyczna | Trwała niepełnosprawność lub zgon | Czerwony |

### 5.3. Matryca ryzyka (ciężkość x prawdopodobieństwo)

```
Prawdopodobieństwo →  Rzadkie   Mało prawd.  Możliwe  Prawdopodobne  Prawie pewne
Ciężkość ↓             (1)         (2)         (3)        (4)           (5)
──────────────────────────────────────────────────────────────────────────────────
Minimalna (1)         NISKIE     NISKIE      NISKIE    ŚREDNIE       ŚREDNIE
Umiarkowana (2)       NISKIE     ŚREDNIE     ŚREDNIE   WYSOKIE       WYSOKIE
Poważna (3)           ŚREDNIE    ŚREDNIE     WYSOKIE   WYSOKIE       KRYTYCZNE
Krytyczna (4)         ŚREDNIE    WYSOKIE     WYSOKIE   KRYTYCZNE     KRYTYCZNE
```

**Konsekwencje klasyfikacji ryzyka**:
- **NISKIE** → rejestracja + analiza lokalna przez koordynatora
- **ŚREDNIE** → analiza lokalna + raport do kierownika
- **WYSOKIE** → obligatoryjna analiza RCA przez zespół (art. 22, 24 ustawy)
- **KRYTYCZNE** → natychmiastowa analiza RCA + powiadomienie kierownika + raport do organu nadrzędnego

---

## 6. Flow użytkownika — zgłaszanie zdarzenia

### 6.1. Flow: personel medyczny

```
[1] Zaloguj się / wybierz "Zgłoś anonimowo"
          ↓
[2] Ekran: Typ zdarzenia
    ○ Zdarzenie ze szkodą (ZN)
    ○ Zdarzenie bez szkody (ZN-0)
    ○ Zdarzenie niedoszłe (NZN)
          ↓
[3] Ekran: Kiedy i gdzie
    - Data zdarzenia (domyślnie: dzisiaj)
    - Godzina (przybliżona)
    - Oddział (dropdown z listy oddziałów szpitala)
    - Lokalizacja: sala / korytarz / łazienka / blok op. / SOR / inne
          ↓
[4] Ekran: Co się wydarzyło
    - Kategoria zdarzenia (dropdown z katalogu A-X)
    - Podkategoria (dynamicznie — na podstawie wybranej kategorii)
    - Opis słowny (pole tekstowe, min. 50 znaków)
      [placeholder: "Opisz co się wydarzyło, w jakich okolicznościach,
       co mogło się przyczynić"]
          ↓
[5] Ekran: Skutki i działania
    - Ciężkość skutku (0-4, radio buttons z opisem)
    - Czy podjęto działania natychmiastowe? Tak/Nie
      → jeśli Tak: opisz jakie (pole tekstowe)
    - Proponowane działania zapobiegawcze (opcjonalne, pole tekstowe)
          ↓
[6] Ekran: Dane pacjenta (opcjonalne)
    - Wiek pacjenta (liczba lub przedział)
    - Płeć
    - Numer księgi głównej (opcjonalne, do celów wewnętrznych)
    [Info: "Dane pacjenta służą wyłącznie do analizy zdarzenia
     i zostaną zanonimizowane"]
          ↓
[7] Ekran: Podsumowanie
    - Przegląd wszystkich wprowadzonych danych
    - Checkbox: "Potwierdzam, że opis jest zgodny z prawdą"
    - [Wyślij zgłoszenie]
          ↓
[8] Ekran: Potwierdzenie
    - "Zgłoszenie przyjęte. Numer: ZN-2026-0042"
    - "Koordynator ds. jakości zostanie powiadomiony"
    - Jeśli niezanonimizowane: "Otrzymasz informację zwrotną"
    - Link: "Śledź status zgłoszenia" (jeśli zalogowany)
```

### 6.2. Flow: pacjent / rodzina

```
[1] Strona publiczna szpitala → "Zgłoś zdarzenie"
    (nie wymaga logowania)
          ↓
[2] Ekran: Kim jesteś
    ○ Pacjent
    ○ Rodzic / opiekun
    ○ Osoba bliska
    ○ Świadek
    - Dane kontaktowe (OPCJONALNE — można pominąć = anonimowe)
          ↓
[3] Ekran: Co się wydarzyło
    - Oddział (dropdown lub "nie wiem")
    - Data (przybliżona)
    - Opis zdarzenia (duże pole tekstowe)
      [placeholder: "Opisz swoimi słowami co się wydarzyło.
       Nie musisz używać terminów medycznych."]
          ↓
[4] Ekran: Jak to wpłynęło
    - Czy doznał/a Pan/i szkody? Tak / Nie / Nie wiem
    - Czy chce Pan/i, aby szpital się z Panią/Panem skontaktował?
      Tak / Nie
      → jeśli Tak: podaj e-mail lub telefon
          ↓
[5] Ekran: Podsumowanie + [Wyślij]
          ↓
[6] Ekran: Potwierdzenie
    - "Dziękujemy za zgłoszenie. Każde zgłoszenie pomaga nam
       poprawić bezpieczeństwo."
    - Info o Funduszu Kompensacyjnym (jeśli szkoda):
      "Jeśli doznał/a Pan/i szkody, może Pan/i ubiegać się
       o świadczenie kompensacyjne: gov.pl/web/rpp, tel. 800 190 590"
```

---

## 7. Flow: obsługa zgłoszenia (koordynator)

```
[1] NOWE ZGŁOSZENIE WPŁYWA
    → powiadomienie (e-mail / push / dashboard)
    → automatyczna wstępna klasyfikacja ryzyka (ciężkość x typ)
          ↓
[2] TRIAGE (< 24h od wpłynięcia)
    Koordynator przegląda zgłoszenie:
    - Weryfikuje/koryguje kategorię
    - Weryfikuje/koryguje ciężkość
    - Przypisuje prawdopodobieństwo → system wylicza poziom ryzyka
    - Decyzja:
      ○ NISKIE → rejestracja, monitoring trendów
      ○ ŚREDNIE → analiza lokalna, raport
      ○ WYSOKIE/KRYTYCZNE → eskalacja do kierownika, powołanie zespołu RCA
          ↓
[3] ANALIZA
    A) Zdarzenia NISKIE/ŚREDNIE:
       - Koordynator analizuje sam lub z zespołem oddziału
       - Metoda: 5 × Dlaczego / prosta analiza przyczynowa
       - Dokumentuje wnioski w systemie

    B) Zdarzenia WYSOKIE/KRYTYCZNE:
       - Kierownik powołuje zespół RCA (art. 24)
       - Zespół prowadzi pełną analizę przyczyn źródłowych
       - Narzędzia: Ishikawa, 5 Why, FMEA
       - Termin: do 45 dni roboczych
       - Raport RCA w systemie
          ↓
[4] PLAN DZIAŁAŃ NAPRAWCZYCH
    - Koordynator / zespół RCA proponuje działania
    - Kierownik zatwierdza plan
    - Każde działanie ma: opis, osobę odpowiedzialną, termin
    - System śledzi realizację
          ↓
[5] ZAMKNIĘCIE
    - Wszystkie działania zrealizowane → zamknięcie sprawy
    - Informacja zwrotna do zgłaszającego (jeśli niezanonimizowany):
      "Dziękujemy za zgłoszenie ZN-2026-0042. Podjęte działania: [...]"
    - Anonimizacja danych osobowych (automatyczna po zamknięciu)
          ↓
[6] MONITORING
    - Zdarzenie wchodzi do bazy analitycznej (zanonimizowane)
    - Zasilanie dashboardów i raportów
    - Okresowy przegląd trendów (min. co miesiąc)
```

---

## 8. Flow: analiza RCA (zdarzenia wysokiego ryzyka)

```
[1] Kierownik powołuje zespół RCA w systemie
    - Wybiera członków (min. 3 osoby: ekspert kliniczny,
      koordynator, przedstawiciel kierownictwa)
    - System tworzy "sprawę RCA" powiązaną ze zgłoszeniem
          ↓
[2] Zespół zbiera informacje
    - Przegląd dokumentacji medycznej
    - Wywiady z personelem (notatki w systemie)
    - Oś czasu zdarzenia (timeline builder w systemie)
          ↓
[3] Analiza przyczyn
    - Diagram Ishikawy (opcjonalne narzędzie w systemie)
    - 5 × Dlaczego
    - Identyfikacja czynników: ludzki / organizacyjny / techniczny / środowiskowy
          ↓
[4] Raport RCA
    - Opis zdarzenia
    - Oś czasu
    - Zidentyfikowane przyczyny źródłowe
    - Czynniki przyczyniające się
    - Rekomendacje (działania naprawcze)
    - Raport jest ANONIMIZOWANY (art. 19 — obowiązek kierownika)
          ↓
[5] Zatwierdzenie i wdrożenie
    - Kierownik zatwierdza raport i plan działań
    - System generuje zadania z terminami
    - Monitoring realizacji
```

---

## 9. Pola formularza — specyfikacja techniczna

### 9.1. Formularz personelu medycznego

| Pole | Typ | Wymagane | Uwagi |
|------|-----|----------|-------|
| `event_type` | radio | TAK | ZN / ZN-0 / NZN |
| `event_date` | date | TAK | Domyślnie dzisiaj, max dzisiaj |
| `event_time` | time | NIE | Przybliżona godzina |
| `department_id` | select | TAK | Dropdown oddziałów |
| `location` | select | NIE | Sala / korytarz / łazienka / blok op. / SOR / inne |
| `category` | select | TAK | Kod A-X z katalogu |
| `subcategory` | select | NIE | Dynamicznie na podstawie category |
| `description` | textarea | TAK | Min. 50 znaków, max 5000 |
| `severity` | radio | TAK | 0-4 z opisami |
| `immediate_actions_taken` | boolean | TAK | Tak/Nie |
| `immediate_actions_desc` | textarea | warunkowo | Wymagane jeśli actions_taken=Tak |
| `preventive_suggestions` | textarea | NIE | Opcjonalne |
| `patient_age` | number | NIE | Lub przedział wiekowy |
| `patient_sex` | select | NIE | K / M / Inne |
| `patient_id_internal` | text | NIE | Nr księgi, nie przesyłany poza szpital |
| `reporter_anonymous` | boolean | TAK | Domyślnie: Nie |
| `reporter_name` | text | warunkowo | Ukryte jeśli anonymous=Tak |
| `reporter_role` | select | NIE | Lekarz / pielęgniarka / technik / admin / inny |

### 9.2. Formularz pacjenta / rodziny

| Pole | Typ | Wymagane | Uwagi |
|------|-----|----------|-------|
| `reporter_type` | radio | TAK | Pacjent / rodzic / osoba bliska / świadek |
| `reporter_contact` | text | NIE | E-mail lub telefon |
| `department_name` | select + "nie wiem" | NIE | |
| `event_date_approx` | date | NIE | "Przybliżona data" |
| `description` | textarea | TAK | Min. 30 znaków, bez limitu terminologii |
| `harm_occurred` | radio | TAK | Tak / Nie / Nie wiem |
| `wants_contact` | boolean | NIE | Czy chce odpowiedzi zwrotnej |

### 9.3. Pola koordynatora (uzupełniane po triage)

| Pole | Typ | Wymagane | Uwagi |
|------|-----|----------|-------|
| `verified_category` | select | TAK | Może skorygować kategorię zgłaszającego |
| `verified_severity` | radio | TAK | Może skorygować |
| `probability` | select | TAK | 1-5 (rzadkie → prawie pewne) |
| `risk_level` | auto | - | Wyliczane automatycznie z matrycy |
| `triage_decision` | select | TAK | Rejestracja / analiza lokalna / RCA / eskalacja |
| `assigned_to` | user_select | warunkowo | Jeśli eskalacja |
| `root_causes` | multi_select + text | NIE | Czynniki: ludzki / org. / techniczny / środowiskowy |
| `action_plan` | repeater | warunkowo | Lista działań z osobą odpowiedzialną i terminem |
| `feedback_to_reporter` | textarea | TAK przy zamknięciu | Treść informacji zwrotnej |
| `anonymization_status` | auto | - | Automatycznie po zamknięciu sprawy |

---

## 10. Logika biznesowa — reguły

### 10.1. Automatyczne powiadomienia

| Zdarzenie | Kto otrzymuje | Kanał | Termin |
|-----------|---------------|-------|--------|
| Nowe zgłoszenie | Koordynator ds. jakości | E-mail + push | Natychmiast |
| Ciężkość ≥ 3 (poważna) | Koordynator + Kierownik | E-mail + SMS | Natychmiast |
| Ciężkość = 4 (krytyczna/zgon) | Kierownik + Dyrektor | E-mail + SMS + telefon | Natychmiast |
| Brak triage > 24h | Koordynator | Przypomnienie | 24h od zgłoszenia |
| Brak zamknięcia > 30 dni | Koordynator + Kierownik | Przypomnienie | Co 7 dni |
| Termin działania naprawczego | Osoba odpowiedzialna | E-mail | 3 dni przed terminem |
| Przekroczenie terminu | Kierownik | E-mail | Natychmiast |
| Zamknięcie sprawy | Zgłaszający (jeśli znany) | E-mail | Po zamknięciu |

### 10.2. Automatyczna wstępna klasyfikacja ryzyka

Na podstawie `event_type` i `severity` system sugeruje poziom ryzyka:
- `NZN` (near-miss) + severity 0 → **NISKIE**
- `ZN-0` (bez szkody) + severity 0-1 → **NISKIE**
- `ZN` + severity 1 → **ŚREDNIE**
- `ZN` + severity 2 → **ŚREDNIE** (do weryfikacji)
- `ZN` + severity 3 → **WYSOKIE** (RCA sugerowane)
- `ZN` + severity 4 → **KRYTYCZNE** (RCA obowiązkowe)

Koordynator może zmienić po triage.

### 10.3. Automatyczna anonimizacja

- **Przy zamknięciu sprawy**: dane osobowe zgłaszającego usuwane z pól widocznych
- **Po 14 dniach od zamknięcia**: automatyczne usunięcie danych identyfikujących z pól tekstowych (imiona, nazwiska, numery — NLP/regex)
- **Dane pacjenta**: nr księgi głównej usuwany przy eksporcie na poziom centralny
- **Raport RCA**: zawsze w wersji zanonimizowanej (art. 19)

### 10.4. Eskalacja

```
IF risk_level = "KRYTYCZNE" AND triage_decision IS NULL AND hours_since_report > 4:
    → automatyczne powiadomienie Kierownika
    → status zmieniony na "Wymaga natychmiastowej uwagi"

IF risk_level = "WYSOKIE" AND rca_team IS NULL AND days_since_triage > 3:
    → przypomnienie do Kierownika o powołaniu zespołu RCA

IF action_plan.any(deadline < today AND status != "completed"):
    → powiadomienie osoby odpowiedzialnej + kierownika
```

### 10.5. Walidacja formularza

```
- description.length >= 50 → komunikat: "Opis jest zbyt krótki.
  Podaj więcej szczegółów, aby umożliwić analizę."
- event_date <= today → "Data zdarzenia nie może być w przyszłości"
- IF immediate_actions_taken = true AND immediate_actions_desc.empty:
    → "Opisz jakie działania podjęto"
- IF severity >= 3 AND description.length < 100:
    → ostrzeżenie: "Przy poważnym zdarzeniu zalecamy bardziej szczegółowy opis"
```

---

## 11. Dashboard i raporty

### 11.1. Dashboard koordynatora

- **Nowe zgłoszenia** (nieprzejrzane) — licznik z kolorami wg ciężkości
- **W trakcie analizy** — lista z terminami
- **Przeterminowane** — czerwone alerty
- **Działania naprawcze** — status realizacji (todo / w toku / zrobione)
- **Trend**: wykres liczby zgłoszeń / miesiąc (12 miesięcy)

### 11.2. Dashboard kierownika

- **Podsumowanie**: łączna liczba ZN w bieżącym miesiącu/kwartale
- **Matryca ryzyka**: heatmapa (ciężkość x prawdopodobieństwo)
- **Top 5 kategorii** — ranking najczęstszych typów zdarzeń
- **Porównanie oddziałów** — wykres słupkowy
- **RCA w toku** — lista otwartych analiz
- **Wskaźniki ustawowe**: zgony, rehospitalizacje, reoperacje, zakażenia (art. 18)

### 11.3. Raporty okresowe

| Raport | Częstotliwość | Odbiorca |
|--------|-------------|----------|
| Miesięczny przegląd ZN | Co miesiąc | Zespół ds. Jakości |
| Kwartalny raport jakości | Co kwartał | Kierownik, NFZ |
| Analiza trendów roczna | Co rok | Zarząd szpitala |
| Raport RCA | Po zamknięciu każdego RCA | Kierownik |

Raporty zawierają **wyłącznie dane zanonimizowane**.

---

## 12. Statusy zgłoszenia (maszyna stanów)

```
[Nowe] → [W triage] → [W analizie] → [Plan działań] → [Wdrażanie] → [Zamknięte]
                ↓                              ↓
          [Odrzucone]                   [Eskalowane do RCA]
          (nie jest ZN)                        ↓
                                    [RCA w toku] → [RCA zakończone]
                                                         ↓
                                                   [Plan działań] → [Zamknięte]
```

| Status | Opis | Kto zmienia |
|--------|------|-------------|
| **Nowe** | Wpłynęło, czeka na przegląd | System (auto) |
| **W triage** | Koordynator weryfikuje | Koordynator |
| **Odrzucone** | Nie jest ZN (np. skarga, pomyłka) | Koordynator (z uzasadnieniem) |
| **W analizie** | Trwa analiza przyczyn | Koordynator |
| **Eskalowane do RCA** | Powołano zespół RCA | Kierownik |
| **RCA w toku** | Zespół prowadzi analizę | Zespół RCA |
| **RCA zakończone** | Raport gotowy | Zespół RCA |
| **Plan działań** | Zatwierdzone działania naprawcze | Kierownik |
| **Wdrażanie** | Działania w realizacji | Osoby odpowiedzialne |
| **Zamknięte** | Wszystko zrealizowane, feedback wysłany | Koordynator |

---

## 13. Uprawnienia (RBAC)

| Akcja | Zgłaszający | Pacjent | Koordynator | Kierownik | Zespół RCA | Admin |
|-------|:-----------:|:-------:|:-----------:|:---------:|:----------:|:-----:|
| Utworzenie zgłoszenia | x | x | x | x | | |
| Podgląd swoich zgłoszeń | x | ograniczony | | | | |
| Podgląd wszystkich zgłoszeń | | | x (swój oddział) | x (cały szpital) | x (przypisane) | x |
| Triage / klasyfikacja | | | x | x | | |
| Edycja zgłoszenia | | | x | x | | |
| Powołanie zespołu RCA | | | | x | | |
| Tworzenie raportu RCA | | | | | x | |
| Zatwierdzenie planu działań | | | | x | | |
| Zamknięcie sprawy | | | x | x | | |
| Podgląd danych osobowych zgłaszającego | | | x (ograniczony) | x | | |
| Eksport danych | | | | x | | x |
| Zarządzanie użytkownikami | | | | | | x |
| Konfiguracja systemu | | | | | | x |

**Uwaga**: dane tożsamości zgłaszającego widoczne TYLKO dla koordynatora i kierownika, i tylko w kontekście konkretnej sprawy (art. 19 ustawy).

---

## 14. Wymagania bezpieczeństwa i zgodności

### 14.1. RODO
- Podstawa przetwarzania: art. 6(1)(c) RODO — obowiązek prawny, art. 9(2)(i) — interes publiczny w zdrowiu
- Dane osobowe zgłaszającego: przechowywane max do zamknięcia sprawy, potem automatycznie usuwane
- Dane z RCA: przechowywane nie dłużej niż do zakończenia analizy (art. 23 ust. 6 ustawy)
- Prawo dostępu: zgłaszający może sprawdzić status swojego zgłoszenia
- Rejestr czynności przetwarzania: prowadzony w systemie

### 14.2. Bezpieczeństwo techniczne
- Szyfrowanie danych w spoczynku (AES-256) i w tranzycie (TLS 1.3)
- Logowanie przez SSO szpitala lub login/hasło + MFA
- Audit log: każda operacja (kto, kiedy, co) logowana i niemodyfikowalna
- Backup: codzienny, szyfrowany
- Retencja danych: zanonimizowane dane analityczne — bez limitu; dane osobowe — wg reguł anonimizacji
- Role-based access control (sekcja 13)

### 14.3. Zgodność z ustawą o jakości
- System realizuje wymogi art. 18 ust. 2 pkt 5 (monitorowanie ZN)
- Anonimizacja RCA — art. 19
- Ochrona tożsamości zgłaszającego — art. 19, 21-23
- Badania opinii pacjentów — mogą być modułem dodatkowym (art. 20)

---

## 15. Wymagania niefunkcjonalne

| Wymaganie | Wartość docelowa |
|-----------|-----------------|
| Czas załadowania formularza | < 2s |
| Czas wypełnienia formularza (personel) | < 2 minuty |
| Czas wypełnienia formularza (pacjent) | < 3 minuty |
| Dostępność systemu | 99,5% (z wyłączeniem planowanych okien serwisowych) |
| Responsywność | Desktop + tablet + telefon |
| Obsługiwane przeglądarki | Chrome, Firefox, Edge, Safari (2 ostatnie wersje) |
| Język | Polski (z możliwością dodania EN) |
| Minimalny sprzęt w placówce | 1 komputer z dostępem do internetu |
| Czas powiadomienia o zdarzeniu krytycznym | < 5 minut |
| Maksymalna liczba użytkowników | Bez limitu (multi-tenant) |

---

## 16. Integracje (opcjonalne, faza 2+)

| System | Cel integracji |
|--------|---------------|
| HIS / EHR szpitala | Auto-uzupełnianie danych pacjenta, listy oddziałów |
| Active Directory / LDAP | SSO, zarządzanie użytkownikami |
| SMZ (ezdrowie.gov.pl) | Eksport zdarzeń dot. leków/wyrobów medycznych |
| E-mail / SMS gateway | Powiadomienia |
| BI / Power BI | Zaawansowane analizy |

---

## 17. MVP — zakres minimalny

Aby system był użyteczny od dnia 1, wystarczy:

### Faza 1 (MVP)
- [x] Formularz zgłoszenia (personel) — 7 ekranów
- [x] Formularz zgłoszenia (pacjent) — 5 ekranów
- [x] Panel koordynatora: lista zgłoszeń, triage, zmiana statusu
- [x] Powiadomienia e-mail (nowe zgłoszenie, przypomnienia)
- [x] Dashboard: liczniki, trend miesięczny
- [x] Statusy zgłoszenia z flow
- [x] Eksport do CSV/PDF

### Faza 2
- [ ] Moduł RCA (timeline, Ishikawa, raport)
- [ ] Plan działań naprawczych z tracking
- [ ] Dashboard kierownika z matrycą ryzyka
- [ ] Raporty okresowe (kwartalny, roczny)
- [ ] Automatyczna anonimizacja NLP

### Faza 3
- [ ] Integracja HIS / SSO
- [ ] Eksport do SMZ
- [ ] Aplikacja mobilna / PWA
- [ ] Moduł badania opinii pacjentów (art. 20)
- [ ] Multi-tenant (wiele szpitali)

---

## Źródła wykorzystane w specyfikacji

- Ustawa z 16.06.2023 o jakości w opiece zdrowotnej (Dz.U. 2023 poz. 1692) — https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230001692
- Sprawozdanie PSQCWG Komisji Europejskiej, maj 2014 — załączony PDF
- WHO ICPS Conceptual Framework 2009 — https://pmc.ncbi.nlm.nih.gov/articles/PMC2638755/
- Enhancing Patient Safety Event Reporting: Systematic Review (PMC 2018) — https://pmc.ncbi.nlm.nih.gov/articles/PMC6220687/
- Features That Define the Best Incident Reporting Software — https://www.performancehealthus.com/blog/best-incident-reporting-software-in-healthcare
- NHS LFPSE Service — https://www.england.nhs.uk/patient-safety/patient-safety-insight/learning-from-patient-safety-events/learn-from-patient-safety-events-service/
- RLDatix Event Reporting — https://www.rldatix.com/en-uki/solution/event-reporting/
- Katalog ZN Szpital Lublin — https://www.szpital.lublin.pl/katalog-zdarzen-niepozadanch.html
- Formularz ZN Szpital Chrzanów — https://www.szpital-chrzanow.pl/formularz-zdarzenia
- Fundusz Kompensacyjny RPP — https://www.gov.pl/web/rpp/podstawowe-informacje3
- Monitorowanie ZN Wolters Kluwer — https://www.wolterskluwer.com/pl-pl/expert-insights/monitorowanie-zdarzen-niepozadanych
