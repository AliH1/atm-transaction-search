import SearchIcon from "@mui/icons-material/Search";
import { transactionsData }  from "../types/types";

export default function TransactionTable({ transactionData, handleSearch }: { transactionData: transactionsData, handleSearch: (value: string) => void }) {

  const handleSearchInResults = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  }

  return (
    <div className="border-gray rounded-2xl overflow-hidden bg-white shadow-lg">
      <table className="w-[100%] table-auto text-sm text-left divide-y divide-solid divide-gray-300">
        <thead>
          <tr>
            <th className="w-1/10 p-3">Date</th>
            <th className="w-1/10 p-3">ATM ID</th>
            <th className="w-1/5 p-3">Customer PAN</th>
            <th className="w-3/5">
              <div className="flex justify-between">
                <div className="w-1/2 p-3">Description</div>
                <div className="w-1/2 flex justify-between">
                  <div className="p-3">
                    Code
                  </div>
                  <div className="p-2">
                    <div className="flex items-center justify-center bg-[#faf9f7] border-b border-gray-300">
                      <SearchIcon/>
                      <input onChange={handleSearchInResults} type="text" placeholder="Search in results" className="pl-1 placeholder-color-gray-100"/>
                    </div>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        {transactionData.length === 0 ?
        <tbody className="align-top divide-y divide-solid divide-gray-200">
          <tr>
            <td colSpan={4} className="text-center p-3 text-gray-500">No transactions found</td>
          </tr>
        </tbody>:
        <tbody className="align-top divide-y divide-solid divide-gray-200">
          {transactionData.map((atmSession, id) => (
            <tr key={id} className="">
              <td className="w-1/10 p-3">{atmSession.date}</td>
              <td className="w-1/10 p-3">{atmSession.atmId}</td>
              <td className="w-1/5 p-3">{atmSession.customerPan}</td>
              <td className="w-3/5 p-3 whitespace-pre-wrap">
                {atmSession.description.map((desc, i) => (
                  i === 0 ?
                  <div key={i} className={desc.includes("Sensor stuck") ? "bg-[#fdebeb] flex justify-between": "flex justify-between  "}>
                    <div className={desc.includes("Sensor stuck") ? "w-1/2 text-red-600 font-semibold" : "w-1/2 "}>{desc}</div>
                    <div className="w-1/2">{atmSession.code[i]}</div>
                  </div>:
                  <div key={i} className={desc.includes("Sensor stuck") ? "bg-[#fdebeb] flex justify-between py-2": "flex justify-between py-2"}>
                    <div className={desc.includes("Sensor stuck") ? "w-1/2 text-red-600 font-semibold" : "w-1/2 "}>{desc}</div>
                    <div className="w-1/2">{atmSession.code[i]}</div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
        }
      </table>
    </div>
  )
}
