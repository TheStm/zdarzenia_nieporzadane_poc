"""Seed database with example adverse event data for demo purposes."""
import sys
import time
import httpx

API = "http://localhost:8000/api"


def wait_for_api():
    for i in range(30):
        try:
            r = httpx.get(f"{API}/health", timeout=2)
            if r.status_code == 200:
                return True
        except Exception:
            pass
        time.sleep(1)
        print(f"  Czekam na backend... ({i+1}s)")
    return False


def post(path, data):
    r = httpx.post(f"{API}{path}", json=data, timeout=10)
    return r.json()


def patch(path, data):
    r = httpx.patch(f"{API}{path}", json=data, timeout=10)
    return r.json()


def seed():
    print("Seedowanie bazy danych...")

    # --- STYCZEŃ ---
    post("/incidents", {"event_type": "ZN", "event_date": "2026-01-05T08:30:00", "department": "Oddział Chirurgii", "category": "A", "description": "Podczas zabiegu chirurgicznego operowano niewłaściwą stronę ciała pacjenta, błąd wykryto śródoperacyjnie i skorygowano bez powikłań", "severity": 3, "immediate_actions_taken": True, "immediate_actions_desc": "Przerwano zabieg, skorygowano stronę", "reporter_anonymous": False, "reporter_name": "Dr Wiśniewski", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-01-12T14:00:00", "department": "Oddział Wewnętrzny", "category": "B", "description": "Podano podwójną dawkę leku przeciwkrzepliwego heparyny pacjentowi z niewydolnością nerek, wymagało podania protaminy i monitorowania APTT", "severity": 3, "immediate_actions_taken": True, "immediate_actions_desc": "Podano protaminę, monitorowano parametry krzepnięcia", "reporter_anonymous": False, "reporter_name": "Dr Kowalczyk", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "NZN", "event_date": "2026-01-18T10:15:00", "department": "Apteka Szpitalna", "category": "B", "description": "Farmaceuta wykrył błąd w zleceniu lekowym przed wydaniem leku na oddział — zlecono lek o podobnej nazwie ale innym działaniu", "severity": 0, "immediate_actions_taken": True, "immediate_actions_desc": "Skontaktowano się z lekarzem, skorygowano zlecenie", "reporter_anonymous": False, "reporter_name": "Mgr Zielińska", "reporter_role": "Farmaceuta"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-01-25T22:00:00", "department": "SOR", "category": "E", "description": "Pacjent 78 lat upadł w łazience SOR, doszło do złamania kości udowej, pacjent był pod wpływem leków sedacyjnych i nie miał asysty personelu", "severity": 3, "immediate_actions_taken": True, "immediate_actions_desc": "RTG, konsultacja ortopedyczna, zabezpieczenie pacjenta", "reporter_anonymous": False, "reporter_name": "Mgr Dąbrowska", "reporter_role": "Pielęgniarka"})

    # --- LUTY ---
    post("/incidents", {"event_type": "ZN", "event_date": "2026-02-03T11:00:00", "department": "Oddział Kardiologiczny", "category": "C", "description": "Zakażenie odcewnikowe CRBSI u pacjenta z centralnym dostępem żylnym, dodatnie posiewy krwi gronkowiec złocisty, konieczna zmiana antybiotykoterapii", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Usunięto cewnik, pobrano posiewy, włączono wankomycynę", "reporter_anonymous": False, "reporter_name": "Dr Pawlak", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "NZN", "event_date": "2026-02-10T09:30:00", "department": "Blok Operacyjny", "category": "A", "description": "Przed rozpoczęciem operacji zespół chirurgiczny wykrył niezgodność w identyfikacji pacjenta podczas listy kontrolnej WHO, zabieg wstrzymano", "severity": 0, "immediate_actions_taken": True, "immediate_actions_desc": "Wstrzymano zabieg, powtórzono identyfikację", "reporter_anonymous": True})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-02-15T16:45:00", "department": "Oddział Pediatryczny", "category": "B", "description": "Dziecku 4 lata podano antybiotyk w dawce dla dorosłych przez pomyłkę w przeliczeniu dawki na kilogram masy ciała, konieczna obserwacja i nawodnienie", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Nawodnienie dożylne, obserwacja, monitorowanie", "reporter_anonymous": False, "reporter_name": "Dr Majewska", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-02-20T07:00:00", "department": "Oddział Wewnętrzny", "category": "F", "description": "Odleżyna III stopnia na piętach u pacjenta leżącego od 14 dni, brak dokumentacji zmiany pozycji i oceny ryzyka w skali Norton przy przyjęciu", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Konsultacja chirurgiczna, opatrunek specjalistyczny", "reporter_anonymous": False, "reporter_name": "Mgr Kwiatkowska", "reporter_role": "Pielęgniarka"})
    post("/incidents", {"event_type": "NZN", "event_date": "2026-02-25T13:00:00", "department": "Oddział Neurologiczny", "category": "G", "description": "Przed przetoczeniem krwi pielęgniarka wykryła niezgodność grupy krwi między zleceniem a preparatem, przetoczenie wstrzymano", "severity": 0, "immediate_actions_taken": True, "immediate_actions_desc": "Wstrzymano przetoczenie, zamówiono prawidłowy preparat", "reporter_anonymous": False, "reporter_name": "Mgr Adamska", "reporter_role": "Pielęgniarka"})

    # --- MARZEC ---
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-02T10:00:00", "department": "Oddział Chirurgii", "category": "A", "description": "Pozostawiono chustę chirurgiczną w jamie brzusznej podczas operacji resekcji jelita, wykryto na RTG kontrolnym po 3 dniach, konieczna reoperacja", "severity": 4, "immediate_actions_taken": True, "immediate_actions_desc": "Pilna reoperacja, usunięcie ciała obcego", "reporter_anonymous": False, "reporter_name": "Dr Wiśniewski", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-08T19:30:00", "department": "SOR", "category": "H", "description": "Pacjent z ostrym bólem w klatce piersiowej czekał na SOR 4 godziny na badanie troponin z powodu przeciążenia laboratorium, opóźnienie diagnostyki OZW", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Eskalowano do kierownika dyżuru", "reporter_anonymous": True})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-12T06:00:00", "department": "Oddział Anestezjologii i IT", "category": "D", "description": "Awaria pompy infuzyjnej podającej noradrenalinę u pacjenta w szoku septycznym, wykryto po 20 min, spadek ciśnienia do 60/40 mmHg", "severity": 3, "immediate_actions_taken": True, "immediate_actions_desc": "Ręczne podanie leków, wymiana pompy, stabilizacja", "reporter_anonymous": False, "reporter_name": "Dr Jabłoński", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "NZN", "event_date": "2026-03-15T11:00:00", "department": "Izba Przyjęć", "category": "I", "description": "Wykryto zamianę dokumentacji medycznej dwóch pacjentów o podobnych nazwiskach przed podaniem leków, pielęgniarka zauważyła niezgodność", "severity": 0, "immediate_actions_taken": True, "immediate_actions_desc": "Skorygowano dokumentację, powiadomiono lekarza", "reporter_anonymous": False, "reporter_name": "Mgr Nowicka", "reporter_role": "Pielęgniarka"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-18T14:30:00", "department": "Oddział Ortopedyczny", "category": "C", "description": "Zakażenie rany pooperacyjnej po endoprotezoplastyce stawu biodrowego, posiew wykazał MRSA, konieczna reoperacja i długa antybiotykoterapia", "severity": 3, "immediate_actions_taken": True, "immediate_actions_desc": "Posiew, antybiotykoterapia celowana, plan reoperacji", "reporter_anonymous": False, "reporter_name": "Dr Lewandowski", "reporter_role": "Lekarz"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-22T08:00:00", "department": "Oddział Ginekologiczno-Położniczy", "category": "J", "description": "Pacjentka po porodzie doświadczyła epizodu depresyjnego z myślami samobójczymi, nie została objęta konsultacją psychiatryczną mimo czynników ryzyka", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Pilna konsultacja psychiatryczna, nadzór 1:1", "reporter_anonymous": False, "reporter_name": "Mgr Wójcik", "reporter_role": "Położna"})
    post("/incidents", {"event_type": "ZN", "event_date": "2026-03-26T20:00:00", "department": "Oddział Wewnętrzny", "category": "L", "description": "Brak lekarza dyżurnego na oddziale przez 2 godziny z powodu konieczności konsultacji na SOR, brak zastępstwa, pacjent z pogorszeniem stanu", "severity": 2, "immediate_actions_taken": True, "immediate_actions_desc": "Wezwano lekarza z innego oddziału", "reporter_anonymous": True})
    post("/incidents", {"event_type": "NZN", "event_date": "2026-03-29T12:00:00", "department": "Oddział Chirurgii", "category": "K", "description": "Wykryto mokrą podłogę na korytarzu oddziału bez oznakowania ostrzegawczego, personel zabezpieczył teren zanim doszło do upadku pacjenta", "severity": 0, "immediate_actions_taken": True, "immediate_actions_desc": "Ustawiono znaki ostrzegawcze, wytarto podłogę", "reporter_anonymous": True})

    print(f"  Utworzono 18 zgłoszeń")

    # --- Zmiana statusów ---
    patch("/incidents/3/status", {"status": "closed"})
    patch("/incidents/6/status", {"status": "closed"})
    patch("/incidents/9/status", {"status": "closed"})
    patch("/incidents/13/status", {"status": "closed"})
    patch("/incidents/18/status", {"status": "closed"})

    patch("/incidents/2/status", {"status": "in_triage"})
    patch("/incidents/5/status", {"status": "in_analysis"})
    patch("/incidents/7/status", {"status": "in_analysis"})
    patch("/incidents/8/status", {"status": "in_triage"})
    patch("/incidents/16/status", {"status": "in_analysis"})

    # --- RCA: ciało obce w jamie brzusznej (ID=10, severity 4) ---
    patch("/incidents/10/status", {"status": "escalated_rca"})
    post("/incidents/10/rca", {"description": "Analiza zdarzenia pozostawienia chusty chirurgicznej w jamie brzusznej", "team_members": "Dr Wiśniewski, Dr Nowak, Mgr Kowalska"})
    rca10 = httpx.get(f"{API}/incidents/10/rca").json()
    patch(f"/rca/{rca10['id']}", {"status": "in_progress", "root_causes": "Brak liczenia chust przed i po zabiegu, brak RTG kontrolnego śródoperacyjnego, zmęczenie zespołu po 10h dyżurze", "contributing_factors": "Przeciążenie bloku operacyjnego, brak standaryzowanej listy kontrolnej zamknięcia, rotacja personelu", "recommendations": "Wdrożyć obowiązkowe liczenie chust i narzędzi z potwierdzeniem dwóch osób"})
    post(f"/rca/{rca10['id']}/actions", {"description": "Wdrożyć procedurę podwójnego liczenia chust i narzędzi", "responsible_person": "Dr Nowak", "deadline": "2026-04-15"})
    post(f"/rca/{rca10['id']}/actions", {"description": "Zakupić tablice do liczenia narzędzi chirurgicznych", "responsible_person": "Mgr Kowalska", "deadline": "2026-04-30"})
    post(f"/rca/{rca10['id']}/actions", {"description": "Przeszkolić personel bloku operacyjnego z nowej procedury", "responsible_person": "Dr Wiśniewski", "deadline": "2026-05-15"})
    post(f"/rca/{rca10['id']}/actions", {"description": "Wdrożyć obowiązkowy RTG kontrolny przed zamknięciem jamy brzusznej", "responsible_person": "Dr Nowak", "deadline": "2026-04-20"})

    # --- RCA: upadek na SOR (ID=4, severity 3) ---
    patch("/incidents/4/status", {"status": "escalated_rca"})
    post("/incidents/4/rca", {"description": "Analiza upadku pacjenta 78 lat w łazience SOR", "team_members": "Mgr Dąbrowska, Dr Pawlak, Mgr Adamska"})
    rca4 = httpx.get(f"{API}/incidents/4/rca").json()
    patch(f"/rca/{rca4['id']}", {"status": "in_progress", "root_causes": "Brak oceny ryzyka upadku przy przyjęciu na SOR, brak asysty w toalecie u pacjenta z lekami sedacyjnymi", "contributing_factors": "Niedobór personelu na nocnej zmianie, brak protokołu oceny ryzyka upadku na SOR", "recommendations": "Wdrożyć skalę Morse, zamontować poręcze, protokół asysty"})
    post(f"/rca/{rca4['id']}/actions", {"description": "Zamontować poręcze we wszystkich łazienkach SOR", "responsible_person": "Kierownik Techniczny", "deadline": "2026-04-10"})
    post(f"/rca/{rca4['id']}/actions", {"description": "Wdrożyć skalę Morse oceny ryzyka upadku na SOR", "responsible_person": "Mgr Dąbrowska", "deadline": "2026-04-20"})
    post(f"/rca/{rca4['id']}/actions", {"description": "Opracować protokół asysty toaletowej dla pacjentów z sedacją", "responsible_person": "Mgr Adamska", "deadline": "2026-04-15"})

    # --- RCA: MRSA po endoprotezoplastyce (ID=14, severity 3) — zakończona ---
    patch("/incidents/14/status", {"status": "escalated_rca"})
    post("/incidents/14/rca", {"description": "Analiza zakażenia MRSA po endoprotezoplastyce stawu biodrowego", "team_members": "Dr Lewandowski, Epidemiolog, Mgr Nowicka"})
    rca14 = httpx.get(f"{API}/incidents/14/rca").json()
    patch(f"/rca/{rca14['id']}", {"status": "completed", "root_causes": "Nosicielstwo MRSA u pacjenta nie wykryte przed zabiegiem, brak badania przesiewowego", "contributing_factors": "Brak rutynowego screeningu MRSA przed planowymi zabiegami ortopedycznymi", "recommendations": "Wdrożyć obowiązkowy screening MRSA przed planowymi operacjami ortopedycznymi"})
    a1 = post(f"/rca/{rca14['id']}/actions", {"description": "Wdrożyć obowiązkowy screening MRSA", "responsible_person": "Epidemiolog", "deadline": "2026-04-01"})
    patch(f"/actions/{a1['id']}", {"status": "completed", "completion_notes": "Wdrożono screening MRSA od 1 kwietnia"})
    post(f"/rca/{rca14['id']}/actions", {"description": "Audyt protokołu antybiotykoprofilaktyki", "responsible_person": "Dr Lewandowski", "deadline": "2026-04-15"})

    # --- RCA: awaria pompy IT (ID=12) — szkic ---
    patch("/incidents/12/status", {"status": "escalated_rca"})
    post("/incidents/12/rca", {"description": "Analiza awarii pompy infuzyjnej na OIT", "team_members": "Dr Jabłoński, Technik Medyczny"})

    print("  Utworzono 4 analizy RCA z działaniami naprawczymi")
    print("Seedowanie zakończone!")


if __name__ == "__main__":
    if not wait_for_api():
        print("BŁĄD: Backend nie odpowiada!")
        sys.exit(1)
    seed()
