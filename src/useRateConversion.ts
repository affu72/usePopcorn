import { useEffect, useState } from 'react';

const host = 'api.frankfurter.app';
export function useRateConversion(amount: number, from: string, to: string) {
  const [convertedValue, setConvertedValue] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function getConvertedValue() {
        setLoading(true);
        const res = await fetch(
          `https://${host}/latest?amount=${amount}&from=${from}&to=${to}`,
          { signal: controller.signal },
        );

        const data = await res.json();

        // console.log(data);

        setConvertedValue(data);
        setLoading(false);
      }

      if (!amount || !from || !to) {
        setLoading(false);
        setConvertedValue(null);
        return;
      }

      getConvertedValue();
      return () => controller.abort();
    },
    [amount, from, to],
  );

  return { loading, convertedValue };
}
