declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: string | number;
            [key: string]: unknown; // qo‘shimcha fieldlar uchun
          };
        };
      };
    };
  }
}