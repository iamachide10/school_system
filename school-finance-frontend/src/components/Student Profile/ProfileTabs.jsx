import { useState } from "react";
import { PersonalDetails } from "./PersonalDetails";
import { ContactDetails } from "./ContactDetails";

const tabs = [
  { key: "personal", label: "Personal", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  )},
  { key: "contact", label: "Parent Contact", icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
  )},
];

export function ProfileTabs({ student }) {
  const [active, setActive] = useState("personal");

  return (
    <section className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-surface border border-border rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
              text-sm font-semibold transition-all duration-150
              ${active === tab.key
                ? "bg-card shadow-sm text-primary border border-border"
                : "text-text-muted hover:text-text"}
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-2xl p-5 animate-fadeIn">
        {active === "personal" && <PersonalDetails data={student.personal} />}
        {active === "contact"  && <ContactDetails  data={student.contact}  />}
      </div>
    </section>
  );
}
