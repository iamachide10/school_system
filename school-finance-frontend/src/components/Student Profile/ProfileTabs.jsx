

import { useState } from "react";
import {PersonalDetails} from "./PersonalDetails";
import {ContactDetails} from "./ContactDetails";

export function ProfileTabs({ student }) {
  const [tab, setTab] = useState("personal");

  return (
    <section>
      <div className="flex gap-2 mb-6">
        <Tab label="Personal" active={tab === "personal"} onClick={() => setTab("personal")} />
        <Tab label="Parent Contact" active={tab === "contact"} onClick={() => setTab("contact")} />
      </div>

      {tab === "personal" && <PersonalDetails data={student.personal} />}
      {tab === "contact" && <ContactDetails data={student.contact} />}
    </section>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        active ? "bg-green-700 text-white" : "bg-green-50 text-green-700"
      }`}
    >
      {label}
    </button>
  );
}
