import React from "react";
import "./Home.css";
import EventList from "./components/EventView/EventList.jsx";
import CreateEventButton from "./components/ManageOrganizerEvents.jsx"; 

function Home() {
    const user = JSON.parse(localStorage.getItem("user"));

  return (
    <> 
      <main className="home-container">
        <CreateEventButton user={user} />
        <EventList />
      </main>
      {/* <Footer /> Uncomment if you have a footer */}
    </>
  );
}

export default Home;