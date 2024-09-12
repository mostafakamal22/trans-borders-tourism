import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import dayjs from "dayjs";
import logo from "../../assets/imgs/trans-logo.png";
import stamp from "../../assets/imgs/trans-border-stamp.png";
import {
  billPassportTableHeader,
  billPassportTableRows,
  billTableRow,
  calculateTableTotals,
} from "./Table";
import {
  IBillDocument,
  IBillProduct,
} from "../../../../backend/models/billModel";
import { comapanyInfos } from "./constants";

Font.register({
  family: "roboto",

  src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf",
});

// Setup TailwindCSS for react-pdf
const tw = createTw(
  {
    theme: {
      fontFamily: {
        roboto: "roboto",
      },
    },
  },
  {
    // Set the base font size in points (see note below regarding units)
    ptPerRem: 12,
  }
);

interface ConvertedBillToPDFProps {
  bill: IBillDocument;
}

const styles = StyleSheet.create({
  page: tw("p-12 font-roboto"),
  container: tw("p-10"),
  header: tw("flex flex-row items-center justify-between"),
  logo: tw("w-[300px]"),
  details: tw("text-right"),
  table: tw("w-full mt-5 border border-gray-300"),
  tableHeader: tw("bg-red-100 text-gray-900 font-bold"),
  tableRow: tw("border-b"),
  totalsRow: tw("font-bold bg-red-100"),
  footer: tw("mt-10 flex flex-row items-center justify-center"),
  stamp: tw("w-[130px]"),
});

export default function ConvertedBillToPDF({ bill }: ConvertedBillToPDFProps) {
  const { totalAmount, totalServices, TotalVAT } = calculateTableTotals(
    bill.details
  );

  const TotalsRow = (
    <View style={styles.tableRow}>
      <Text></Text>
      <Text></Text>
      <Text style={styles.totalsRow}>{totalServices.toFixed(2)}</Text>
      <Text></Text>
      <Text style={styles.totalsRow}>{"0.00"}</Text>
      <Text style={styles.totalsRow}>{TotalVAT.toFixed(2)}</Text>
      <Text style={styles.totalsRow}>{totalAmount.toFixed(2)}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={tw("max-w-[300px] text-left text-sm")}>
              <Text style={tw("text-xl font-bold text-blue-700")}>
                {comapanyInfos.name[0]}
              </Text>
              <Text>TRN:- {comapanyInfos.TRN}</Text>
              <Text>{comapanyInfos.address}</Text>
              {comapanyInfos.tel.map((tel) => (
                <Text key={tel}>TEL:- {tel}</Text>
              ))}
              {comapanyInfos.mob.map((mob) => (
                <Text key={mob}>MOB:- {mob}</Text>
              ))}
              <Text>
                EMAIL:-{" "}
                <Text style={tw("text-blue-700 underline")}>
                  {comapanyInfos.email}
                </Text>
              </Text>
              <Text>
                WEBSITE:-{" "}
                <Text style={tw("text-blue-700 underline")}>
                  {comapanyInfos.website}
                </Text>
              </Text>
            </View>
            <Image style={styles.logo} src={logo} />
            <View style={styles.details}>
              <Text style={tw("text-3xl font-bold text-blue-400")}>
                TAX INVOICE
              </Text>
              <Text style={tw("text-sm")}>
                DATE{" "}
                <Text style={tw("bg-red-100 p-1")}>
                  {bill?.date ? dayjs(bill.date).format("DD/MM/YYYY") : "-"}
                </Text>
              </Text>
              <Text style={tw("text-sm")}>
                INVOICE # <Text style={tw("bg-red-100 p-1")}>[{bill.ID}]</Text>
              </Text>
            </View>
          </View>

          <View style={tw("mt-5 text-sm")}>
            <Text
              style={tw("mb-4 bg-red-100 p-1 text-base text-center font-bold")}
            >
              Bill To
            </Text>
            <Text>
              Name:- {bill?.customer?.name ? bill.customer.name : "-"}
            </Text>
            <Text>Mobile:- {"-"}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {/* Replace with actual table header */}
              {billPassportTableHeader}
            </View>
            <View>
              {bill.details.map((detail: IBillProduct, index: number) => (
                <View key={index}>
                  {detail.type === "Passport"
                    ? billPassportTableRows(detail, index)
                    : billTableRow(detail, index)}
                </View>
              ))}
              {TotalsRow}
            </View>
          </View>

          <View style={tw("my-10 flex flex-row flex-wrap gap-3")}>
            <Text>
              Paid Amount
              <Text style={tw("ml-4 bg-red-100 p-2")}>{bill?.total}</Text>
            </Text>
            <Text>
              Remaining Amount
              <Text style={tw("ml-4 bg-red-100 p-2")}>
                {bill?.remaining_amount ? bill.remaining_amount : 0}
              </Text>
            </Text>
            <Text>
              Payment Method
              <Text style={tw("ml-4 bg-red-100 p-2")}>
                {bill?.payment_method
                  ? bill.payment_method.charAt(0).toUpperCase() +
                    bill.payment_method.slice(1)
                  : "-"}
              </Text>
            </Text>
          </View>

          <View style={tw("mt-5")}>
            <Text style={tw("mb-4 bg-red-100 p-1 text-xl font-bold")}>
              Other Comments
            </Text>
            <Text>{!bill?.other ? "No Comment." : bill.other}</Text>
          </View>

          <View style={styles.footer}>
            <Image style={styles.stamp} src={stamp} />
            <View>
              <Text>
                If you have any questions about this bill, please contact us.
              </Text>
              <Text style={tw("text-lg font-bold")}>
                Thank You For Your Business!
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
