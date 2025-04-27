import { RoleEnum } from "@/enums/role.enum";

export const roleDescriptions: Record<RoleEnum, string> = {
    [RoleEnum.NONE]: "",
    [RoleEnum.SPHINX]: "Each night, the Sphinx chooses one player to protect. If that player is attacked, they survive.",
    [RoleEnum.MUMMY]: "Each night, the Mummy selects one player to eliminate. Its goal is to eradicate all non-Mummies.",
    [RoleEnum.PRIEST]: "Once per game, the Priest may summon Ra or Anubis. Ra reveals a player's role each morning. Anubis eliminates a player each morning.",
    [RoleEnum.SLAVE]: "The Slave has no special abilities and can only vote during meetings."
};