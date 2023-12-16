import { UserProfile, Profile } from "./interfaces.js";

export const SCOPE = {
  blocked: -1,
  spectator: 0,
  user: 1,
  admin: 2,
};

export function determineScope(
  authID: string,
  options: { targetAuthID?: string }
) {
  if (options.targetAuthID != undefined) {
    return authID === options.targetAuthID ? SCOPE.user : SCOPE.spectator;
  }
  return SCOPE.blocked
}

export function scopeProfile(
  userProfile: UserProfile,
  scope: number
): Profile | null {
  switch (scope) {
    case SCOPE.user:
        console.log("hey")
      return userProfile;
      break;
      case SCOPE.admin:
        console.log("hey")
      return userProfile;
      break;
    case SCOPE.spectator:
      return {
        profileID: userProfile.profileID,
        email: userProfile.isEmailPublic
          ? userProfile.email
          : undefined,
        username: userProfile.username,
        dob: userProfile.dob ? userProfile.dob : undefined,
        active: userProfile.isActivityPublic
          ? userProfile.active
          : undefined,
      };
      break;
    default:
      return null;
      break;
  }
}



// -1 Cannot View
// 0 Spectator View
// 1 User View
// 2 Admin
