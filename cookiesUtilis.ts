import Cookies from 'js-cookie';

const setCookie = (key: string, value: string, expiryDays: number = 7) => {
    Cookies.set(key, value, { expires: expiryDays });
};

const getCookie = (key: string): string | undefined => {
    return Cookies.get(key);
};

const removeCookie = (key: string) => {
    Cookies.remove(key);
};

export { setCookie, getCookie, removeCookie };
