export const llColors = {
  primary1: "#495E57",
  primary1L1: "#919e9a",
  primary2: "#F4CE14",
  primary2D1: "#dbb912",
  secondary1: "#EE9972",
  secondary2: "#FBDABB",
  secondary3: "#EDEFEE",
  secondary4: "#333333",
  disabled: "lightgrey",
};

export const validateName = (name) => {
  return name != null && /^[a-zA-Z0-9]+$/.test(name);
};

export const validatePhoneNumber = (pnum) => {
  return pnum != null && /^[0-9]{10}$/.test(pnum);
};

export const validateEmail = (email) => {
  return (
    email != null &&
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) != null
  );
};

// Return style with feedback based on validator...
export const feedBackStyle = (
  validator,
  baseStyle = null,
  errorStyle = null
) => {
  let ret = [];
  if (!errorStyle) {
    errorStyle = { color: "red" }; // , borderColor: "red" };
  }
  if (baseStyle && Object.keys(baseStyle).length > 0) {
    ret.push(baseStyle);
  }
  if (validator && !validator()) {
    ret.push(errorStyle);
  }
  return ret;
};
