import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export default function InvoiceDetailsPDF({
  details,
}: {
  details: {
    name: string;
    address: string;
    phone: number;
    email: string;
    delivery_type: string;
    id: string;
    due_date: string;
  };
}) {
  const truncate = (text: string, maxChars = 100) =>
    text?.length > maxChars ? text?.slice(0, maxChars) + '…' : text;

  return (
    <View
      style={[
        styles.flexRow,
        styles.bgWhite,
        styles.radiusL,
        styles.borderDark,
        {
          gap: 12,
          height: 120,
          padding: '9 28',
        },
      ]}
    >
      <View
        style={[
          styles.bgSlate,
          styles.flexCol,
          styles.radiusM,
          {
            padding: '8 16',
            gap: 10,
            width: '33%',
            justifyContent: 'flex-start',
          },
        ]}
      >
        <Text style={[styles.textXS]}>Invoice to:</Text>
        <View style={[styles.flexRow, styles.alignCenter, { gap: 4 }]}>
          <Svg width="20" height="20" viewBox="0 0 20 20">
            <Path
              d="M13.3337 5.83333C13.3337 7.67428 11.8412 9.16667 10.0003 9.16667C8.15938 9.16667 6.66699 7.67428 6.66699 5.83333C6.66699 3.99238 8.15938 2.5 10.0003 2.5C11.8412 2.5 13.3337 3.99238 13.3337 5.83333Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <Path
              d="M15.4435 13.8363L14.892 12.8989C14.4428 12.1354 13.6231 11.6667 12.7372 11.6667H7.26339C6.37755 11.6667 5.55785 12.1354 5.10865 12.8989L4.55718 13.8363C3.81196 15.103 4.01388 16.6419 5.43678 17.0095C7.96854 17.6635 12.0321 17.6635 14.5638 17.0095C15.9867 16.6419 16.1887 15.103 15.4435 13.8363Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={[styles.textSM]}>{details.name}</Text>
        </View>
        <Text style={[styles.textSM, styles.textSubtle]}>{truncate(details.address, 71)}</Text>
      </View>

      <View
        style={[
          styles.flexCol,
          styles.textXS,
          styles.border,
          styles.radiusM,
          styles.justifyCenter,
          { gap: 8, paddingLeft: 16, width: '33%' },
        ]}
      >
        <View>
          <Text style={styles.textSubtle}>Phone</Text>
          <Text style={styles.textXS}>{details.phone}</Text>
        </View>
        <View>
          <Text style={styles.textSubtle}>Email</Text>
          <Text style={styles.textXS}>{details.email}</Text>
        </View>
        <View>
          <Text style={styles.textSubtle}>Delivery Type</Text>
          <Text style={styles.textXS}>{details.delivery_type}</Text>
        </View>
      </View>

      <View style={[styles.flexCol, styles.textXS, { gap: 8, width: '33%' }]}>
        <View
          style={[
            styles.radiusM,
            styles.bgSlate,
            styles.flexCol,
            { gap: 4, padding: '10 16 10 16' },
          ]}
        >
          <Text style={styles.textSubtle}>Order ID</Text>
          <Text style={styles.textSM}>{details.id}</Text>
        </View>
        <View
          style={[
            styles.radiusM,
            styles.bgSlate,
            styles.flexCol,
            { gap: 4, padding: '10 16 10 16' },
          ]}
        >
          <Text style={styles.textSubtle}>Due Date</Text>
          <Text style={styles.textSM}>{details.due_date}</Text>
        </View>
      </View>
    </View>
  );
}
