#punctuality plan

##Open Data

**Dokumentation der Semesteraufgabe
Visualisierung der Durchschnittsverspätung für Tram und Bus
SoSe 2014**
				
###Teammitglieder:
Stefan Keil, Manuel Reich, Anna Münster, Markus Arendt, Fee Braun

###Website: 
http://puncplan.canopus.uberspace.de





##Einleitung

Die Semesteraufgabe des Wahlpflichfaches Open Data sieht vor, dass eine Anwendung geschrieben werden soll, bei der offene Daten verarbeitet werden. Hierzu soll Open Source Software verwendet werden.
Unser erster Gedanke war es die Verspätungen der BVG zu visualisieren, da es uns interessiert hat, ob wir wirklich auf hohem Niveau meckern oder die BVG generell eher pünktlich ist. Hierfür gibt es offene Daten, die beinhalten welche Haltestelle um wieviel Uhr von welcher Linie angefahren wird und zwar mit Echtzeitdaten.
Nutzergruppe

Die Nutzergruppe unserer Anwendung sind alle Leute, die Bahnfahren, welche die durchschnittliche Verspätung auf der Linie, die von ihnen oft genutzt wird, wissen wollen oder einfach Interesse an Verspätungen haben und sich informieren wollen.

Vor allem interessiert uns dieses Thema selbst und wir würden gerne wissen, ob bestimmte Linien immer zu spät kommen oder ob es eventuell eher an bestimmten Wochen liegt. 

##Auswahl der Daten

Die Datenquelle haben wir vor allem nach Qualität der Schnittstelle ausgewählt. Wir haben uns vorher keine großen Gedanken über die Datenmenge gemacht und wie wir die Daten speichern. Dies sollte sich später als etwas problematisch herausstellen.

Am Anfang des Projektes stellten wir uns die Frage welche Api wir für die Datenermittlung nutzen wollen. Zum einem die VBB-Live-APi, welche nur XML Daten zurück liefert und dazu relativ schlecht dokumentiert ist, oder einen Wrapper für die VBB-APi welcher uns besser lesbare Json Files zurückgibt. 

Die Entscheidung für die letztere Variante fiel relativ einstimmig und somit begonnen wir recht schnell mit Ruby on Rails, einen Crawler zu erstellen der auf Heroku lief, und alle 10 Minuten (via Cronjob) eine Anfrage an die Api machte und anschließend den Response in unsere Datenbank schrieb. Dieser Prozess lief ungefähr 2 Monate, wir wollten viele Daten Sammeln um eine aussagekräftige Statistik erstellen zu können. Während der Datensammlungsphase arbeiteten wir parallel am Auswertungsalgorythmus. Diesen mussten wir allerdings das ein oder andere Mal wie bereits erwähnt wegen einigen Problemen unterbrechen.

Unser größtes Problem zu diesem Zeitpunkt war, dass unsere Datenbank bei Heroku relativ schnell wuchs, was sich Heroku gut bezahlen ließ. Unsere temporäre Lösung war bis jetzt gecrawlte Daten lokal zu speichern und zu einem späteren Zeitpunkt auszuwerten.

Nachdem wir mit dem Statistikalgorythmus in die Testphase übergehen wollten merkten wir dann aber recht schnell, dass die Auswertung und die Anfragen gegen die Datenbank, bei mehreren Millionen Einträgen, mit einem sehr hohen Zeitaufwand verbunden waren, einem zu hohen Aufwand, laut unseren Berechnungen hätte die Auswertung unserer bis dahin gesammelten Daten bis zu einem Jahr gedauert. Außerdem stießen wir immer wieder auf Fehler bei den Daten, z.B. das die Id´s der Stationen von der Api mit den Id´s der Stationen von den Gtfs Daten die wir zum Vergleich benutzten, nicht überein stimmten.

Ein weiteres Problem bestand das es bei einigen Einträgen in die Datenbank Probleme mit dem Parsen von Datumsangaben gab und somit dadurch viele Datensätze unbrauchbar wurden.

