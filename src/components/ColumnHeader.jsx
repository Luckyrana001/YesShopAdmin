import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PriceFormatter from "../utils/PriceFormatter";
import CustomButton from "./CustomButton";
import { Padding } from "@mui/icons-material";

export const CurrencyCellRenderer = ({ value }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* <AttachMoneyIcon fontSize="small" /> */}
      {/* <span>RM</span>  */}
      {/* Malaysian Ringgit symbol */}
      <span style={{ marginLeft: "4px" }}> <PriceFormatter price={value} /></span>
     
    </div>
  );
};
// {
//   "payoutCycle": "Weekly : 22nd - 30th/31st",
//   "payoutCycleDisplay": null,
//   "payoutStatus": "Hold",
//   "cutOffDate": "2023-08-12",
//   "payOutDate": "2023-08-14",
//   "summaryAmount": 1.9,
//   "companyCode": "A0664",
//   "startDate": "2023-07-01",
//   "endDate": "2023-07-31"
// }

export const onHoldPayoutCycleColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "payoutCycle",
    headerName: "CYCLE",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "cutOffDate",
    flex: 1,
    headerName: "CUTOFF DATE",
    headerAlign: "left",
  },
  {
    field: "payOutDate",
    headerName: "PAYOUT DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "companyCode",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "endDate",
    headerName: "END DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "summaryAmount",
    headerName: "PAYOUT",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

export const onHoldCompanyColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "companyName",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "companyCode",
    flex: 1,
    headerName: "CODE",
    headerAlign: "left",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "endDate",
    headerName: "END DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "vendor",
    headerName: "VENDOR",
    flex: 1,
    headerAlign: "left",
  },
  // {
  //   field: "invoice",
  //   headerName: "INVOICE",
  //   flex: 1,
  //   headerAlign: "left",
  // },
  {
    field: "summaryAmount",
    headerName: "PAYOUT",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

// "name": "Ghe Network",
//                     "date": "2024-04-17 16:19:25.0",
//                     "code": "A00010001AC",
//                     "vendor": "00004",
//                     "reason": "Negative Balance",
//                     "earmark": 5000


// "accountList": [
//   {
//       "accountName": "Sanity PDC Testing",
//       "accountCode": "T1057",
//       "vendorCode": null,
//       "freezeReason": null,
//       "pic": null,
//       "bankName": "CIMB Bank Berhad",
//       "bankAccountNumber": "111111111111"
//   }
// ]


export const earmarksDetailsColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "date",
    flex: 1,
    headerName: "DATE",
    headerAlign: "left",
  },
  {
    field: "code",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },
 
  {
    field: "vendor",
    headerName: "VENDOR",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "reason",
    headerName: "REASON",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "earmark",
    headerName: "EARMARK",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
    
  },
];

// {
//   "companyName": "TM TOP EMPIRE",
//   "companyCode": "A7944",
//   "vendorCode": "VC2000000",
//   "bankName": "CIMB",
//   "bankAccountNumber": "556010614223",
//   "freezeReason": "New dealer",
//   "status": "Frozen - Dealer",
//   "freezeBy": "Sung Pik Yeng(Kellie)",
//   "freezeOn": 1713167285000,
//   "createdOn": 1713167285000,
// },

// {
//   "id": "1",
//   "name": "TM TOP EMPIRE",
//   "code": "A7944",
//   "type": "CREDIT",
//   "details": "Rental",
//   "reason": "Rental",
//   "date": "2024-04-21",
//   "status": "Scheduled",
//   "amount": "500.00"
// },

// Add Dealer page - earmark
export const allAccountsEarmarkColumnHeader = (renderButton) => [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.7,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
    renderCell: (params) => (
      <div style={{ paddingLeft: '8px' }}>
        {params.value}
      </div>
    ),
  },
  {
    field: "date",
    flex: 0.6,
    headerName: "DATE",
    headerAlign: "left",
  },
  {
    field: "code",
    headerName: "CODE",
    flex: 0.6,
    headerAlign: "left",
  },
 
  {
    field: "vendor",
    headerName: "VENDOR",
    flex: 0.6,
    headerAlign: "left",
  },
  {
    field: "reason",
    headerName: "REASON",
    flex: 1,
    headerAlign: "left",
  },
  // {
  //   field: "earmark",
  //   headerName: "EARMARK",
  //   flex: 1,
  //   headerAlign: "left",
  //   cellClassName: "bold-column--cell",
  //   renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
    
  // },
  {
  field: 'addButton',
  headerName: 'EARMARK',
  flex: 1,
  headerAlign: 'left',
  renderCell: (params) => (
    params.value 
    ? renderButton(params.row)
    : <CurrencyCellRenderer value={params.row.earmark} />
  ),
  },
];


export const debitCreditAccountDetailsColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
 
  {
    field: "code",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },
 
 
  {
    field: "type",
    flex: 1,
    headerName: "TYPE",
    headerAlign: "left",
   
  },
  {
    field: "details",
    headerName: "DETAILS",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "date",
    headerName: "DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "status",
    headerName: "STATUS",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    cellClassName: "name-column--cell",
    
  },
  {
    field: "amount",
    headerName: "AMOUNT",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];






