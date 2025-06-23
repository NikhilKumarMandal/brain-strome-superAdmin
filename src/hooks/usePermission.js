export const usePermission = () => {
  const allowedRoles = ["ADMIN", "SUPERADMIN"];

  const _herPermission = (user) => {
    if (user) {
      return allowedRoles.includes(user.role);
    }

    return false;
  };

  return {
    isAllowed: _herPermission,
  };
};
