import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },

  alignStart: {
    alignItems: "flex-start",
  },

  bgWhite: {
    backgroundColor: '#FFF',
  },
  bgSlate: {
    backgroundColor: '#F1F5F9',
  },
  bgSlateDark: {
    backgroundColor: '#CBD5E1',
  },

  border: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  borderDark: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  textBody: {
    color: '#262626',
  },
  textSubtle: {
    color: '#737373',
  },
  textXS: {
    fontSize: 8,
    lineHeight: '12px',
  },
  textSM: {
    fontSize: 10,
    lineHeight: '14px',
  },
  textMD: {
    fontSize: 12,
    lineHeight: '12px',
  },

  radiusL: {
    borderRadius: 16,
  },

  radiusM: {
    borderRadius: 8,
  },

  radiusPill: {
    borderRadius: 900,
  },
});
