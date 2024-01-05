import { createContext } from "react";

export const ShowPopupContext = createContext(null);
ShowPopupContext.displayName = "ShowPopupData";

export const LoginContext = createContext(null);
LoginContext.displayName = "LoginData";

export const GroupContext = createContext(null);
GroupContext.displayName = "GroupData";

export const MemberContext = createContext(null);
MemberContext.displayName = "MemberData";
