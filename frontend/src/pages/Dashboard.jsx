import { useEffect, useState } from "react";
import { getWomen } from "../api/client";

const ORDER = { High: 0, Medium: 1, Low: 2 };

function mapLink(location) {
  return "https://www.google.com/maps?q=" + location.lat + "," + location.lng;
}

export default function Dashboard() {
  const [women, setWomen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWomen()
      .then((list) => {
        // Highest risk first, then higher score, then newest
        list.sort(
          (a, b) =>
            ORDER[a.level] - ORDER[b.level] ||
            b.score - a.score ||
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        setWomen(list);
      })
      .finally(() => setLoading(false));
  }, []);

  let content;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (women.length === 0) {
    content = <p>No screenings yet. Complete a health check first.</p>;
  } else {
    content = (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Weeks</th>
            <th>Risk</th>
            <th>Phone</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {women.map((w, i) => (
            <tr key={w.id}>
              <td>{i + 1}</td>
              <td>{w.name}</td>
              <td>{w.weeks}</td>
              <td>
                <span className={"badge " + w.level}>{w.level}</span>
              </td>
              <td>{w.phone}</td>
              <td>
                {w.location ? (
                  <a href={mapLink(w.location)} target="_blank" rel="noreferrer">
                    Open map
                  </a>
                ) : (
                  "Not shared"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: 4 }}>Health worker dashboard</h2>
      <p className="note" style={{ marginBottom: 16 }}>
        Highest risk first. Everyone else is listed right after, so no one is left out.
      </p>
      <div className="card table-wrap">{content}</div>
    </div>
  );
}