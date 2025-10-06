import React from "react";
import "./Gratulation.css";

const Gratulation = () => {
  return (
    <div className="flex flex-col items-center gap-2 px-4 justify-center h-full text-center">
      <p className="text-lg font-semibold">Спасибо что доверяете нам!</p>
      <p className="text-zinc-600 dark:text-zinc-400">
        Ваша транзакция на рассмотрении у администратора
      </p>

      <div className="w-24 h-24 my-4">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <p className="text-zinc-400 text-sm">
        Иногда средства могут задерживаться из-за дополнительных проверок. Если
        транзакция обрабатывается слишком долго, обратитесь в тех. поддержку.
      </p>
    </div>
  );
};

export default Gratulation;
