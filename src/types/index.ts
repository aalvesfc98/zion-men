export type MemberStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "VISITOR"
  | "DEACON"
  | "ELDER"
  | "PASTOR";

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  VISITOR: "Visitante",
  DEACON: "Diácono",
  ELDER: "Presbítero",
  PASTOR: "Pastor",
};

export const MEMBER_STATUS_COLORS: Record<MemberStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  VISITOR: "bg-blue-100 text-blue-800",
  DEACON: "bg-purple-100 text-purple-800",
  ELDER: "bg-yellow-100 text-yellow-800",
  PASTOR: "bg-red-100 text-red-800",
};

export const WEEK_DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
