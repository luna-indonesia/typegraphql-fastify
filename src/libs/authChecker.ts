import { AuthChecker } from '@interfaces';

import { User } from '@generated/type-graphql/models/User';

export const authChecker: AuthChecker<User> = (
  { context: { email } },
  roles
) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if user exists
    return email !== undefined;
  }
  // there are some roles defined now

  if (!email) {
    // and if no user, restrict access
    return false;
  }
  if (roles.some((roles) => roles.includes(roles))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
