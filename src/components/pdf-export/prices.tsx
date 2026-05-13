import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export default function InvoicePricesPDF({
  prices,
  totalPrice,
}: {
  prices: {
    id: string;
    price: string;
  }[];
  totalPrice: string;
}) {
  return (
    <View style={[styles.flexCol, { gap: 4 }]}>
      <View
        style={[
          styles.flexCol,
          styles.bgWhite,
          styles.radiusL,
          styles.borderDark,
          { padding: '10 20 2 20' },
        ]}
      >
        <View style={[styles.flexRow, styles.justifyBetween, styles.textMD]}>
          <Text
            style={[
              styles.bgSlateDark,
              { padding: '4 10 6 10', borderRadius: 900, marginBottom: 11 },
            ]}
          >
            Item
          </Text>
          <Text
            style={[
              styles.bgSlateDark,
              { padding: '4 10 6 10', borderRadius: 900, marginBottom: 11 },
            ]}
          >
            Price
          </Text>
        </View>
        {prices.map((prc, index) => (
          <View
            key={index}
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.textSM,
              { borderTop: 1, borderTopColor: '#D9E2FF', padding: '16 0' },
            ]}
          >
            <Text>{prc.id}</Text>
            <Text>{prc.price}</Text>
          </View>
        ))}
      </View>

      <Text
        style={[
          styles.textMD,
          styles.radiusL,
          styles.borderDark,
          styles.bgWhite,
          { padding: '13 20', alignSelf: 'flex-end' },
        ]}
      >
        {totalPrice}
      </Text>
    </View>
  );
}
