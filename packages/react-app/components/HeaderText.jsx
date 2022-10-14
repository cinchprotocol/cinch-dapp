import React from "react";

export const HeaderText01 = props => {
  return (
    <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
      {props.children}
    </p>
  );
};
