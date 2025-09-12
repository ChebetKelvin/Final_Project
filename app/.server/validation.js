export function validateText(text) {
  if (text.length < 2) {
    return "invalid input";
  }
}

export function validateEmail() {
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid.";
  }
}

export function validateMessage() {
  if (!message) errors.message = "Message cannot be empty.";
}

export function validatePassword(password) {
  if (password.length < 6) {
    return "password must be atleast 10 char";
  }
}

export function validatePrice(price) {
  if (Number(price) <= 0) {
    return "Invalid input";
  }
}
