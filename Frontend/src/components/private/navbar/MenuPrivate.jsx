const userRole = localStorage.getItem("userRole");

export const menuPrivates = [
  {
    path:
      userRole === "Agen"
        ? "/berandaAgen"
        : userRole === "Distributor"
        ? "/berandaDistributor"
        : userRole === "Pabrik"
        ? "/berandaPabrik"
        : "/", // fallback
    label: "Beranda",
  }
];
