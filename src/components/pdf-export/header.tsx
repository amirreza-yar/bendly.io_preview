import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export default function InvoiceHeaderPDF() {
  return (
    <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter, { padding: '0 6' }]}>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Bendly</Text>
      <Svg width="43" height="43" viewBox="0 0 43 43">
        <Path
          d="M17.2728 5.95687L5.45873 17.7709M27.4109 5.95687L5.45873 27.9091M35.5261 7.97632L7.49501 36.0074M37.6004 16.0368L15.5939 38.0432M37.6004 26.1714L25.7286 38.0432M12.5417 38.125H30.4583C34.4164 38.125 37.625 34.9164 37.625 30.9583V13.0417C37.625 9.08363 34.4164 5.875 30.4583 5.875H12.5417C8.58363 5.875 5.375 9.08363 5.375 13.0417V30.9583C5.375 34.9164 8.58363 38.125 12.5417 38.125Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
