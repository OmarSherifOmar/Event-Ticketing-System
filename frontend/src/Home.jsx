import React from "react";
import "./Home.css";
import EventList from "./components/EventView/EventList.jsx";


function Home() {
  return (
    <>
      <main className="home-container">
        <EventList />
      </main>
      {/* <Footer /> Uncomment if you have a footer */}
    </>
  );
}

export default Home;