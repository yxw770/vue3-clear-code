import request from "@/utils/request";
export function getWebsiteSettingsVersion(failReload = false) {
  return request({
    url: "/system/getVerTS",
    method: "get",
    failReload: failReload,
  });
}

export function getWebsiteSettings(failReload = false) {
  return request({
    url: "/system/getWebConfig",
    method: "get",
    failReload: failReload,
  });
}
