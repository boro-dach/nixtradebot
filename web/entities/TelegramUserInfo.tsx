// components/TelegramUserInfo.tsx
import { useTelegramWebApp } from "@/shared/hooks/useTelegramWebApp";
import React from "react";

const TelegramUserInfo: React.FC = () => {
  const { webApp, user, userId, platform, isWebVersion, isLoading, error } =
    useTelegramWebApp();

  if (isLoading) {
    return (
      <div className="loading">
        <p>Загрузка Telegram Web App...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <p>Убедитесь, что приложение открыто через Telegram</p>
      </div>
    );
  }

  if (!webApp || !user) {
    return (
      <div className="no-data">
        <p>Не удалось получить данные пользователя</p>
        <p>Платформа: {platform}</p>
      </div>
    );
  }

  const handleClose = (): void => {
    webApp.close();
  };

  const handleShowAlert = (): void => {
    webApp.showAlert("Привет из TypeScript!", () => {
      console.log("Alert closed");
    });
  };

  return (
    <div className="user-info">
      <h2>Информация о пользователе</h2>

      <div className="user-details">
        <p>
          <strong>Telegram ID:</strong> {userId}
        </p>
        <p>
          <strong>Имя:</strong> {user.first_name}
        </p>
        {user.last_name && (
          <p>
            <strong>Фамилия:</strong> {user.last_name}
          </p>
        )}
        {user.username && (
          <p>
            <strong>Username:</strong> @{user.username}
          </p>
        )}
        {user.language_code && (
          <p>
            <strong>Язык:</strong> {user.language_code}
          </p>
        )}
        {user.is_premium && (
          <p>
            <strong>Premium:</strong> ✅
          </p>
        )}
        <p>
          <strong>Платформа:</strong> {platform}
        </p>
        <p>
          <strong>Версия WebApp:</strong> {webApp.version}
        </p>
      </div>

      {isWebVersion && (
        <div className="web-warning">
          <p>
            <strong>⚠️ Веб-версия Telegram</strong>
          </p>
          <p>Некоторые функции могут быть ограничены</p>
        </div>
      )}

      <div className="actions">
        <button onClick={handleShowAlert} className="btn-primary">
          Показать уведомление
        </button>
        <button onClick={handleClose} className="btn-secondary">
          Закрыть приложение
        </button>
      </div>

      <style jsx>{`
        .user-info {
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }
        .user-details p {
          margin: 8px 0;
        }
        .web-warning {
          background: #fff3cd;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
          border: 1px solid #ffeaa7;
        }
        .actions {
          margin-top: 20px;
        }
        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-primary {
          background: #0088cc;
          color: white;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        .loading,
        .error,
        .no-data {
          text-align: center;
          padding: 20px;
        }
        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default TelegramUserInfo;
