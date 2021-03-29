export function token() {
  return getStorage("token")
}

export function setStorage(name, data) {
  try {
    window.localStorage.setItem("local_test", "ok");
  } catch (_) {
    alert("请关闭无痕模式以便正常使用功能");
    return false;
  }
  if (!name) return;
  window.localStorage.setItem(name, JSON.stringify(data));
}

export function getStorage(name, isPure = false) {
  if (!name) return;
  if (isPure) return window.localStorage.getItem(name);
  var data = window.localStorage.getItem(name);
  if (data && data !== "null" && data !== "undefined") {
      return JSON.parse(data)
  } else {
      return null
  }
}

export function removeStorage(name) {
  if (!name) return;
  window.localStorage.removeItem(name);
}

export function bytesToSize(bytes) {
  if (bytes == 0) return '0 B';
  let k = 1024,
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)). toFixed(2) + ' ' + sizes[i];
}