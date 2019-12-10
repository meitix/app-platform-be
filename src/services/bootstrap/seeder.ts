import { IRole, Role, IGuardService } from '../../libs/guard';
import * as permissionsObject from '../../config/permissions.const';
import { IAuthService, IAuthData } from '../../libs/identity';
import { User } from '../../libs/user-directory/classes';
import { values } from 'lodash';
import { iocContainer, TYPES } from '../../ioc';
import { IUserService } from '../../libs/user-directory';

const permissions = values(permissionsObject);

const SUPER_ADMIN_ROLE_TITLE = 'Super Admin';

export async function seedDB(seedValues: any) {
  const superAdmin = await createOrUpdateSuperAdminRole();
  createSuperAdminUsers(seedValues.superAdmins, superAdmin);
}

function createOrUpdateSuperAdminRole() {
  const superAdmin = new Role(SUPER_ADMIN_ROLE_TITLE, permissions);
  return iocContainer.get<IGuardService>(TYPES.IGuardService).addOrUpdate(superAdmin);
}

async function createSuperAdminUsers(users: IAuthData[], superAdminRole: IRole) {
  const userService = await iocContainer.get<IUserService>(TYPES.IUserService);
  const superAdmins = await userService.getByRoleTitle(SUPER_ADMIN_ROLE_TITLE);
  if (superAdmins.length) {
    return Promise.resolve();
  }

  const authService = iocContainer.get<IAuthService>(TYPES.IAuthService);
  const all = users.map(async (user: IAuthData) => {
    const authData = await authService.register(user);
    const udUser = new User(user.username, authData.user.id);
    udUser.role = superAdminRole;
    userService.create(udUser);
  });

  return Promise.all(all);
}
