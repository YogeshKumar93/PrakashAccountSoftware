import localforage from "localforage";

localforage.config({
  driver: localforage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
  name: "PortPayApp",
  //   version: 1.0,
  //   size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
  description: "Created by CMPundhir",
});

export var store = localforage.createInstance({
  name: "PortPayStore001",
});

export const saveKeyVal = (k, v, onSuccess, onError) => {
  store
    .setItem(k, v)
    .then((value) => {
      if (onSuccess) onSuccess("Value saved successfully");
    })
    .catch((err) => {
      if (onError) onError("Error : " + err);
    });
};

export const getValue = (k, onSuccess, onError) => {
  store
    .getItem(k)
    .then((value) => {
      if (value) onSuccess(value);
      else onError("No User");
    })
    .catch((err) => {
      if (onError) onError("Error : " + err);
    });
};
