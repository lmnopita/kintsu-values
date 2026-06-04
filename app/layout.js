export const metadata = {
  title: 'Kintsu | Values Profile',
  description: 'Discover what actually matters to you in work. A free values ranking tool by Kintsu.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
