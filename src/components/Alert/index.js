import React from "react";
import { useEffect } from "react";
import AppContext from "../../context/AppContext";

export default function Alert() {
  const appContxt = React.useContext(AppContext);

  useEffect(() => {
    if (appContxt.alert) {
      setTimeout(() => {
        appContxt.handleAlert("");
      }, 2000);
    }
  }, [appContxt]);

  if (!appContxt.alert) {
    return null;
  }

  return (
    <div>
      {appContxt.alert}
      <button>&times;</button>
    </div>
  );
}
