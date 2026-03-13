import { SectionCard } from "../ui/SectionCard";

const programs = [
  {
    name: "Bill split capture",
    status: "Next slice",
    detail: "This is the natural next page for creating a bill split once the auth session exists."
  },
  {
    name: "Participant management",
    status: "Next slice",
    detail: "Backend payee records can be surfaced here when User Story 2 is implemented."
  },
  {
    name: "Bill history",
    status: "Next slice",
    detail: "Paginated bill history retrieval already exists in the API and can follow after creation."
  }
];

export function ProgramsPage() {
  return (
    <SectionCard
      title="Post-login roadmap"
      description="These are the next functional areas to build on top of the authenticated session."
    >
      <div className="program-list">
        {programs.map((program) => (
          <article key={program.name} className="program-card">
            <div className="program-card__topline">
              <h3>{program.name}</h3>
              <span>{program.status}</span>
            </div>
            <p>{program.detail}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
