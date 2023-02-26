import { setItem, getItem } from "@/utils/storage";

/**訪問控制 */
export const useAclStore = defineStore("acl", {
  state: () => ({
    player: getItem("player_acl_player") || false,
    role: getItem("player_acl_role") || [],
    permission: getItem("player_acl_permission") || [],
  }),
  getters: {
    getPlayer: (state) => state.player,
    getRole: (state) => state.role,
    getPermission: (state) => state.permission,
  },
  actions: {
    setFull(player) {
      setItem("player_acl_player", player)
      this.player = player;
    },
    setRole(role) {
      setItem("player_acl_role", role)
      this.role = role;

    },
    setPermission(permission) {
      setItem("player_acl_permission", permission)
      this.permission = permission;
    },
  },
});
