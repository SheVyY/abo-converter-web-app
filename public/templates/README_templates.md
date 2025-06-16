# CSV Templates for ABO Converter

## Available Templates

### 1. Raiffeisenbank Template
- **File**: `raiffeisen_template.csv`
- **Bank Code**: 5500
- **Format**: Standard Czech banking ABO format

### 2. FIO Bank Template
- **File**: `fio_template.csv`
- **Bank Code**: 2010
- **Format**: FIO specific ABO format

## Column Descriptions

| Column | Czech Name | Description | Required | Format |
|--------|------------|-------------|----------|---------|
| `vlastní účet` | Payer Account | Your account number | ✅ | `prefix-number` or `prefix-number/bank` |
| `účet protistrany` | Payee Account | Recipient account number | ✅ | `prefix-number/bank` or `prefix-number` |
| `částka` | Amount | Payment amount | ✅ | Decimal format: `1500.50` |
| `VS` | Variable Symbol | Transaction identifier | ⚪ | Up to 10 digits |
| `KS` | Constant Symbol | Payment type code | ⚪ | Usually `0308` for standard payments |
| `SS` | Specific Symbol | Additional identifier | ⚪ | Up to 10 digits |
| `název účtu prostistrany` | Payee Name | Recipient company/person name | ⚪ | Text, max 35 characters |
| `datum zaúčtování` | Due Date | Payment processing date | ⚪ | `DD.MM.YYYY` format |

## Usage Instructions

### For Excel:
1. Download the appropriate template (Raiffeisenbank or FIO)
2. Open in Microsoft Excel
3. Replace sample data with your payment information
4. Save as CSV (Comma delimited) format
5. Upload the CSV file to the ABO Converter

### For Google Sheets:
1. Download the template
2. Open Google Sheets and create new spreadsheet
3. Go to File → Import → Upload → select the template
4. Replace sample data with your payment information
5. Download as CSV: File → Download → Comma-separated values (.csv)
6. Upload the CSV file to the ABO Converter

## Important Notes

- **Amount Format**: Use decimal point (.) not comma for amounts
- **Account Numbers**: Include bank codes (/XXXX) for external banks
- **Character Encoding**: Use standard characters; Czech characters will be converted automatically
- **Date Format**: Use DD.MM.YYYY format (e.g., 10.06.2025)
- **Required Fields**: At minimum, provide payer account, payee account, and amount
- **ČNB Validation**: All account numbers are validated using Czech National Bank Modulo 11 algorithm

## Account Number Validation

All template accounts are **ČNB compliant** and pass Modulo 11 validation:

### FIO Bank Template Accounts ✅
- **Payer**: `2000775809/2010` (Valid FIO account)
- **Payees**: `1000000005`, `1000000013`, `1000000021`, `1000000048`, `1000000056` (All ČNB validated)

### Raiffeisenbank Template Accounts ✅
- **Payer**: `2892650103/5500` (Valid Raiffeisenbank account)
- **Payees**: Same validated accounts with appropriate bank codes

## Sample Data Explanation

The templates include realistic sample data:
- **ČNB validated account numbers** that pass real banking validation
- Multiple payment recipients with different banks
- Various amounts and payment purposes
- Proper account number formats for each bank
- Standard payment symbols used in Czech banking

Replace all sample data with your actual payment information before conversion. The webapp will validate all account numbers in real-time.