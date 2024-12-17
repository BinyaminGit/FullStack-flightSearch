import React, { useState } from "react";
import "./App.css";

// הגדרת טיפוס לטיסות
interface Flight {
  id: string;
  origin: string;
  destination: string;
  kosherMeal: string;
  date: string;
}

const App: React.FC = () => {
  const [showFlights, setShowFlights] = useState(false); // מנהל מצב הצגת הטיסות
  const [flights, setFlights] = useState<Flight[]>([]); // מערך של טיסות
  const [newFlight, setNewFlight] = useState<Flight>({
    id: "",
    origin: "",
    destination: "",
    kosherMeal: "",
    date: "",
  });
  const [destination, setDestination] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [searchDestination, setSearchDestination] = useState<Flight[]>([]); // תוצאה מהחיפוש
  const [searchOrigin, setSearchOrigin] = useState<Flight[]>([]); // תוצאה מהחיפוש
  const [isDestinationAscending, setIsDestinationAscending] = useState(true); // כיוון ברירת המחדל
  const [isOriginAscending, setIsOriginAscending] = useState(true);
  const [isAscending, setIsAscending] = useState(true);
  // שאילתא להצגת כל הטיסות
  const fetchFlights = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/flights");
      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }
      const data = await response.json();
      console.log(data); // בדוק אם הנתונים מגיעים לכאן
      setFlights(data); // עדכון המצב להצגת הנתונים
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const toggleFlights = async () => {
    if (!showFlights) {
      // אם המצב כרגע מוסתר, יש להביא את הנתונים מהשרת
      await fetchFlights();
    }
    setShowFlights(!showFlights); // הפוך את מצב ההצגה
  };

  // שאילתא להוספת טיסה חדשה
  const addFlight = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlight), // newFlight הוא המידע שברצונך לשלוח
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add flight");
      }

      const data = await response.json();
      console.log(data.message); // הצגת הודעת הצלחה
      alert(data.message); // התראה למשתמש
      fetchFlights(); // עדכון הרשימה לאחר הוספה
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message); // TypeScript יודע כעת שיש ל-error תכונה message
      } else {
        console.log("Unknown error occurred");
      }
    }
  };

  // שאילתת חיפוש לפי יעד
  const searchFlight = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flights/search?destination=${destination}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search flights");
      }

      const data = await response.json();
      console.log(data); // בדוק אם התוצאה מגיעה לכאן
      setSearchDestination(data); // עדכון מצב החיפוש
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error searching flights:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred");
      }
    }
  };

  // שאילתת חיפוש לפי יעד
  const searchFlightOrigin = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flights/searchOrigin?origin=${origin}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search flights");
      }

      const data = await response.json();
      console.log(data); // בדוק אם התוצאה מגיעה לכאן
      setSearchOrigin(data); // עדכון מצב החיפוש
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error searching flights:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred");
      }
    }
  };
  // מיון לפי ID
  const sortById = () => {
    const sortedFlights = [...flights].sort((a, b) => {
      return isAscending ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    });
    setIsAscending(!isAscending);
    setFlights(sortedFlights);
  };

  // מיון לי יעד
  const sortByDestination = () => {
    const sortedFlights = [...flights].sort((a, b) => {
      return isDestinationAscending
        ? a.destination.localeCompare(b.destination)
        : b.destination.localeCompare(a.destination);
    });
    setIsDestinationAscending(!isDestinationAscending);
    setFlights(sortedFlights);
  };
  const sortByOrigin = () => {
    const sortedFlights = [...flights].sort((a, b) => {
      return isOriginAscending
        ? a.origin.localeCompare(b.origin)
        : b.origin.localeCompare(a.origin);
    });
    setIsOriginAscending(!isOriginAscending);
    setFlights(sortedFlights);
  };

  // כאן מתחיל הDOM
  return (
    <div dir="rtl" className="container" style={{ padding: "20px" }}>
      <h1>ניהול טיסות</h1>

      {/* הצגת כל הטיסות בטבלה*/}
      <div className="center">
        <button onClick={toggleFlights}>
          {showFlights ? "הסתר את כל הטיסות" : "הצג את כל הטיסות"}
        </button>
        {showFlights && (
          <table dir="ltr">
            <thead>
              <tr>
                <th onClick={sortById} style={{ cursor: "pointer" }}>
                  מספר טיסה
                </th>
                <th onClick={sortByOrigin} style={{ cursor: "pointer" }}>
                  מוצא
                </th>
                <th onClick={sortByDestination} style={{ cursor: "pointer" }}>
                  יעד
                </th>
                <th dir="rtl">ארוחה כשרה?</th>
                <th>תאריך</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.id}:</td>
                  <td>{flight.origin} ➡</td>
                  <td>{flight.destination}</td>
                  <td>{flight.kosherMeal}</td>
                  <td>{flight.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* הוספת טיסה */}
      <div>
        <h2>הוסף טיסה חדשה</h2>
        <input
          type="text"
          placeholder="ID"
          value={newFlight.id}
          onChange={(e) => setNewFlight({ ...newFlight, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="מוצא"
          value={newFlight.origin}
          onChange={(e) =>
            setNewFlight({ ...newFlight, origin: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="יעד"
          value={newFlight.destination}
          onChange={(e) =>
            setNewFlight({ ...newFlight, destination: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="ארוחה כשרה"
          value={newFlight.kosherMeal}
          onChange={(e) =>
            setNewFlight({ ...newFlight, kosherMeal: e.target.value })
          }
        />
        <input
          type="date"
          value={newFlight.date}
          onChange={(e) => setNewFlight({ ...newFlight, date: e.target.value })}
        />
        <button onClick={addFlight}>הוסף טיסה</button>
      </div>

      {/* חיפוש לפי יעד */}
      <div>
        <h2>חפש טיסה לפי יעד</h2>
        <input
          type="text"
          placeholder="יעד"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={searchFlight}>חפש</button>
        {/* הצגת היעדים ברשימה */}
        <ul>
          {searchDestination.map((flight) => (
            <li key={flight.id}>
              {flight.id}: {flight.origin} ➡ {flight.destination} ({flight.date}
              )
            </li>
          ))}
        </ul>
      </div>

      {/* חיפוש לפי מוצא  */}
      <div>
        <h2>חפש טיסה לפי מוצא</h2>
        <input
          type="text"
          placeholder="מוצא"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <button onClick={searchFlightOrigin}>חפש</button>

        {/* הצגת מצוא בטיסה ברשימה */}
        <ul>
          {searchOrigin.map((flight) => (
            <li key={flight.id}>
              {flight.id}: {flight.origin} ➡ {flight.destination} ({flight.date}
              )
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
