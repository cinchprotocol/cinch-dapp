import { message } from "antd";

export const displayError = (header, err) => {
  console.log(header, err);
  if (err) {
    message.error(header + ": " + err.message, 5);
  } else {
    message.error(header, 5);
  }
};