Durch den Fakt das die Abgabe immer näher rückte, entschieden wir uns unser Konzept ein wenig um zu strukturieren und die Daten von der Api nicht mehr in unsere Datenbank zu schreiben, sondern nach einer Anfrage an die VBB-Api, direkt eine Tagesstatistik zu erstellen und diese dann nach der nächsten Anfrage zu aktualisieren. 

Um weiterhin das Problem mit der großen Menge an Daten jedes Responses zu bewältigen, beschlossen wir die Anzahl der Linien zu reduzieren und nur Daten für jede 10. Haltestelle einer Linie zu sammeln.

Dadurch konnten wir die Laufdauer unseres Statistikalgorythmus auf eine Zeit von 7 Minuten reduzieren, (Zeit bruachen die vielen Anfragen an die API) welches in die Zeitspanne unseres 10 minütigen Anfrage-Intervalls an die VBB-Api passte.
Nachdem wir Heroku doch eine erträchtliche Summe für den Anfangszeitraum überwiesen hatten, entschieden wir uns die ganze App auf eine ‘Pay what you want’ Lösung umzuziehen, Uberspace. Dort läuft jetzt nach wie vor die App und füttert unsere Datenbank mit täglich erstellten Statistiken was die durchschnittliche Verspätungen der Berliner M-Linien betrifft.
 
 
Für die Visualisierung hatten wir uns ursprünglich eine Karte mit den jeweiligen Linien vorgestellt, bei der die durschnittlichen Verspätungen je nach Linie farblich unterlegt werden. Leider hatten wir am Ende zu wenig Zeit diese anfängliche Idee umzusetzen, sodass wir uns dazu entschieden haben die Visualisierung zu vereinfachen, und mit Hilfe einer Javascript Bibliothek ‘Chart.js’ die Verspätungen dem Nutzer mit Hilfe von Digrammen darzustellen. 

##Technische Umsetzung

Im Backend haben wir die Sprache Ruby on Rails genutzt und unser Programm auf Uberspace gehostet. Für die Anfragen an die VBB API haben wir Cron Jobs verwendet.

Im Frontend wurden die geläufigen Technologien wie HTML, CSS und Javascript verwendet. Die Darstellung der verschiedenen Diagramme haben wir mit Chart.js realisiert

Das Design besteht aus verschiedenen Komponenten. Auf der Startseite kann der User einen Zeitraum auswählen, in dem er die Verspätungen verschiedener Linien angezeigt bekommen möchte. Diese werden dann in einem Balkendiagramm visualisiert und sortiert, sodass ein Vergleich der einzelnen Linien leicht fällt. Nun kann der User auf eine bestimmte Linie klicken, von der er mehr Informationen erhalten will. Nun wird ein Liniendiagramm angezeigt, welche die durchschnittlichen Verspätungen im zeitlichen Verlauf präsentieren.

##Fazit

Im Nachhinein haben wir gelernt, dass ein solch umfangreiches Projekt einer frühzeitigen, genaueren Planung bedarf. Dies werden wir in Zukunft beachten müssen. Zudem wissen wir nun, dass der Umgang mit großen Daten zu einigen Problemen führen kann, welche vorher nicht berücksichtigt wurden. Die Rechnung, wie viele Daten wir womöglich mit unserem Algorithmus speichern, hätten wir vorher beachten müssen. Es war aber auch sehr interessant sich mit den Problemstellungen von “Big Data” zu beschäften.

Und hat es Spaß gemacht mit den offenen Daten zu arbeiten und diese so darzustellen, dass diese einen Informationsgehalt darstellen, der sich aus der großen Menge von Daten nicht direkt erschließen lässt. Daraus haben sich auch für uns neue Informationen erschlossen.

Das System kann noch weiter entwickelt werden, indem wir die Verspätungen für alle Linien darstellen und einen direkten Vergleich zwischen bestimmten Linien ermöglichen.
Auch könnten wir  mit der derzeitigen Visualisierung Probleme bekommen wenn wir Daten über einen seht großen Zeitraum ansehen.
