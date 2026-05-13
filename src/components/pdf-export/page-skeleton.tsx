import { Page } from '@react-pdf/renderer';
import { styles } from './styles';
import { ReactNode } from 'react';

export default function InvoicePagePDF({ children }: { children: ReactNode }) {
  return (
    <Page
      size="A4"
      style={[
        styles.bgSlate,
        styles.flexCol,
        styles.textBody,
        {
          gap: 8,
          padding: '20 38 8 38',
          fontFamily: 'RobotoFlex',
          fontWeight: 500,
          position: 'relative',
        },
      ]}
    >
      {children}
    </Page>
  );
}
