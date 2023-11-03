import { useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import getSymbolFromCurrency from 'currency-symbol-map';
import Loading from './shared/Loading';
import { useRateConversion } from './custom-hooks/useRateConversion';
import FooterBox from './components/FooterBox';

const host = 'api.frankfurter.app';
export default function RateConversion() {
  const [currency, setCurrency] = useState<any>(null);
  const [amount, setAmount] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { loading, convertedValue } = useRateConversion(+amount, from, to);

  const loadOption = (searchValue: string, callBack: any) => {
    async function getCurrency() {
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
        width: '8rem',
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

  return (
    <FooterBox>
      <form action="" className="flex gap-8 shrink-0 justify-center">
        <input
          type="number"
          className="rounded-sm px-4 text-black w-32"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <AsyncSelect
          menuPlacement="top"
          loadOptions={loadOption}
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
          onChange={(curr: any) => setTo(curr.value)}
          defaultValue={to}
          isDisabled={!from}
        ></Select>
      </form>
      <div className="px-2 py-2 rounded-md w-1/4">
        {loading && <Loading></Loading>}
        {convertedValue && !loading && (
          <div className="flex gap-4 flex-col font-bold">
            <span>
              {amount} {from.toUpperCase()} ={' '}
              {(+convertedValue?.rates[to.toUpperCase()]).toFixed(2)}
              {to.toUpperCase()}
            </span>
            <span className="">{convertedValue.date}</span>
          </div>
        )}
      </div>
    </FooterBox>
  );
}
