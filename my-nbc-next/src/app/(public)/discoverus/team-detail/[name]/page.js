import TeamDetailPage from "@/components/Home-pages/discover-us/TeamDetailPage";
import { teamMembers } from "@/constants";

export default function Page({ params }) {
  const { name } = params;

  const member = teamMembers.find(
    (person) => person.id.toLowerCase() === name.toLowerCase()
  );

  if (!member) {
    return <div>Member not found</div>; 
  }

  return <TeamDetailPage member={member} />;
}