export const freezedAccountDetailsColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "companyName",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "status",
    flex: 1,
    headerName: "STATUS",
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    cellClassName: "name-column--cell",
  },
  {
    field: "vendorCode",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },
 
  {
    field: "freezeBy",
    headerName: "FROZE BY",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "freezeOn",
    headerName: "DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "freezeReason",
    headerName: "REASON",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    
    
  },
];


export const onHoldSummaryColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "code",
    flex: 1,
    headerName: "CODE",
    headerAlign: "left",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "endDate",
    headerName: "END DATE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "vendor",
    headerName: "VENDOR",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "invoice",
    headerName: "INVOICE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "payout",
    headerName: "PAYOUT",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

// Payout Dates incentive list header

export const payoutDatesIncentiveColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "cycleDate",
    flex: 1,
    headerName: "CYCLE DATE",
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "reportDay",
    headerName: "REPORT DAY",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "cutOffDay",
    headerName: "CUT OFF DAY",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "payoutDay",
    headerName: "PAYOUT DAY",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "expiry",
    headerName: "EXPIRY",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
];

// Witholding tax screen list header
export const withholdingTaxColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1.5,
    cellClassName: "bold-column--cell",
    headerAlign: "left",
  },
  {
    field: "status",
    flex: 1,
    headerName: "STATUS",
    headerAlign: "left",
    cellClassName: "name-column--cell",
  },
  {
    field: "code",
    headerName: "CODE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "vendor",
    headerName: "VENDOR",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "companyType",
    headerName: "COMPANY TYPE",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "payout",
    headerName: "PAYOUT",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

// {
//   "companyCode": "A1493",
//   "companyName": "J & Jay Communication",
//   "startDate": "2023-07-01",
//   "endDate": "2023-07-31",
//   "vendor": "5000700000",
//   "summaryAmount": 1.9,
//   "payoutCycle": "Weekly : 22nd - 30th/31st",
//   "payoutStatus": "Pending Review",
//   "cutOffDate": "2023-08-12",
//   "payOutDate": "2023-08-14"
// }

// payout Details columns
export const payoutDetailsColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerClassName: (params) =>
      params.field === "id" ? "bold-header-style" : null,
    headerAlign: "left",
  },
  {
    field: "companyName",
    flex: 1.5,
    headerName: "NAME",
    headerClassName: (params) =>
      params.field === "companyName" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },

  {
    field: "startDate",
    headerName: "START",
    flex: 0.5,
    headerAlign: "START",
    headerClassName: (params) =>
      params.field === "startDate" ? "bold-header-style" : null,
  },
  {
    field: "endDate",
    headerName: "END",
    headerClassName: (params) =>
      params.field === "endDate" ? "bold-header-style" : null,

    flex: 0.5,
    headerAlign: "left",
  },

  {
    field: "vendor",
    headerName: "VENDOR",
    headerClassName: (params) =>
      params.field === "vendor" ? "bold-header-style" : null,

    flex: 1,
    headerAlign: "left",
  },
  {
    field: "payoutCycle",
    headerName: "PAYOUT CYCLE",
    headerClassName: (params) =>
      params.field === "payoutCycle" ? "bold-header-style" : null,
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payoutStatus",
    headerName: "PAYOUT STATUS",
    headerClassName: (params) =>
      params.field === "payoutStatus" ? "bold-header-style" : null,
    cellClassName: "bold-column--cell",
    flex: 1,
    hide: false,
    headerAlign: "left",
  },
  {
    field: "cutOffDate",
    headerName: "CUTOFF DATE",
    headerClassName: (params) =>
      params.field === "cutOffDate" ? "bold-header-style" : null,
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "summaryAmount",
    headerName: "PAYOUT",
    flex: 1,
    headerClassName: (params) =>
      params.field === "summaryAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

// payout all tranasction details
// {
//   "yesId": "01173815076@yes.my",
//   "transactionNo": "YSHP0193c1006837",
//   "type": "MNP - Prepaid Sim Reimbursement",
//   "transactionDate": "2023-06-22",
//   "planName": "YES FT5G Prepaid Plan",
//   "transactionAmount": 0,
//   "incentiveAmount": 1.9,
//   "companyCode": "A0060",
//   "startDate": "2023-07-01",
//   "endDate": "2023-07-31",
//   "payoutCycle": "Weekly : 22nd - 30th/31st",
//   "payoutStatus": "Hold",
//   "payoutDate": "2023-07-08",
//   "id": 111671
// },
// payout summary columns
export const payoutAllTransactionColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.1,
    hide: true,
    headerClassName: (params) =>
      params.field === "id" ? "bold-header-style" : null,
    headerAlign: "left",
  },
  {
    field: "yesId",
    flex: 1,
    headerName: "YES ID",
    headerClassName: (params) =>
      params.field === "yesId" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "transactionNo",
    headerName: "TRANS. NO",
    flex: 0.9,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "transactionNo" ? "bold-header-style" : null,
  },
  {
    field: "type",
    headerName: "TYPE",
    flex: 1.5,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "type" ? "bold-header-style" : null,
  },
  {
    field: "transactionDate",
    headerName: "DATE",
    headerClassName: (params) =>
      params.field === "transactionDate" ? "bold-header-style" : null,
    flex: 0.5,
    headerAlign: "left",
  },
  {
    field: "planName",
    headerName: "NAME",
    headerClassName: (params) =>
      params.field === "planName" ? "bold-header-style" : null,
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "transactionAmount",
    headerName: "AMOUNT",
    flex: 0.5,
    headerClassName: (params) =>
      params.field === "transactionAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
  {
    field: "incentiveAmount",
    headerName: "INCENTIVE",
    flex: 0.5,
    headerClassName: (params) =>
      params.field === "incentiveAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
  {
    field: "companyCode",
    headerName: "CODE",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "startDate",
    headerName: "START",
    flex: 1,
    hide: true,

    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "endDate",
    headerName: "END",
    flex: 1,
    hide: true,

    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "payoutCycle",
    headerName: "CYCLE",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payoutStatus",
    headerName: "STATUS",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payoutDate",
    headerName: "PAYOUT DATE",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
];

export const onHoldAllTransactionColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.1,
    hide: true,
    headerClassName: (params) =>
      params.field === "id" ? "bold-header-style" : null,
    headerAlign: "left",
  },
  {
    field: "yesId",
    flex: 1,
    headerName: "YES ID",
    headerClassName: (params) =>
      params.field === "yesId" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "transactionNo",
    headerName: "TRANS. NO",
    flex: 0.9,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "transactionNo" ? "bold-header-style" : null,
  },
  {
    field: "type",
    headerName: "TYPE",
    flex: 1.5,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "type" ? "bold-header-style" : null,
  },
  {
    field: "transactionDate",
    headerName: "DATE",
    headerClassName: (params) =>
      params.field === "transactionDate" ? "bold-header-style" : null,
    flex: 0.5,
    headerAlign: "left",
  },
  {
    field: "planName",
    headerName: "NAME",
    headerClassName: (params) =>
      params.field === "planName" ? "bold-header-style" : null,
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "transactionAmount",
    headerName: "AMOUNT",
    flex: 0.5,
    headerClassName: (params) =>
      params.field === "transactionAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    hide: true,
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
  {
    field: "incentiveAmount",
    headerName: "INCENTIVE",
    flex: 0.5,
    headerClassName: (params) =>
      params.field === "incentiveAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
  {
    field: "companyCode",
    headerName: "CODE",
    flex: 1,

    hide: true,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "startDate",
    headerName: "START",
    flex: 1,
    hide: true,

    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "endDate",
    headerName: "END",
    flex: 1,
    hide: true,

    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "payoutCycle",
    headerName: "CYCLE",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payoutStatus",
    headerName: "STATUS",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payoutDate",
    headerName: "PAYOUT DATE",
    flex: 1,
    hide: true,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
];

// payout summary columns
export const payoutSummaryColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    headerAlign: "left",
  },
  {
    field: "payoutCycle",
    flex: 1,
    headerName: "CYCLE",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "payoutStatus",
    headerName: "STATUS",
    flex: 1,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    cellClassName: "name-column--cell",
  },
  {
    field: "cutOffDate",
    headerName: "CUT OFF",
    flex: 1,
    headerAlign: "left",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "payOutDate",
    headerName: "PAYOUT DATE",
    headerClassName: (params) =>
      params.field === "payOutDate" ? "bold-header-style" : null,
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-text-color-with-grey-color",
  },
  {
    field: "summaryAmount",
    headerName: "DETAILS",
    flex: 1,
    headerClassName: (params) =>
      params.field === "summaryAmount" ? "bold-header-style" : null,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
    renderCell: (params) => <CurrencyCellRenderer value={params.value} />,
  },
];

// get exclusion columns
export const exclusionColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "name",
    flex: 1,
    headerName: "NAME",
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "yesId",
    headerName: "YES ID",
    flex: 1,
    headerAlign: "left",
    cellClassName: "name-column--cell",
  },
  {
    field: "billingAccountNo",
    headerName: "BILLING ACCOUNT",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "exclusion",
    headerName: "EXCLUSION",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "until",
    headerName: "UNTIL",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
];

export const sampleColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    headerAlign: "left",
    cellClassName: "super-app-theme--cell",
  },
  {
    field: "registrarId",
    headerName: "REGISTER ID",
    flex: 1,
    headerAlign: "left",
    AlignVerticalCenter: true,
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 1,
    cellClassName: "name-column--cell",
    headerAlign: "left",
  },
  {
    field: "age",
    flex: 0.5,
    headerName: "AGE",
    type: "number",
    headerAlign: "left",
    align: "left",
    headerAlign: "left",
  },
  {
    field: "phone",
    headerName: "PHONE NUMBER",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "email",
    headerName: "EMAIL",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "address",
    headerName: "ADDRESS",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "city",
    headerName: "CITY",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "zipCode",
    headerName: "ZIPCODE",
    flex: 1,
    headerAlign: "left",
  },
];
