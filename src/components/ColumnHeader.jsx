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
  },
];

// payout summary columns
export const payoutSummaryColumnHeader = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    hide: true,
    headerAlign: "left",
  },
  {
    field: "cycle",
    flex: 1,
    headerName: "CYCLE",
    headerAlign: "left",
    cellClassName: "bold-column--cell",
  },
  {
    field: "status",
    headerName: "STATUS",
    flex: 1,
    headerAlign: "left",
    cellClassName: "name-column--cell",
  },
  {
    field: "cutOff",
    headerName: "CUT OFF",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "payoutBy",
    headerName: "PAY OUT BY",
    flex: 1,
    headerAlign: "left",
  },
  {
    field: "details",
    headerName: "DETAILS",
    flex: 1,
    headerAlign: "left",
    cellClassName: "bold-column--cell",
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
