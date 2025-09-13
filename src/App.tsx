import { useState, useEffect } from "react";
import "./App.css";

type Review = { id: number; user: string; text: string; rating: number };
type Place = { id: number; name: string; reviews: Review[] };

export default function App() {
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem("places");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Hobbitfala",
            reviews: [
              { id: 1, user: "Samu", text: "Békés és zöld! 5 csillag!", rating: 5 },
            ],
          },
          {
            id: 2,
            name: "Mordor",
            reviews: [
              { id: 1, user: "Gollam", text: "Nagyon meleg, nem ajánlanám", rating: 1 },
            ],
          },
        ];
  });

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [admin, setAdmin] = useState(false);

  // Save to localStorage whenever places change
  useEffect(() => {
    localStorage.setItem("places", JSON.stringify(places));
  }, [places]);

  function handleAdminLogin() {
    const code = prompt("Ajjaj, ide nem jöhetsz be!");
    if (code === "2334") setAdmin(true);
    else alert("Nem, menj vissza!");
  }

  function addPlace() {
    const name = prompt("Place name?");
    if (!name) return;
    setPlaces([...places, { id: Date.now(), name, reviews: [] }]);
  }

  function removePlace(id: number) {
    setPlaces(places.filter((p) => p.id !== id));
    if (selectedPlace?.id === id) setSelectedPlace(null);
  }

  function addReview(place: Place) {
    const user = prompt("Your name?") || "Anonymous";
    const text = prompt("Your review?") || "";
    const rating = parseInt(prompt("Rating 1–5?") || "3");
    if (!text) return;
    const newReview: Review = {
      id: Date.now(),
      user,
      text,
      rating: Math.min(Math.max(rating, 1), 5),
    };
    setPlaces(
      places.map((p) =>
        p.id === place.id ? { ...p, reviews: [...p.reviews, newReview] } : p
      )
    );
  }

  function removeReview(place: Place, reviewId: number) {
    setPlaces(
      places.map((p) =>
        p.id === place.id
          ? { ...p, reviews: p.reviews.filter((r) => r.id !== reviewId) }
          : p
      )
    );
  }

  const renderStars = (rating: number) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  if (selectedPlace) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setSelectedPlace(null)}>
          ← Vissza
        </button>
        <h1>{selectedPlace.name}</h1>
        <div className="reviews">
          {selectedPlace.reviews.map((r) => (
            <div key={r.id} className="review">
              <div className="review-header">
                <strong>{r.user}</strong>
                <span className="stars">{renderStars(r.rating)}</span>
              </div>
              <p>{r.text}</p>
              {admin && (
                <button
                  className="delete-btn"
                  onClick={() => removeReview(selectedPlace, r.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        {admin && (
          <button className="add-btn" onClick={() => addReview(selectedPlace)}>
            + Add Review
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="page main-page">
      <h1>Középfölde TripAdvisor</h1>
      <div className="place-list">
        {places.map((p) => {
          const first = p.reviews[0];
          return (
            <div
              key={p.id}
              className="place-card"
              onClick={() => setSelectedPlace(p)}
            >
              <h2>{p.name}</h2>
              {first ? (
                <div className="review-preview">
                  <span className="stars">{renderStars(first.rating)}</span>
                  <p>
                    <strong>{first.user}:</strong> {first.text}
                  </p>
                </div>
              ) : (
                <p>Még nincsenek értékelések</p>
              )}
              {admin && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlace(p.id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
      {admin && (
        <button className="add-btn bottom-right" onClick={addPlace}>
          + Add Place
        </button>
      )}
      {!admin && (
        <button className="admin-btn bottom-right" onClick={handleAdminLogin}>
          Készítette: Lengyel-Barsi Dominik
        </button>
      )}
    </div>
  );
}
