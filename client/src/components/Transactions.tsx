import { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs, { Dayjs } from "dayjs";
import {MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { Aid, Atm, transactionsData } from "../types/types";
import { getAidList, getAtmList, getTransactions } from "../api/api";


// Transactions page will be rendered here -> the header followed up by the filters and then the transaction table
export default function Transactions() {
  // dialog open state if print/export button is clicked
  const [open, setOpen] = useState(false);
  // date range state for the filter
  const [selectedDate, setSelectedDate] = useState<DateRange<Dayjs>>(
    [dayjs("2020-04-11"), dayjs("2025-04-18")]
  );
  // state for filter selection
  const [atmList, setAtmList] = useState<Atm[]>([]);
  const [selectAtmId, setSelectAtmId] = useState<string>("");
  const [customerPanFilter, setCustomerPanFilter] = useState<string>("");
  const [emvChipAidsList, setEmvChipAidsList] = useState<Aid[]>([]);
  const [selectEmvChipAid, setSelectEmvChipAid] = useState<string>("All applications");
  const [transactionNumberFilter, setTransactionNumberFilter] = useState<string>("");
  const [transactionDataFiltered, setTransactionDataFiltered] = useState<transactionsData>([]);
  const [transactionData, setTransactionData] = useState<transactionsData>([]);

  useEffect(() => {
    // Fetch ATM list and EMV Chip AID list from the API
    const fetchData = async () => {
      const atmListResponse = await getAtmList();
      setAtmList(atmListResponse);
      const emvChipAidsResponse = await getAidList();
      setEmvChipAidsList(emvChipAidsResponse);
    }
    fetchData();
    getTransactionData();
  }, []);

  useEffect(() => {
    // Whenever the selected date changes, fetch the transaction data
    if(selectedDate && selectAtmId) {
      getTransactionData();
    }
  }, [selectedDate, selectAtmId, selectEmvChipAid]);

  //helper functions to get MM/DD/YYYY format and mm/dd/yy hh:mm:ss format from devtime(recieived from the API)
  const getDateFormated = (devTime: number) => {
    const str = devTime.toString();
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    return `${month}/${day}/${year}`;
  }

  const getTimeFormated = (devTime: number) => {
    const str = devTime.toString();
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);
    const second = str.substring(12, 14);
    return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
  }

  //helper for each given ATM ID fetch data to avoid repitive code
  const getTransactionDataForAtmId = async (atmId: number | undefined) => {
    if(!selectedDate){
      return [];
    }
    if(!atmId) {
      return [];
    }
    const dateTime = selectedDate[1] ? selectedDate[1].valueOf() : 0;
    const transactionDataResponse = await getTransactions(atmId, dateTime);
    if(!transactionDataResponse.txn){
      return [];
    }
    const transactionDataResponseFiltered : transactionsData = [];
    for(const transaction of transactionDataResponse.txn) {
      // check if devtime is in the selected date range if not skip this transaction
      const devTimeMs = dayjs(getTimeFormated(transaction.devTime)).valueOf();
      const startDate = selectedDate[0] ? selectedDate[0].valueOf() : 0;
      const endDate = selectedDate[1] ? selectedDate[1].valueOf() : 0;
      if(devTimeMs< startDate || devTimeMs > endDate) {
        continue;
      }
      //aid filter
      if(selectEmvChipAid !== "All applications" && (!transaction.app || !transaction.app.txt)) {
        //the transaction has no aid skip
        continue;
      }
      else if(selectEmvChipAid !== "All applications" && transaction.app && transaction.app.txt && transaction.app.txt !== selectEmvChipAid) {
        //transaction's aid does not match, skip this transaction
        continue;
      }
      const transactionTime: string = getDateFormated(transaction.devTime);
      const atmName: string = transaction.atm.txt;
      let pan : string = "XXXXXXXXXX";
      if(transaction.pan){
        pan = transaction.pan.replace("*", "XXXXXX");
      }
      // Check if Atm session with time/name/pan already exists and store in variable
      const existingTransaction = transactionDataResponseFiltered.find((atmSession) => {
        return atmSession.date === transactionTime && atmSession.atmId === atmName && atmSession.customerPan === pan;
      });
      if(existingTransaction && pan !== "XXXXXXXXXX") {
        // If it exists, push the description and code to the existing transaction
        if(transaction.ttp && transaction.ttp.descr) {
          if(transaction.amount !== 0){
            existingTransaction.description.push(transaction.ttp.descr + "\nAmount $" + transaction.amount.toString());
          }
          else{
            existingTransaction.description.push(transaction.ttp.descr);
          }
          // if ref exists add transaction number to code section of table else add time
          if(transaction.ref){
            existingTransaction.code.push("Transaction #: "+transaction.ref.toString());
          }
          else{
            existingTransaction.code.push(getTimeFormated(transaction.devTime));
          }
        }
        else if(transaction.ttp && transaction.ttp.txt) {
          if(transaction.amount !== 0){
            existingTransaction.description.push(transaction.ttp.txt + "\nAmount $" + transaction.amount.toString());
          }
          else{
            existingTransaction.description.push(transaction.ttp.txt);
          }
          if(transaction.ref){
            existingTransaction.code.push("Transaction #: "+transaction.ref.toString());
          }
          else{
            existingTransaction.code.push(getTimeFormated(transaction.devTime));
          }
        }
        if(transaction.hst && transaction.hst.descr) {
          existingTransaction.description.push(transaction.hst.descr);
          existingTransaction.code.push(getTimeFormated(transaction.devTime));
        }
      }
      else {
        const transactionDescription: string[] = [];
        const transactionCode: string[] = [];
        if(transaction.tpp && transaction.ttp.descr) {
          if(transaction.amount !== 0){
            transactionDescription.push(transaction.ttp.descr + "\nAmount $" + transaction.amount.toString());
          }
          else{
            transactionDescription.push(transaction.ttp.descr);
          }
          // if ref exists add transaction number to code section of table else add time
          if(transaction.ref){
            transactionCode.push("Transaction #: "+transaction.ref.toString());
          }
          else{
            transactionCode.push(getTimeFormated(transaction.devTime));
          }
        }
        else if(transaction.ttp && transaction.ttp.txt) {
          if(transaction.amount !== 0){
            transactionDescription.push(transaction.ttp.txt + "\nAmount $" + transaction.amount.toString());
          }
          else{
            transactionDescription.push(transaction.ttp.txt);
          }
          if(transaction.ref){
            transactionCode.push("Transaction #: "+transaction.ref.toString());
          }
          else{
            transactionCode.push(getTimeFormated(transaction.devTime));
          }
        }
        if(transaction.hst && transaction.hst.descr) {
          transactionDescription.push(transaction.hst.descr);
          transactionCode.push(getTimeFormated(transaction.devTime));
        }
        const atmSession = {
          date: transactionTime,
          atmId: atmName,
          customerPan: pan,
          description: transactionDescription,
          code: transactionCode,
        };
        transactionDataResponseFiltered.push(atmSession)
      }
    }
    return transactionDataResponseFiltered;
  }

  const getTransactionData = async () => {
    //No date range selected return without fetching data
    if(!selectedDate) {
      return;
    }
    if(selectAtmId === "All ATMS") {
      const transactionDataResponseFiltered: transactionsData = [];
      for(const atm of atmList) {
        const transactionDataPerAtm: transactionsData = await getTransactionDataForAtmId(atm.id);
        transactionDataResponseFiltered.push(...transactionDataPerAtm);
      }
      setTransactionDataFiltered(transactionDataResponseFiltered);
      setTransactionData(transactionDataResponseFiltered);
    }
    else {
      const transactionDataResponseFiltered: transactionsData = await getTransactionDataForAtmId(atmList.find((atm) => atm.name === selectAtmId)?.id);
      setTransactionDataFiltered(transactionDataResponseFiltered);
      setTransactionData(transactionDataResponseFiltered);
    }
    // Fetched Data based on the selected ATM IDs and date range

  }

  const handleCustomerPanFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerPanFilter(value);
    //filter for customerPan number
    handleSearch(value);
  }

  const handleEmvChipAidFilter = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectEmvChipAid(value);
  }

  const handleTransactionNumberFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle the transaction number input change (Only allow numbers and maximum 4 digits)
    const value = e.target.value;
    const regex = /^\d+$/;
    if (value.length < 5 && regex.test(value) || value === "") {
      setTransactionNumberFilter(value);
    }
    //filter the transaction data based on the transaction number
    if(value.length === 4){
      handleSearch("Transaction #: "+e.target.value);
    }
    //reset filter value
    if(value.length < 4){
      handleSearch("");
    }

  }

  const handleSearch = (value: string) => {
    if (value === "") {
      setTransactionData(transactionDataFiltered);
      return;
    }
    // Handle the search input change
    const filteredData = transactionDataFiltered.filter((atmSession) => {
      const { date, atmId, customerPan, description, code } = atmSession;
      return (
        date.toLowerCase().includes(value.toLowerCase()) ||
        atmId.toLowerCase().includes(value.toLowerCase()) ||
        customerPan.toLowerCase().includes(value.toLowerCase()) ||
        description.some((desc) => desc.toLowerCase().includes(value.toLowerCase())) ||
        code.some((c) => c.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setTransactionData(filteredData);
  }

  return (
    //transaction header below
    <div className="flex flex-col gap-2">
      <div className="flex justify-between p-2">
        <h1 className="text-lg ">All Transactions</h1>
        <div className="w-2/10 flex gap-3">
          <button onClick={()=>setOpen(true)} className="w-1/2 bg-white hover:bg-gray-300 text-black py-2 px-4 border
            border-gray-300 hover:border-transparent rounded-lg p-2">Print</button>
          <button onClick={()=>setOpen(true)} className="w-1/2 bg-white hover:bg-gray-300 text-black py-2 px-4 border
            border-gray-300 hover:border-transparent rounded-lg p-2">Export</button>
        </div>
        <Dialog onClose={()=>setOpen(false)} open={open}>
          <DialogTitle>Not Implemented</DialogTitle>
          <button onClick={()=>setOpen(false)}>close</button>
        </Dialog>
      </div>
      <div className="flex justify-start p-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-md">Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              defaultValue={[dayjs("2022-04-17"), dayjs("2022-04-21")]}
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}/>
          </LocalizationProvider>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-md">ATM ID</label>
          <Select
            sx={{ width: 150 }}
            value={selectAtmId}
            onChange={(e) => setSelectAtmId(e.target.value)}>
              <MenuItem value="All ATMS">All ATMS</MenuItem>
              {atmList.map((atm, index) => (
                <MenuItem key={index} value={atm.name}>{atm.name}</MenuItem>
              ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-md">Customer PAN number</label>
          <TextField placeholder="Partial or full card number"
                    variant="outlined"
                    value={customerPanFilter}
                    onChange={handleCustomerPanFilter}/>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-md">EMV Chip AID</label>
          <Select
            sx={{ width: 250 }}
            value={selectEmvChipAid}
            onChange={handleEmvChipAidFilter}>
              <MenuItem value="All applications">All applications</MenuItem>
              {emvChipAidsList.map((emvChipAid, index) => (
                <MenuItem key={index} value={emvChipAid.aid}>{emvChipAid.aid}</MenuItem>
              ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-md">Transaction number</label>
          <TextField placeholder="4 digit number"
                    variant="outlined" value={transactionNumberFilter}
                    onChange={handleTransactionNumberFilter}/>
        </div>
      </div>
      <TransactionTable handleSearch={handleSearch} transactionData={transactionData} />
    </div>
  )
}

