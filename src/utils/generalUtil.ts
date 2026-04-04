export const formatMoney = (value?: number) =>
    Number(value || 0).toFixed(2);