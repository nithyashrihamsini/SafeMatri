import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Every mother heard.</h1>
        <p>Risks caught early, anywhere. Check your symptoms in two minutes.</p>
        <Link to="/screen" className="btn">Start health check</Link>
      </section>

      <div className="card">
        <h3>1. Tell us how you feel</h3>
        <p>Answer a few simple questions about your symptoms and blood pressure.</p>
      </div>
      <div className="card">
        <h3>2. See your risk</h3>
        <p>Get a clear Low, Medium, or High risk meter with the reasons.</p>
      </div>
      <div className="card">
        <h3>3. Get help fast</h3>
        <p>If risk is high, a nearby health worker is alerted for a home check-up.</p>
      </div>
    </div>
  );
}