import { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import getSymbolFromCurrency from 'currency-symbol-map';
import Loading from './Loading';

const host = 'api.frankfurter.app';
export default function RateConversion() {
  const [currency, setCurrency] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [convertedVlue, setConverted] = useState(null);

  const [from, setFrom] = useState('');
  const [to, setto] = useState('');

  const loadOption = (searchValue: string, callBack: any) => {
    async function getCurrency() {
      setLoading(true);
      const res = await fetch(`https://${host}/currencies`);

      const data = await res.json();

      const currList = Object.entries(data)?.map((curr) => ({
        label: `${curr[0]} - ${getSymbolFromCurrency(curr[0])}`,
        value: curr[0].toLowerCase(),
      }));

      const filterCurr = currList.filter((curr) =>
        curr.label.toLowerCase().includes(searchValue.toLowerCase()),
      );

      setCurrency(currList);
      setLoading(false);
      callBack(filterCurr);
    }

    getCurrency();
  };

  const customStyles = {
    control: (styles: any) => {
      return {
        ...styles,
        color: 'white',
      };
    },
    option: (styles: any, other: any) => {
      return {
        ...styles,
        backgroundColor: '#f2f2f2',
        color: 'black',
      };
    },
    valueContainer: (base, props) => {
      return {
        ...base,
      };
    },
    container: (base: any, props: any) => {
      return { ...base };
    },
    menuList: (base: any) => ({
      ...base,

      '::-webkit-scrollbar': {
        width: '6px',
        height: '0px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#55595a',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#7950f2',
      },
    }),
  };

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

        console.log(data);

        setConverted(data);
        setLoading(false);
      }

      if (!amount || !from || !to) {
        setLoading(false);
        setConverted(null);
        return;
      }

      getConvertedValue();
      return () => controller.abort();
    },
    [amount, from, to],
  );

  return (
    <div>
      <form action="" className="flex gap-8 shrink-0 justify-center">
        <input
          type="number"
          className="rounded-sm px-4 text-black"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <AsyncSelect
          menuPlacement="top"
          loadOptions={loadOption}
          isLoading={loading}
          placeholder="From currency"
          defaultOptions
          styles={customStyles}
          onChange={(curr: any) => {
            setFrom(() => curr.value);
          }}
          defaultValue={from}
        ></AsyncSelect>
        <Select
          menuPlacement="top"
          placeholder="To currency"
          options={currency?.filter(
            (curr: { value: string }) => curr.value !== from,
          )}
          styles={customStyles}
          onChange={(curr: any) => setto(curr.value)}
          defaultValue={to}
          isDisabled={!from}
        ></Select>
      </form>
      <div className="bg-gray-800 px-2 py-2 rounded-md h-20 mt-8">
        {loading && <Loading></Loading>}
        {convertedVlue && !loading && (
          <div className="flex justify-evenly font-bold">
            <span>
              {amount} {from.toUpperCase()} ={' '}
              {(+convertedVlue?.rates[to.toUpperCase()]).toFixed(2)}
              {to.toUpperCase()}
            </span>
            <span className="">{convertedVlue.date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
